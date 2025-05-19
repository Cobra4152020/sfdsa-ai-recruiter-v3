import { getServiceSupabase } from "@/app/lib/supabase/server"

export type TableInfo = {
  table_name: string
  exists: boolean
  columns: ColumnInfo[]
  constraints: ConstraintInfo[]
  issues: SchemaIssue[]
}

export type ColumnInfo = {
  column_name: string
  data_type: string
  is_nullable: string
  exists: boolean
}

export type ConstraintInfo = {
  constraint_name: string
  constraint_type: string
  definition: string
  exists: boolean
}

export type SchemaIssue = {
  type: "missing_table" | "missing_column" | "invalid_constraint" | "missing_constraint" | "other"
  description: string
  fixSql?: string
  severity: "high" | "medium" | "low"
  fixed?: boolean
}

export type SchemaVerificationResult = {
  tables: TableInfo[]
  globalIssues: SchemaIssue[]
  success: boolean
  error?: string
}

// Expected schema definition
const expectedSchema = {
  tables: [
    {
      name: "users",
      columns: [
        { name: "id", type: "uuid", nullable: false },
        { name: "name", type: "text", nullable: false },
        { name: "email", type: "text", nullable: false },
        { name: "avatar_url", type: "text", nullable: true },
        { name: "created_at", type: "timestamp with time zone", nullable: false },
        { name: "updated_at", type: "timestamp with time zone", nullable: false },
      ],
    },
    {
      name: "user_roles",
      columns: [
        { name: "id", type: "uuid", nullable: false },
        { name: "user_id", type: "uuid", nullable: false },
        { name: "role", type: "text", nullable: false },
        { name: "assigned_at", type: "timestamp with time zone", nullable: true },
        { name: "is_active", type: "boolean", nullable: true },
        { name: "updated_at", type: "timestamp with time zone", nullable: true },
        { name: "created_at", type: "timestamp with time zone", nullable: true },
      ],
      constraints: [
        {
          name: "user_roles_role_check",
          type: "CHECK",
          definition: "CHECK (role IN ('recruit', 'volunteer', 'admin'))",
        },
      ],
    },
    {
      name: "user_types",
      columns: [
        { name: "user_id", type: "uuid", nullable: false },
        { name: "user_type", type: "text", nullable: false },
        { name: "created_at", type: "timestamp with time zone", nullable: true },
      ],
    },
    {
      name: "badges",
      columns: [
        { name: "id", type: "uuid", nullable: false },
        { name: "name", type: "text", nullable: false },
        { name: "description", type: "text", nullable: false },
        { name: "image_url", type: "text", nullable: false },
        { name: "criteria", type: "text", nullable: false },
        { name: "points", type: "integer", nullable: false },
        { name: "created_at", type: "timestamp with time zone", nullable: false },
      ],
    },
    {
      name: "user_badges",
      columns: [
        { name: "id", type: "uuid", nullable: false },
        { name: "user_id", type: "uuid", nullable: false },
        { name: "badge_id", type: "uuid", nullable: false },
        { name: "awarded_at", type: "timestamp with time zone", nullable: false },
      ],
    },
    {
      name: "applicants",
      columns: [
        { name: "id", type: "uuid", nullable: false },
        { name: "user_id", type: "uuid", nullable: false },
        { name: "name", type: "text", nullable: false },
        { name: "email", type: "text", nullable: false },
        { name: "status", type: "text", nullable: false },
        { name: "created_at", type: "timestamp with time zone", nullable: false },
      ],
    },
  ],
}

/**
 * Verifies the database schema against the expected schema
 */
export async function verifyDatabaseSchema(): Promise<SchemaVerificationResult> {
  try {
    const supabase = getServiceSupabase()
    const tables: TableInfo[] = []
    const globalIssues: SchemaIssue[] = []

    // Check if the function_exists function exists
    const { data: functionExists, error: functionCheckError } = await supabase.rpc("function_exists", {
      function_name: "function_exists",
    })

    if (functionCheckError || !functionExists) {
      globalIssues.push({
        type: "other",
        description: "The function_exists function is missing",
        fixSql: `
          CREATE OR REPLACE FUNCTION function_exists(function_name TEXT)
          RETURNS BOOLEAN AS $$
          BEGIN
            RETURN EXISTS (
              SELECT 1 FROM pg_proc p
              JOIN pg_namespace n ON p.pronamespace = n.oid
              WHERE p.proname = function_name
              AND n.nspname = 'public'
            );
          END;
          $$ LANGUAGE plpgsql;
        `,
        severity: "medium",
      })
    }

    // Check if the table_exists function exists
    const { data: tableExistsFunction, error: tableExistsFunctionError } = await supabase.rpc("function_exists", {
      function_name: "table_exists",
    })

    if (tableExistsFunctionError || !tableExistsFunction) {
      globalIssues.push({
        type: "other",
        description: "The table_exists function is missing",
        fixSql: `
          CREATE OR REPLACE FUNCTION table_exists(table_name TEXT)
          RETURNS BOOLEAN AS $$
          BEGIN
            RETURN EXISTS (
              SELECT 1 FROM information_schema.tables
              WHERE table_schema = 'public'
              AND table_name = table_exists.table_name
            );
          END;
          $$ LANGUAGE plpgsql;
        `,
        severity: "medium",
      })
    }

    // Check if the column_exists function exists
    const { data: columnExistsFunction, error: columnExistsFunctionError } = await supabase.rpc("function_exists", {
      function_name: "column_exists",
    })

    if (columnExistsFunctionError || !columnExistsFunction) {
      globalIssues.push({
        type: "other",
        description: "The column_exists function is missing",
        fixSql: `
          CREATE OR REPLACE FUNCTION column_exists(table_name TEXT, column_name TEXT)
          RETURNS BOOLEAN AS $$
          BEGIN
            RETURN EXISTS (
              SELECT 1 FROM information_schema.columns
              WHERE table_schema = 'public'
              AND table_name = column_exists.table_name
              AND column_name = column_exists.column_name
            );
          END;
          $$ LANGUAGE plpgsql;
        `,
        severity: "medium",
      })
    }

    // Check if the constraint_exists function exists
    const { data: constraintExistsFunction, error: constraintExistsFunctionError } = await supabase.rpc(
      "function_exists",
      {
        function_name: "constraint_exists",
      },
    )

    if (constraintExistsFunctionError || !constraintExistsFunction) {
      globalIssues.push({
        type: "other",
        description: "The constraint_exists function is missing",
        fixSql: `
          CREATE OR REPLACE FUNCTION constraint_exists(table_name TEXT, constraint_name TEXT)
          RETURNS BOOLEAN AS $$
          BEGIN
            RETURN EXISTS (
              SELECT 1 FROM information_schema.table_constraints
              WHERE table_schema = 'public'
              AND table_name = constraint_exists.table_name
              AND constraint_name = constraint_exists.constraint_name
            );
          END;
          $$ LANGUAGE plpgsql;
        `,
        severity: "medium",
      })
    }

    // Fix utility functions if needed
    if (globalIssues.length > 0) {
      for (const issue of globalIssues) {
        if (issue.fixSql) {
          try {
            await supabase.rpc("exec_sql", { sql_query: issue.fixSql })
            issue.fixed = true
          } catch (error) {
            console.error(`Error fixing issue: ${issue.description}`, error)
          }
        }
      }
    }

    // Check each expected table
    for (const expectedTable of expectedSchema.tables) {
      const tableInfo: TableInfo = {
        table_name: expectedTable.name,
        exists: false,
        columns: [],
        constraints: [],
        issues: [],
      }

      // Check if table exists
      const { data: tableExists, error: tableExistsError } = await supabase.rpc("table_exists", {
        table_name: expectedTable.name,
      })

      if (tableExistsError) {
        console.error(`Error checking if table ${expectedTable.name} exists:`, tableExistsError)
        tableInfo.issues.push({
          type: "other",
          description: `Error checking if table exists: ${tableExistsError.message}`,
          severity: "high",
        })
      } else {
        tableInfo.exists = tableExists || false

        if (!tableExists) {
          // Table doesn't exist, create fix SQL
          let createTableSql = `CREATE TABLE IF NOT EXISTS ${expectedTable.name} (\n`
          const columnDefs = expectedTable.columns.map((col) => {
            return `  ${col.name} ${col.type}${col.nullable ? "" : " NOT NULL"}`
          })

          createTableSql += columnDefs.join(",\n")

          // Add primary key if id column exists
          if (expectedTable.columns.some((col) => col.name === "id")) {
            createTableSql += ",\n  PRIMARY KEY (id)"
          }

          createTableSql += "\n);"

          tableInfo.issues.push({
            type: "missing_table",
            description: `Table ${expectedTable.name} does not exist`,
            fixSql: createTableSql,
            severity: "high",
          })
        } else {
          // Table exists, check columns
          for (const expectedColumn of expectedTable.columns) {
            const { data: columnExists, error: columnExistsError } = await supabase.rpc("column_exists", {
              table_name: expectedTable.name,
              column_name: expectedColumn.name,
            })

            if (columnExistsError) {
              console.error(`Error checking if column ${expectedColumn.name} exists:`, columnExistsError)
              tableInfo.issues.push({
                type: "other",
                description: `Error checking if column ${expectedColumn.name} exists: ${columnExistsError.message}`,
                severity: "medium",
              })
            } else {
              const columnInfo: ColumnInfo = {
                column_name: expectedColumn.name,
                data_type: expectedColumn.type,
                is_nullable: expectedColumn.nullable ? "YES" : "NO",
                exists: columnExists || false,
              }

              tableInfo.columns.push(columnInfo)

              if (!columnExists) {
                // Column doesn't exist, create fix SQL
                const alterTableSql = `ALTER TABLE ${expectedTable.name} ADD COLUMN IF NOT EXISTS ${expectedColumn.name} ${expectedColumn.type}${expectedColumn.nullable ? "" : " NOT NULL"};`

                tableInfo.issues.push({
                  type: "missing_column",
                  description: `Column ${expectedColumn.name} does not exist in table ${expectedTable.name}`,
                  fixSql: alterTableSql,
                  severity: "high",
                })
              }
            }
          }

          // Check constraints if defined
          if (expectedTable.constraints) {
            for (const expectedConstraint of expectedTable.constraints) {
              const { data: constraintExists, error: constraintExistsError } = await supabase.rpc("constraint_exists", {
                table_name: expectedTable.name,
                constraint_name: expectedConstraint.name,
              })

              if (constraintExistsError) {
                console.error(`Error checking if constraint ${expectedConstraint.name} exists:`, constraintExistsError)
                tableInfo.issues.push({
                  type: "other",
                  description: `Error checking if constraint ${expectedConstraint.name} exists: ${constraintExistsError.message}`,
                  severity: "medium",
                })
              } else {
                const constraintInfo: ConstraintInfo = {
                  constraint_name: expectedConstraint.name,
                  constraint_type: expectedConstraint.type,
                  definition: expectedConstraint.definition,
                  exists: constraintExists || false,
                }

                tableInfo.constraints.push(constraintInfo)

                if (!constraintExists) {
                  // Constraint doesn't exist, create fix SQL
                  const alterTableSql = `
                    ALTER TABLE ${expectedTable.name} 
                    ADD CONSTRAINT ${expectedConstraint.name} 
                    ${expectedConstraint.definition};
                  `

                  tableInfo.issues.push({
                    type: "missing_constraint",
                    description: `Constraint ${expectedConstraint.name} does not exist in table ${expectedTable.name}`,
                    fixSql: alterTableSql,
                    severity: "high",
                  })
                }
              }
            }
          }
        }
      }

      tables.push(tableInfo)
    }

    // Special check for user_roles constraint
    const userRolesTable = tables.find((t) => t.table_name === "user_roles")
    if (userRolesTable && userRolesTable.exists) {
      // Get constraint definition
      const { data: constraints, error: constraintsError } = await supabase
        .from("information_schema.table_constraints")
        .select("constraint_name, constraint_type")
        .eq("table_name", "user_roles")
        .eq("constraint_type", "CHECK")

      if (!constraintsError && constraints) {
        for (const constraint of constraints) {
          // Get constraint definition
          const { data: constraintDef, error: constraintDefError } = await supabase.rpc("exec_sql", {
            sql_query: `
              SELECT pg_get_constraintdef(oid) as definition
              FROM pg_constraint
              WHERE conname = '${constraint.constraint_name}'
            `,
          })

          if (!constraintDefError && constraintDef) {
            // Check if constraint is checking user_type instead of role
            if (constraintDef[0]?.definition?.includes("user_type")) {
              userRolesTable.issues.push({
                type: "invalid_constraint",
                description: `Constraint ${constraint.constraint_name} is checking 'user_type' column which doesn't exist`,
                fixSql: `
                  ALTER TABLE user_roles DROP CONSTRAINT ${constraint.constraint_name};
                  ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check 
                  CHECK (role IN ('recruit', 'volunteer', 'admin'));
                `,
                severity: "high",
              })
            }
          }
        }
      }
    }

    return {
      tables,
      globalIssues,
      success: true,
    }
  } catch (error) {
    console.error("Error verifying database schema:", error)
    return {
      tables: [],
      globalIssues: [
        {
          type: "other",
          description: `Error verifying database schema: ${error instanceof Error ? error.message : String(error)}`,
          severity: "high",
        },
      ],
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Fixes database schema issues
 */
export async function fixDatabaseSchemaIssues(
  issues: SchemaIssue[],
): Promise<{ success: boolean; fixed: SchemaIssue[]; error?: string }> {
  try {
    const supabase = getServiceSupabase()
    const fixedIssues: SchemaIssue[] = []

    for (const issue of issues) {
      if (issue.fixSql) {
        try {
          const { error } = await supabase.rpc("exec_sql", { sql_query: issue.fixSql })

          if (error) {
            console.error(`Error fixing issue: ${issue.description}`, error)
          } else {
            fixedIssues.push({ ...issue, fixed: true })
          }
        } catch (error) {
          console.error(`Error fixing issue: ${issue.description}`, error)
        }
      }
    }

    return {
      success: true,
      fixed: fixedIssues,
    }
  } catch (error) {
    console.error("Error fixing database schema issues:", error)
    return {
      success: false,
      fixed: [],
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Checks if a specific table has issues
 */
export async function checkTableIssues(tableName: string): Promise<TableInfo | null> {
  try {
    const result = await verifyDatabaseSchema()
    return result.tables.find((t) => t.table_name === tableName) || null
  } catch (error) {
    console.error(`Error checking issues for table ${tableName}:`, error)
    return null
  }
}

/**
 * Fixes issues for a specific table
 */
export async function fixTableIssues(
  tableName: string,
): Promise<{ success: boolean; fixed: SchemaIssue[]; error?: string }> {
  try {
    const tableInfo = await checkTableIssues(tableName)

    if (!tableInfo) {
      return {
        success: false,
        fixed: [],
        error: `Table ${tableName} not found in schema verification`,
      }
    }

    return await fixDatabaseSchemaIssues(tableInfo.issues)
  } catch (error) {
    console.error(`Error fixing issues for table ${tableName}:`, error)
    return {
      success: false,
      fixed: [],
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
