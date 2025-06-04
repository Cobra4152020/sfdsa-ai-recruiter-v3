import Image from "next/image";
import { CheckCircle, FileText, DollarSign, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GIBillContent() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-[#FFD700]">
            G.I. Bill Benefits
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            As a veteran, you can use your G.I. Bill benefits to help fund your
            training and education as you transition to a career with the San
            Francisco Sheriff&apos;s Office.
          </p>
        </div>

        <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-10">
          <Image
            src="/veterans-law-enforcement-training.png"
            alt="Veterans in law enforcement training"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white">
                From Service to Sheriff
              </h2>
              <p className="text-white/80">
                Continue your service to the community in a new role
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="eligibility" className="mb-10">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="eligibility">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Eligibility Requirements
                </CardTitle>
                <CardDescription>
                  Find out if you qualify for G.I. Bill benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To be eligible for G.I. Bill benefits as a San Francisco
                  Deputy Sheriff recruit, you must meet the following criteria:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Have served at least 90 days of active duty service after
                    September 10, 2001
                  </li>
                  <li>Have received an honorable discharge</li>
                  <li>Have remaining G.I. Bill benefits available to use</li>
                  <li>
                    Be accepted into the San Francisco Sheriff&apos;s Office
                    training program
                  </li>
                </ul>
                <p className="text-sm text-gray-400 mt-4">
                  Note: Different types of G.I. Bill programs have different
                  eligibility requirements. Contact our veteran liaison for
                  specific details about your situation.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                  Available Benefits
                </CardTitle>
                <CardDescription>
                  What the G.I. Bill covers for Deputy Sheriff training
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  As a qualified veteran, your G.I. Bill benefits may cover:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-[#0A3C1F]/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#FFD700] mb-2">
                      Training Costs
                    </h3>
                    <p>
                      Full or partial coverage of the Sheriff&apos;s Academy
                      training program costs
                    </p>
                  </div>
                  <div className="bg-[#0A3C1F]/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#FFD700] mb-2">
                      Housing Allowance
                    </h3>
                    <p>
                      Monthly housing allowance based on the ZIP code of the
                      training facility
                    </p>
                  </div>
                  <div className="bg-[#0A3C1F]/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#FFD700] mb-2">
                      Books & Supplies
                    </h3>
                    <p>
                      Annual stipend for books and supplies required for
                      training
                    </p>
                  </div>
                  <div className="bg-[#0A3C1F]/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#FFD700] mb-2">
                      Continuing Education
                    </h3>
                    <p>
                      Support for additional law enforcement certifications and
                      education
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="application">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 text-green-500 mr-2" />
                  Application Process
                </CardTitle>
                <CardDescription>
                  Steps to apply your G.I. Bill benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal pl-5 space-y-4">
                  <li>
                    <h3 className="font-semibold">Verify Your Eligibility</h3>
                    <p>
                      Check your eligibility and remaining benefits through the
                      VA&apos;s eBenefits portal or by calling 1-888-GI-BILL-1.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Apply to the Sheriff&apos;s Office
                    </h3>
                    <p>
                      Complete your application to the San Francisco
                      Sheriff&apos;s Office and mention your veteran status.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">Submit VA Form 22-1990</h3>
                    <p>
                      If you haven&apos;t used your G.I. Bill benefits before,
                      submit VA Form 22-1990 (Application for VA Education
                      Benefits).
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Receive Certificate of Eligibility
                    </h3>
                    <p>
                      After your application is processed, you&apos;ll receive a
                      Certificate of Eligibility (COE) from the VA.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Submit COE to Veterans Liaison
                    </h3>
                    <p>
                      Provide your COE to our Veterans Liaison who will help
                      coordinate your benefits with the training program.
                    </p>
                  </li>
                </ol>
                <div className="bg-[#0A3C1F]/10 p-4 rounded-lg mt-6">
                  <h3 className="font-semibold text-[#FFD700] mb-2">
                    Need Assistance?
                  </h3>
                  <p>
                    Our dedicated Veterans Liaison is available to help you
                    navigate the G.I. Bill application process. Contact us at
                    veterans@sfdeputysheriff.com or call (415) 554-7225.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-green-500 mr-2" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Common questions about using G.I. Bill benefits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-[#FFD700]">
                    Can I use my G.I. Bill benefits for the Sheriff&apos;s
                    Academy?
                  </h3>
                  <p>
                    Yes, the San Francisco Sheriff&apos;s Academy is an approved
                    program for G.I. Bill benefits. The specific amount covered
                    depends on your eligibility and benefit type.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFD700]">
                    Will my benefits cover the entire cost of training?
                  </h3>
                  <p>
                    Post-9/11 G.I. Bill benefits may cover up to 100% of your
                    training costs, depending on your length of service and
                    eligibility percentage.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFD700]">
                    Can I receive a housing allowance while in training?
                  </h3>
                  <p>
                    Yes, eligible veterans can receive a monthly housing
                    allowance based on the E-5 with dependents rate for the ZIP
                    code of the training facility.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFD700]">
                    What if I&apos;ve already used some of my G.I. Bill
                    benefits?
                  </h3>
                  <p>
                    You can use your remaining benefits for Sheriff&apos;s
                    training. Our Veterans Liaison can help you determine how
                    many months of benefits you have left.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFD700]">
                    Is there a time limit for using my G.I. Bill benefits?
                  </h3>
                  <p>
                    For Post-9/11 G.I. Bill, benefits must generally be used
                    within 15 years of your last discharge date if you were
                    discharged before January 1, 2013. There is no time limit
                    for those discharged after that date.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-[#0A3C1F] p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-3">
            Ready to Serve Again?
          </h2>
          <p className="text-white mb-6">
            Let us help you transition your military experience into a rewarding
            career with the San Francisco Sheriff&apos;s Office.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-medium">
              Apply Now
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Contact Veterans Liaison
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
