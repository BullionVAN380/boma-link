'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EducationCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Education Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn about housing processes, rights, and responsibilities
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="guides" className="w-full space-y-8">
            <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent p-1">
              {['guides', 'rights', 'financial'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-lg shadow-sm capitalize"
                >
                  {tab === 'guides' ? 'Housing Guides' : tab === 'rights' ? 'Tenant Rights' : 'Financial Education'}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="guides">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Housing Guides</CardTitle>
                  <CardDescription className="text-indigo-700">Step-by-step guides for housing processes</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-8 md:grid-cols-2">
                    <GuideCard
                      title="First-Time Homebuying"
                      description="Everything you need to know about buying your first home"
                      topics={[
                        "Understanding the homebuying process",
                        "Required documentation",
                        "Home inspection tips",
                        "Closing process explained"
                      ]}
                    />
                    <GuideCard
                      title="Rental Process"
                      description="Complete guide to renting a property"
                      topics={[
                        "Finding the right rental",
                        "Rental application process",
                        "Understanding lease terms",
                        "Move-in checklist"
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rights">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Tenant Rights</CardTitle>
                  <CardDescription className="text-indigo-700">Know your rights as a tenant</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-8 md:grid-cols-3">
                    <RightsCard
                      title="Fair Housing Rights"
                      description="Learn about protection against discrimination in housing"
                      points={[
                        "Protected classes under fair housing laws",
                        "How to recognize discrimination",
                        "Filing a complaint"
                      ]}
                    />
                    <RightsCard
                      title="Maintenance and Repairs"
                      description="Understanding landlord responsibilities and your rights to repairs"
                      points={[
                        "Required maintenance standards",
                        "Repair request process",
                        "Emergency repairs"
                      ]}
                    />
                    <RightsCard
                      title="Eviction Process"
                      description="Know your rights during eviction proceedings"
                      points={[
                        "Legal eviction requirements",
                        "Your rights during eviction",
                        "Getting legal help"
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Financial Education</CardTitle>
                  <CardDescription className="text-indigo-700">Build your financial knowledge</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-8 md:grid-cols-3">
                    <EducationCard
                      title="Budgeting Basics"
                      description="Learn how to create and maintain a household budget"
                      icon="💰"
                    />
                    <EducationCard
                      title="Credit Management"
                      description="Understanding and improving your credit score"
                      icon="📈"
                    />
                    <EducationCard
                      title="Saving for Housing"
                      description="Strategies for saving for a down payment or security deposit"
                      icon="🏦"
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

function GuideCard({ title, description, topics }: { title: string; description: string; topics: string[] }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {topics.map((topic, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {topic}
          </li>
        ))}
      </ul>
      <button className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center group">
        Read Guide
        <svg
          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

function RightsCard({ title, description, points }: { title: string; description: string; points: string[] }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2 text-sm">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <span className="text-indigo-500 mr-2">•</span>
            <span className="text-gray-700">{point}</span>
          </li>
        ))}
      </ul>
      <button className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center group">
        Learn More
        <svg
          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

function EducationCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center group">
        Start Learning
        <svg
          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
