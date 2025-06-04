"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertCircle,
  Database,
  Play,
  Save,
  Trash,
} from "lucide-react";
import { runSqlQuery } from "@/lib/actions/run-sql-query";
import { Input } from "@/components/ui/input";

export function SqlQueryRunner() {
  const [query, setQuery] = useState("");
  const [savedQueries, setSavedQueries] = useState<
    { name: string; query: string }[]
  >([]);
  const [queryName, setQueryName] = useState("");
  const [result, setResult] = useState<{
    success?: boolean;
    data?: unknown;
    error?: string;
    query?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [revalidatePaths, setRevalidatePaths] = useState("");

  const handleRunQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResult({});

    try {
      const paths = revalidatePaths
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      const result = await runSqlQuery(query, paths);
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        query,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveQuery = () => {
    if (!query.trim() || !queryName.trim()) return;

    setSavedQueries([...savedQueries, { name: queryName, query }]);
    setQueryName("");
  };

  const loadQuery = (savedQuery: string) => {
    setQuery(savedQuery);
  };

  const deleteQuery = (index: number) => {
    const newQueries = [...savedQueries];
    newQueries.splice(index, 1);
    setSavedQueries(newQueries);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            SQL Query Runner
          </CardTitle>
          <CardDescription>
            Execute SQL queries directly against your database. Use with
            caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium mb-2">
              SQL Query
            </label>
            <Textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SELECT * FROM users LIMIT 10;"
              className="font-mono h-40"
            />
          </div>

          <div>
            <label
              htmlFor="revalidatePaths"
              className="block text-sm font-medium mb-2"
            >
              Paths to Revalidate (comma separated)
            </label>
            <Input
              id="revalidatePaths"
              value={revalidatePaths}
              onChange={(e) => setRevalidatePaths(e.target.value)}
              placeholder="/admin/users,/dashboard"
            />
            <p className="text-xs text-gray-500 mt-1">
              Specify paths that should be revalidated after query execution
            </p>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label
                htmlFor="queryName"
                className="block text-sm font-medium mb-2"
              >
                Save Query
              </label>
              <Input
                id="queryName"
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                placeholder="Query name"
              />
            </div>
            <Button
              variant="outline"
              onClick={saveQuery}
              disabled={!query.trim() || !queryName.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            {savedQueries.map((saved, index) => (
              <div key={index} className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadQuery(saved.query)}
                >
                  {saved.name}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteQuery(index)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={handleRunQuery}
            disabled={isLoading || !query.trim()}
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? "Running..." : "Run Query"}
          </Button>
        </CardFooter>
      </Card>

      {result.success !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Query Executed Successfully
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Query Execution Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <div>
                <h3 className="font-medium mb-2">Result:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            )}

            {result.query && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Executed Query:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-40 text-sm">
                  {result.query}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
