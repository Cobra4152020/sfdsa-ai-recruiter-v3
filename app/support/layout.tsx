import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Support | SF Deputy Sheriff Recruitment",
  description: "Get help with your application process or general inquiries about becoming a San Francisco Deputy Sheriff.",
}

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 