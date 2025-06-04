"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateDatabaseSchema } from "@/app/actions/database-schema-update";
import { useToast } from "@/components/ui/use-toast";

export function DatabaseSchemaUpdateButton() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const result = await updateDatabaseSchema();

      if (result.success) {
        toast({
          title: "Database schema updated",
          description:
            "The database schema has been successfully updated with separate user tables.",
          variant: "default",
        });
      } else {
        toast({
          title: "Update failed",
          description: result.error || "Failed to update database schema.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating schema:", error);
      toast({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      onClick={handleUpdate}
      disabled={isUpdating}
      className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/80"
    >
      {isUpdating ? "Updating Schema..." : "Update Database Schema"}
    </Button>
  );
}
