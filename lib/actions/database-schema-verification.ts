export async function databaseSchemaVerification(params: any) {
  try {
    const response = await fetch(`/api/admin-actions/database-schema-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to verify database schema`);
    }

    return data;
  } catch (error) {
    console.error(`Error in databaseSchemaVerification:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function verifySchema() {
  return databaseSchemaVerification({ action: 'verifySchema' });
}

export async function fixAllIssues() {
  return databaseSchemaVerification({ action: 'fixAllIssues' });
}

export async function fixTableIssuesAction(tableName: string) {
  return databaseSchemaVerification({ action: 'fixTableIssues', tableName });
}

export async function fixSpecificIssues(issueIndices: number[]) {
  return databaseSchemaVerification({ action: 'fixSpecificIssues', issueIndices });
}

export async function runCustomFix(sql: string) {
  return databaseSchemaVerification({ action: 'runCustomFix', sql });
}