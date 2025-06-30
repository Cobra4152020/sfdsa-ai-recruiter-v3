"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { runDatabaseSetup } from "@/app/actions/database-setup";
import { toast } from "@/components/ui/use-toast";

export function DatabaseSetupButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async () => {
    setIsLoading(true);

    try {
      const result = await runDatabaseSetup();

      if (result.success) {
        toast({
          title: "Database setup successful",
          description: "The database schema has been updated successfully.",
        });
      } else {
        toast({
          title: "Database setup failed",
          description: result.error
            ? String(result.error)
            : "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error setting up database:", error);
      toast({
        title: "Database setup failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSetup}
      disabled={isLoading}
      className="bg-primary hover:bg-primary/90"
    >
      {isLoading ? "Setting up database..." : "Setup Database"}
    </Button>
  );
}
