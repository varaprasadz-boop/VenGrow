import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export default function CommissionCalculatorPage() {
  const [salePrice, setSalePrice] = useState(8500000);
  const [commissionRate, setCommissionRate] = useState(2);

  const commission = (salePrice * commissionRate) / 100;
  const netAmount = salePrice - commission;

  return (


      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Calculator className="h-8 w-8 text-primary" />
              Commission Calculator
            </h1>
            <p className="text-muted-foreground">
              Calculate your commission and net earnings
            </p>
    

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h3 className="font-semibold text-lg mb-6">Transaction Details</h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="sale-price">
                      Sale Price: ₹{(salePrice / 100000).toFixed(1)} L
                    </Label>
                    <input
                      id="sale-price"
                      type="range"
                      min="1000000"
                      max="100000000"
                      step="100000"
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      className="w-full"
                      data-testid="slider-price"
                    />
            

                  <div>
                    <Label htmlFor="commission-rate">
                      Commission Rate: {commissionRate}%
                    </Label>
                    <input
                      id="commission-rate"
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.5"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="w-full"
                      data-testid="slider-rate"
                    />
            
          
              </Card>

              {/* Breakdown */}
              <Card className="p-8 mt-6">
                <h3 className="font-semibold text-lg mb-6">Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Sale Price</span>
                    <span className="font-semibold">
                      ₹{(salePrice / 100000).toFixed(2)} L
                    </span>
            

                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900/20">
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-400">
                        Your Commission
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {commissionRate}% of sale price
                      </p>
              
                    <span className="font-semibold text-red-600">
                      - ₹{(commission / 100000).toFixed(2)} L
                    </span>
            

                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div>
                      <p className="font-semibold text-lg">Net Amount</p>
                      <p className="text-xs text-muted-foreground">
                        Amount you'll receive
                      </p>
              
                    <span className="font-semibold text-2xl text-primary">
                      ₹{(netAmount / 100000).toFixed(2)} L
                    </span>
            
          
              </Card>
      

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="p-8 sticky top-8 bg-gradient-to-br from-primary/5 to-primary/10">
                <h3 className="font-semibold mb-6">Your Earnings</h3>
                <p className="text-5xl font-bold font-serif text-primary mb-6">
                  ₹{(commission / 100000).toFixed(1)}L
                </p>
                <p className="text-sm text-muted-foreground">
                  Commission on this transaction
                </p>
              </Card>
      
    
  
      </main>
  );
}
