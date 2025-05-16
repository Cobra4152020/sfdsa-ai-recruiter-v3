import { PageWrapper } from "@/components/page-wrapper"

export default function AdminLoginTestPage() {
  return (
    <PageWrapper>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Login Test Page</h1>
        <p>If you can see this page, the route is working correctly.</p>
        <p className="mt-4">
          <a href="/admin/login" className="text-blue-500 underline">
            Go to Admin Login
          </a>
        </p>
      </div>
    </PageWrapper>
  )
}
