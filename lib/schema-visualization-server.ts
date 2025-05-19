import { getServiceSupabase } from "@/app/lib/supabase/server"
import type { TableSchema, ColumnSchema, ForeignKeySchema, DatabaseSchema } from "./schema-visualization"

/**
 * Fetches the database schema for visualization
 */
export async function fetchDatabaseSchema(): Promise<DatabaseSchema> {
  try {
    const supabase = getServiceSupabase()

    // Get all tables in the public schema
    const { data: tables, error: tablesError } = await supabase.rpc("exec_sql", {
      sql_query: `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `,
    })

    if (tablesError) {
      throw new Error(`Error fetching tables: ${tablesError.message}`)
    }

    const tableSchemas: TableSchema[] = []

    // Process each table
    for (const tableRow of tables) {
      const tableName = tableRow.table_name

      // Get columns for this table
      const { data: columns, error: columnsError } = await supabase.rpc("exec_sql", {
        sql_query: `
          SELECT 
            c.column_name, 
            c.data_type, 
            c.is_nullable,
            c.column_default,
            (
              SELECT constraint_type 
              FROM information_schema.table_constraints tc
              JOIN information_schema.constraint_column_usage ccu 
                ON tc.constraint_name = ccu.constraint_name
              WHERE tc.table_name = c.table_name 
                AND ccu.column_name = c.column_name 
                AND tc.constraint_type = 'PRIMARY KEY'
            ) as is_primary_key
          FROM information_schema.columns c
          WHERE c.table_schema = 'public'
          AND c.table_name = '${tableName}'
          ORDER BY c.ordinal_position
        `,
      })

      if (columnsError) {
        console.error(`Error fetching columns for table ${tableName}:`, columnsError)
        continue
      }

      // Get foreign keys for this table
      const { data: foreignKeys, error: foreignKeysError } = await supabase.rpc("exec_sql", {
        sql_query: `
          SELECT
            kcu.column_name,
            ccu.table_name AS referenced_table,
            ccu.column_name AS referenced_column
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON tc.constraint_name = ccu.constraint_name
          WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = '${tableName}'
        `,
      })

      if (foreignKeysError) {
        console.error(`Error fetching foreign keys for table ${tableName}:`, foreignKeysError)
        continue
      }

      // Format foreign keys
      const formattedForeignKeys: ForeignKeySchema[] = foreignKeys.map((fk: any) => ({
        columnName: fk.column_name,
        referencedTable: fk.referenced_table,
        referencedColumn: fk.referenced_column,
      }))

      // Format columns
      const formattedColumns: ColumnSchema[] = columns.map((col: any) => {
        // Check if this column is a foreign key
        const foreignKey = formattedForeignKeys.find((fk) => fk.columnName === col.column_name)

        return {
          name: col.column_name,
          type: col.data_type,
          isNullable: col.is_nullable === "YES",
          isPrimaryKey: col.is_primary_key === "PRIMARY KEY",
          isForeignKey: !!foreignKey,
          referencedTable: foreignKey?.referencedTable,
          referencedColumn: foreignKey?.referencedColumn,
        }
      })

      // Find primary key
      const primaryKeyColumn = formattedColumns.find((col) => col.isPrimaryKey)

      tableSchemas.push({
        name: tableName,
        columns: formattedColumns,
        primaryKey: primaryKeyColumn?.name,
        foreignKeys: formattedForeignKeys,
      })
    }

    return {
      tables: tableSchemas,
      success: true,
    }
  } catch (error) {
    console.error("Error fetching database schema:", error)
    return {
      tables: [],
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
} 