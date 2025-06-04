export type TableSchema = {
  name: string;
  columns: ColumnSchema[];
  primaryKey?: string;
  foreignKeys: ForeignKeySchema[];
};

export type ColumnSchema = {
  name: string;
  type: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  referencedTable?: string;
  referencedColumn?: string;
};

export type ForeignKeySchema = {
  columnName: string;
  referencedTable: string;
  referencedColumn: string;
};

export type DatabaseSchema = {
  tables: TableSchema[];
  success: boolean;
  error?: string;
};

/**
 * Generates a Mermaid diagram from the database schema
 */
export function generateMermaidDiagram(schema: DatabaseSchema): string {
  if (!schema.success || schema.tables.length === 0) {
    return "erDiagram\n  EmptySchema[Empty Schema]";
  }

  let diagram = "erDiagram\n";

  // Add tables and columns
  for (const table of schema.tables) {
    diagram += `  ${table.name} {\n`;

    for (const column of table.columns) {
      const pkIndicator = column.isPrimaryKey ? "PK " : "";
      const fkIndicator = column.isForeignKey ? "FK " : "";
      const nullableIndicator = column.isNullable ? "" : "NOT NULL ";

      diagram += `    ${column.type} ${pkIndicator}${fkIndicator}${column.name} ${nullableIndicator}\n`;
    }

    diagram += "  }\n";
  }

  // Add relationships
  for (const table of schema.tables) {
    for (const fk of table.foreignKeys) {
      diagram += `  ${table.name} }|--|| ${fk.referencedTable} : "${fk.columnName}"\n`;
    }
  }

  return diagram;
}

/**
 * Generates a simplified Mermaid diagram focusing on relationships
 */
export function generateSimplifiedMermaidDiagram(
  schema: DatabaseSchema,
): string {
  if (!schema.success || schema.tables.length === 0) {
    return "erDiagram\n  EmptySchema[Empty Schema]";
  }

  let diagram = "erDiagram\n";

  // Add tables only
  for (const table of schema.tables) {
    diagram += `  ${table.name}\n`;
  }

  // Add relationships
  for (const table of schema.tables) {
    for (const fk of table.foreignKeys) {
      diagram += `  ${table.name} }|--|| ${fk.referencedTable} : "${fk.columnName}"\n`;
    }
  }

  return diagram;
}
