'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState('');
  const [monthlyDebts, setMonthlyDebts] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [affordablePrice, setAffordablePrice] = useState<number | null>(null);

  const calculateAffordability = () => {
    // Using the 28/36 rule for affordability
    const monthlyIncome = Number(annualIncome) / 12;
    const maxMonthlyPayment = monthlyIncome * 0.28; // 28% of monthly income
    const totalMonthlyObligations = Number(monthlyDebts) + maxMonthlyPayment;
    
    if (totalMonthlyObligations / monthlyIncome > 0.36) {
      // Adjust maxMonthlyPayment to meet 36% rule
      const maxMonthlyPayment = (monthlyIncome * 0.36) - Number(monthlyDebts);
    }

    // Calculate affordable home price based on monthly payment
    const monthlyRate = Number(interestRate) / 100 / 12;
    const numberOfPayments = 30 * 12; // Assuming 30-year mortgage

    const affordableAmount = maxMonthlyPayment * (
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))
    );

    const totalAffordablePrice = affordableAmount + Number(downPayment);
    setAffordablePrice(Number.isFinite(totalAffordablePrice) ? totalAffordablePrice : 0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="annualIncome">Annual Income ($)</Label>
          <Input
            id="annualIncome"
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
            placeholder="75000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlyDebts">Monthly Debts ($)</Label>
          <Input
            id="monthlyDebts"
            type="number"
            value={monthlyDebts}
            onChange={(e) => setMonthlyDebts(e.target.value)}
            placeholder="500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="downPayment">Down Payment ($)</Label>
          <Input
            id="downPayment"
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder="20000"
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
      </div>

      <Button onClick={calculateAffordability} className="w-full">
        Calculate
      </Button>

      {affordablePrice !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Maximum Affordable Home Price</h3>
          <p className="text-2xl font-bold text-green-600">
            ${affordablePrice.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This estimate is based on the 28/36 rule and does not include taxes, insurance, or other housing expenses.
          </p>
        </div>
      )}
    </div>
  );
}
