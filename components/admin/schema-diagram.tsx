"use client";

import { useEffect, useState } from "react";
import { fetchDatabaseSchema } from "@/lib/actions/fetch-database-schema";
import { DatabaseSchema } from "@/lib/schema-visualization";
import { SchemaVisualization } from "@/components/admin/schema-visualization";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function SchemaDiagram() {
  const [schema, setSchema] = useState<DatabaseSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const result = await fetchDatabaseSchema({});
        if (result.success) {
          setSchema(result.data);
        } else {
          setError(result.error || "Failed to load schema");
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSchema();
  }, []);

  if (isLoading) {
    return <div>Loading schema...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!schema) {
    return <div>No schema data available</div>;
  }

  return <SchemaVisualization schema={schema} />;
}
