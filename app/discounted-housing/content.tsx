import Image from "next/image"
import { Home, MapPin, FileText, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DiscountedHousingContent() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-[#FFD700]">Discounted Housing Programs</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            As a San Francisco Deputy Sheriff, you have access to special housing programs designed to make living in
            and around San Francisco more affordable.
          </p>
        </div>

        <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-10">
          <Image
            src="/san-francisco-apartments.png"
            alt="San Francisco housing"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white">Live Where You Serve</h2>
              <p className="text-white/80">Special housing options for San Francisco's finest</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="programs" className="mb-10">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 text-green-500 mr-2" />
                  Housing Programs
                </CardTitle>
                <CardDescription>Available housing assistance for Deputy Sheriffs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The San Francisco Sheriff's Office partners with various organizations to provide housing assistance
                  to our deputies. These programs include:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-[#0A3C1F]/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#FFD700] mb-2">First Responder Housing Program</h3>
                    <p>
                      Reduced rent at participating apartment complexes throughout San Francisco and surrounding
                      communities.
                    </p>
                  </div>
                  <div className="bg-[#0A3C1F]/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#FFD700] mb-2">Down Payment Assistance</h3>
                    <p>
                      Low-interest loans and grants to help with down payments for first-time home buyers in the
                      department.
                    </p>
                  </div>
                  <div className="bg-[#0A3C1F]/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#FFD700] mb-2">Below Market Rate Units</h3>
                    <p>Access to BMR units set aside specifically for law enforcement personnel in new developments.</p>
                  </div>
                  <div className="bg-[#0A3C1F]/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#FFD700] mb-2">Commuter Assistance</h3>
                    <p>Subsidies for deputies who live outside the city but commute to work in San Francisco.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-500 mr-2" />
                  Available Locations
                </CardTitle>
                <CardDescription>Where you can find discounted housing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Discounted housing options for San Francisco Deputy Sheriffs are available in various neighborhoods
                  and surrounding communities:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-[#0A3C1F]/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#FFD700] mb-2">San Francisco</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Mission District</li>
                      <li>Sunset District</li>
                      <li>Bayview</li>
                      <li>Excelsior</li>
                      <li>Visitacion Valley</li>
                    </ul>
                  </div>
                  <div className="bg-[#0A3C1F]/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#FFD700] mb-2">East Bay</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Oakland</li>
                      <li>Berkeley</li>
                      <li>Alameda</li>
                      <li>San Leandro</li>
                      <li>Hayward</li>
                    </ul>
                  </div>
                  <div className="bg-[#0A3C1F]/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#FFD700] mb-2">South Bay</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Daly City</li>
                      <li>South San Francisco</li>
                      <li>San Bruno</li>
                      <li>Millbrae</li>
                      <li>San Mateo</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Note: Available properties change regularly. Contact our housing coordinator for the most up-to-date
                  listings.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eligibility">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 text-green-500 mr-2" />
                  Eligibility Requirements
                </CardTitle>
                <CardDescription>Who qualifies for housing assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To qualify for the Deputy Sheriff housing assistance programs, you must meet the following criteria:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Be a current, full-time employee of the San Francisco Sheriff's Office</li>
                  <li>Have completed your probationary period (for certain programs)</li>
                  <li>Meet income requirements specific to each program</li>
                  <li>Commit to a minimum service period (typically 3-5 years)</li>
                  <li>Use the property as your primary residence</li>
                </ul>
                <div className="bg-[#0A3C1F]/10 p-4 rounded-lg mt-6">
                  <h3 className="font-semibold text-[#FFD700] mb-2">Priority Status</h3>
                  <p>Priority is given to deputies who:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Currently live outside San Francisco</li>
                    <li>Have longer commute times</li>
                    <li>Have families or dependents</li>
                    <li>Are first-time home buyers (for purchase assistance programs)</li>
                  </ul>
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
                <CardDescription>Common questions about housing programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-[#FFD700]">How much can I save with these programs?</h3>
                  <p>
                    Savings vary by program, but deputies typically save 10-20% on rent through the First Responder
                    Housing Program and can receive up to $100,000 in down payment assistance for home purchases.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFD700]">Do I have to live in San Francisco to qualify?</h3>
                  <p>
                    No, but some programs are designed to encourage deputies to live within the city. Commuter
                    assistance is available for those who live outside San Francisco.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFD700]">What happens if I leave the department?</h3>
                  <p>
                    If you leave before fulfilling your service commitment, you may need to repay a portion of the
                    benefits received. Each program has specific terms regarding early departure.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFD700]">Can family members be included in my application?</h3>
                  <p>
                    Yes, your housing needs assessment will take into account your entire household, including spouse,
                    children, and other dependents.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFD700]">How do I start the application process?</h3>
                  <p>
                    Contact our Housing Coordinator at housing@sfdeputysheriff.com or call (415) 554-7230 to schedule an
                    initial consultation and needs assessment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-[#0A3C1F] p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-3">Ready to Find Your New Home?</h2>
          <p className="text-white mb-6">
            Let us help you find affordable housing options as you begin your career with the San Francisco Sheriff's
            Office.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-medium">
              View Available Properties
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
