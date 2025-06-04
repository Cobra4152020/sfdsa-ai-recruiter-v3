"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateUserRolesSchema } from "@/lib/actions/update-user-roles-schema";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function UpdateUserRolesButton() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setResult(null);

    try {
      const updateResult = await updateUserRolesSchema({});
      setResult(updateResult);
    } catch (error) {
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleUpdate} disabled={isUpdating} variant="default">
        {isUpdating ? "Updating Schema..." : "Update User Roles Schema"}
      </Button>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>
            {result.success
              ? "User roles schema has been updated successfully."
              : `Failed to update user roles schema: ${result.error}`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
