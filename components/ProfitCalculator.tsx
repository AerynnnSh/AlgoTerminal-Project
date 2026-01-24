"use client";

import { useState, useEffect } from "react";
import { Calculator, DollarSign, ArrowRight } from "lucide-react";

interface ProfitCalculatorProps {
  currentPrice: number;
  symbol: string;
}

export default function ProfitCalculator({
  currentPrice,
  symbol,
}: ProfitCalculatorProps) {
  // State Input
  const [investment, setInvestment] = useState<string>("100"); // Default invest $100
  const [buyPrice, setBuyPrice] = useState<string>(currentPrice.toString());
  const [sellPrice, setSellPrice] = useState<string>(
    (currentPrice * 1.1).toString(),
  ); // Default target +10%

  // State Output
  const [profit, setProfit] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);

  // Logic Hitung
  useEffect(() => {
    const investVal = parseFloat(investment) || 0;
    const buyVal = parseFloat(buyPrice) || 0;
    const sellVal = parseFloat(sellPrice) || 0;

    if (buyVal === 0) return;

    const amountOfCoins = investVal / buyVal;
    const futureValue = amountOfCoins * sellVal;
    const profitValue = futureValue - investVal;
    const percentValue = ((sellVal - buyVal) / buyVal) * 100;

    setProfit(profitValue);
    setPercentage(percentValue);
  }, [investment, buyPrice, sellPrice]);

  return (
    <div className="p-6 rounded-xl border border-border bg-card shadow-sm h-full">
      <div className="flex items-center gap-2 mb-6 text-primary">
        <Calculator size={20} />
        <h3 className="font-mono font-bold tracking-wider uppercase">
          /// SCENARIO_SIMULATOR
        </h3>
      </div>

      <div className="space-y-4 font-mono text-sm">
        {/* Input: Investment */}
        <div>
          <label className="block text-muted-foreground text-xs uppercase mb-1">
            Investment (USD)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              className="w-full bg-background border border-border rounded p-2 pl-9 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Grid: Buy & Sell Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-muted-foreground text-xs uppercase mb-1">
              Buy Price ($)
            </label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="w-full bg-background border border-border rounded p-2 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-muted-foreground text-xs uppercase mb-1">
              Sell Price ($)
            </label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className="w-full bg-background border border-border rounded p-2 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Result Box */}
      <div className="mt-6 p-4 rounded bg-muted/30 border border-border border-dashed">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground uppercase font-mono">
            Est. Profit/Loss
          </span>
          <span
            className={`text-xs font-bold px-2 py-1 rounded ${
              percentage >= 0
                ? "text-emerald-500 bg-emerald-500/10"
                : "text-rose-500 bg-rose-500/10"
            }`}
          >
            {percentage.toFixed(2)}%
          </span>
        </div>

        <div
          className={`text-2xl font-bold font-mono tracking-tight ${profit >= 0 ? "text-emerald-500" : "text-rose-500"}`}
        >
          {profit >= 0 ? "+" : ""}$
          {profit.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
          <span>Target:</span>
          <span className="text-foreground font-bold">
            ${parseFloat(sellPrice || "0").toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
