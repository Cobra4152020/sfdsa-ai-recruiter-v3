"use client";

import { PageWrapper } from "@/components/page-wrapper";
import { PointsGate } from "@/components/points-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Shield, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { availableTests, PracticeTest } from "@/lib/practice-test-data";

const PracticeTestsContent = () => {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          Practice Exams
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Prepare for success. Access these tools to get ready for the official SFSO examinations.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {availableTests.map((test) => (
            <Card key={test.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <test.icon className="h-10 w-10 text-primary" />
                    <CardTitle>{test.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{test.description}</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{test.questions} Questions</span>
                  <span>{test.durationMinutes} min</span>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <PointsGate
                  requiredPoints={test.pointsToUnlock}
                  pageName={test.title}
                  pageDescription="You have not yet unlocked this practice test."
                >
                  <Link href={`/practice-tests/${test.id}`} passHref>
                    <Button className="w-full">
                      Start Test
                    </Button>
                  </Link>
                </PointsGate>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default function PracticeTestsPage() {
  return (
    <PointsGate
      requiredPoints={100}
      pageName="Practice Exam Center"
      pageDescription="Access to the Practice Exam Center is a premium feature. Earn points through platform engagement to unlock these valuable preparation tools."
      imageUrl="/images/testing-center-dalle.png"
    >
      <PracticeTestsContent />
    </PointsGate>
  );
} 