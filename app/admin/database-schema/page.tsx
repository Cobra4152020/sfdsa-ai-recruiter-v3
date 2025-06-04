import { SchemaVerificationTool } from "@/components/admin/schema-verification-tool";

export default function DatabaseSchemaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SchemaVerificationTool />
    </div>
  );
}
