'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const calculateMortgage = () => {
    const principal = Number(homePrice) - Number(downPayment);
    const monthlyRate = Number(interestRate) / 100 / 12;
    const numberOfPayments = Number(loanTerm) * 12;

    const payment = principal * (
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    );

    setMonthlyPayment(Number.isFinite(payment) ? payment : 0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="loanTerm">Loan Term (Years)</Label>
          <select
            id="loanTerm"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="30">30 Years</option>
            <option value="20">20 Years</option>
            <option value="15">15 Years</option>
            <option value="10">10 Years</option>
          </select>
        </div>
      </div>

      <Button onClick={calculateMortgage} className="w-full">
        Calculate
      </Button>

      {monthlyPayment !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Monthly Payment</h3>
          <p className="text-2xl font-bold text-green-600">
            ${monthlyPayment.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This is an estimate and does not include taxes, insurance, or HOA fees.
          </p>
        </div>
      )}
    </div>
  );
}
