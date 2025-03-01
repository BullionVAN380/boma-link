'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Comparison {
  monthlyRent: number;
  monthlyMortgage: number;
  fiveYearRentCost: number;
  fiveYearBuyCost: number;
  breakEvenMonths: number;
}

export default function RentVsBuyCalculator() {
  const [monthlyRent, setMonthlyRent] = useState('');
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [propertyTax, setPropertyTax] = useState('');
  const [insurance, setInsurance] = useState('');
  const [comparison, setComparison] = useState<Comparison | null>(null);

  const calculateComparison = () => {
    // Calculate monthly mortgage payment
    const principal = Number(homePrice) - Number(downPayment);
    const monthlyRate = Number(interestRate) / 100 / 12;
    const numberOfPayments = 30 * 12;

    const monthlyMortgage = principal * (
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    );

    // Add property tax and insurance to monthly cost
    const monthlyTax = (Number(propertyTax) / 100 * Number(homePrice)) / 12;
    const monthlyInsurance = Number(insurance) / 12;
    const totalMonthlyBuyCost = monthlyMortgage + monthlyTax + monthlyInsurance;

    // Calculate 5-year costs
    const monthlyRentIncrease = 0.03; // Assume 3% annual rent increase
    let fiveYearRentCost = 0;
    let currentRent = Number(monthlyRent);

    for (let year = 0; year < 5; year++) {
      fiveYearRentCost += currentRent * 12;
      currentRent *= (1 + monthlyRentIncrease);
    }

    const fiveYearBuyCost = (totalMonthlyBuyCost * 12 * 5) - (Number(homePrice) * 0.1); // Assume 10% appreciation

    // Calculate break-even point (in months)
    const monthlyDifference = Number(monthlyRent) - totalMonthlyBuyCost;
    const breakEvenMonths = Math.ceil(Number(downPayment) / monthlyDifference);

    setComparison({
      monthlyRent: Number(monthlyRent),
      monthlyMortgage: totalMonthlyBuyCost,
      fiveYearRentCost,
      fiveYearBuyCost,
      breakEvenMonths
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
          <Input
            id="monthlyRent"
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
            placeholder="2000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="homePrice">Home Price ($)</Label>
          <Input
            id="homePrice"
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)}
            placeholder="300000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="downPayment">Down Payment ($)</Label>
          <Input
            id="downPayment"
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder="60000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="3.5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="propertyTax">Annual Property Tax Rate (%)</Label>
          <Input
            id="propertyTax"
            type="number"
            step="0.1"
            value={propertyTax}
            onChange={(e) => setPropertyTax(e.target.value)}
            placeholder="1.2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insurance">Annual Insurance ($)</Label>
          <Input
            id="insurance"
            type="number"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            placeholder="1200"
          />
        </div>
      </div>

      <Button onClick={calculateComparison} className="w-full">
        Compare
      </Button>

      {comparison && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Monthly Costs</h3>
              <div className="space-y-2">
                <p>Rent: <span className="font-bold">${comparison.monthlyRent.toFixed(2)}</span></p>
                <p>Buy: <span className="font-bold">${comparison.monthlyMortgage.toFixed(2)}</span></p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">5-Year Total Costs</h3>
              <div className="space-y-2">
                <p>Rent: <span className="font-bold">${comparison.fiveYearRentCost.toFixed(2)}</span></p>
                <p>Buy: <span className="font-bold">${comparison.fiveYearBuyCost.toFixed(2)}</span></p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Break-Even Analysis</h3>
            <p>
              {comparison.breakEvenMonths > 0 
                ? `You will break even on your purchase in approximately ${comparison.breakEvenMonths} months.`
                : 'Based on these numbers, renting may be more cost-effective.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
