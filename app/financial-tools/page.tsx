'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MortgageCalculator from '@/components/financial/MortgageCalculator';
import AffordabilityCalculator from '@/components/financial/AffordabilityCalculator';
import RentVsBuyCalculator from '@/components/financial/RentVsBuyCalculator';

export default function FinancialToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Financial Tools</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Make informed financial decisions with our comprehensive calculators and tools
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="mortgage" className="w-full space-y-8">
            <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent p-1">
              <TabsTrigger 
                value="mortgage"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-lg shadow-sm"
              >
                Mortgage Calculator
              </TabsTrigger>
              <TabsTrigger 
                value="affordability"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-lg shadow-sm"
              >
                Affordability Calculator
              </TabsTrigger>
              <TabsTrigger 
                value="rentvsbuy"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-3 rounded-lg shadow-sm"
              >
                Rent vs Buy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mortgage">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Mortgage Calculator</CardTitle>
                  <CardDescription className="text-indigo-700">
                    Calculate your estimated monthly mortgage payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <MortgageCalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="affordability">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Affordability Calculator</CardTitle>
                  <CardDescription className="text-indigo-700">
                    Find out how much house you can afford based on your income and expenses
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <AffordabilityCalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rentvsbuy">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-indigo-900">Rent vs Buy Calculator</CardTitle>
                  <CardDescription className="text-indigo-700">
                    Compare the costs of renting versus buying a home
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <RentVsBuyCalculator />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
