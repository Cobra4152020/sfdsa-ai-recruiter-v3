import { Spinner } from "@/components/ui/spinner";

export default function LoginAuditLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center h-64">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">
          Loading login audit data...
        </p>
      </div>
    </div>
  );
}
