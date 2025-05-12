import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login - SFDSA Recruiter",
  description: "Login to your SFDSA Recruiter account",
}

export default function LoginPage() {
  return (
    <div className="container flex h-[calc(100vh-8rem)] items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
