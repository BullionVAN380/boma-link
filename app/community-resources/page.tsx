'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CommunityResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Resources</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find helpful resources and services in your community
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="housing" className="w-full space-y-8">
            <TabsList className="grid w-full grid-cols-4 gap-4 bg-transparent p-1">
              {['housing', 'education', 'healthcare', 'transportation'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-lg shadow-sm capitalize"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="housing">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Housing Assistance Programs</CardTitle>
                  <CardDescription className="text-indigo-700">Available housing support and programs</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <ResourceCard
                      title="Section 8 Housing Choice Voucher"
                      description="Assistance for very low-income families to afford decent, safe housing."
                      link="#"
                      icon="🏠"
                    />
                    <ResourceCard
                      title="First-Time Homebuyer Programs"
                      description="Special loans and grants for first-time homebuyers."
                      link="#"
                      icon="🔑"
                    />
                    <ResourceCard
                      title="Emergency Rental Assistance"
                      description="Help for those struggling to pay rent or utilities."
                      link="#"
                      icon="⚡"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Educational Resources</CardTitle>
                  <CardDescription className="text-indigo-700">Schools and educational programs in your area</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <ResourceCard
                      title="School District Information"
                      description="Find local schools and their ratings."
                      link="#"
                      icon="🎓"
                    />
                    <ResourceCard
                      title="Adult Education Programs"
                      description="Continuing education and skill development courses."
                      link="#"
                      icon="📚"
                    />
                    <ResourceCard
                      title="Library Services"
                      description="Access to public libraries and educational resources."
                      link="#"
                      icon="📖"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="healthcare">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Healthcare Facilities</CardTitle>
                  <CardDescription className="text-indigo-700">Medical services and healthcare resources</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <ResourceCard
                      title="Community Health Centers"
                      description="Affordable healthcare services for the community."
                      link="#"
                      icon="🏥"
                    />
                    <ResourceCard
                      title="Mental Health Services"
                      description="Mental health support and counseling resources."
                      link="#"
                      icon="🧠"
                    />
                    <ResourceCard
                      title="Emergency Services"
                      description="Nearby hospitals and emergency care facilities."
                      link="#"
                      icon="🚑"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transportation">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Transportation Services</CardTitle>
                  <CardDescription className="text-indigo-700">Public transit and transportation options</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <ResourceCard
                      title="Public Transit Routes"
                      description="Bus and train schedules and routes."
                      link="#"
                      icon="🚌"
                    />
                    <ResourceCard
                      title="Transportation Assistance"
                      description="Programs to help with transportation costs."
                      link="#"
                      icon="💰"
                    />
                    <ResourceCard
                      title="Ride Services"
                      description="Special transportation services for seniors and disabled residents."
                      link="#"
                      icon="🚗"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ title, description, link, icon }: { title: string; description: string; link: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <a
        href={link}
        className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center group"
      >
        Learn More
        <svg
          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}
