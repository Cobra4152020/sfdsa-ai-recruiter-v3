import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkipToContent } from "@/components/skip-to-content";
import { PageWrapper } from "@/components/page-wrapper";

interface GameLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function GameLayout({ children, title, description }: GameLayoutProps) {
  return (
    <PageWrapper>
      <SkipToContent />
      <main
        id="main-content"
        className="flex-1 py-8 px-4 md:px-6 lg:px-8 bg-white"
      >
        <div className="container mx-auto">
          <Card className="w-full border-primary border-t-4">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="text-2xl md:text-3xl text-primary">
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">{children}</CardContent>
          </Card>
        </div>
      </main>
    </PageWrapper>
  );
}
