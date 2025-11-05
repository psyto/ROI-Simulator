export type AssetClass = 
  | 'Digital Bonds'
  | 'Tokenized Fund Interests'
  | 'Trade Finance Assets'
  | 'Real Estate'
  | 'Other RWA';

export type Currency = 'JPY' | 'USD';

export interface SimulationInput {
  aum: number;
  currency: Currency;
  assetClasses: AssetClass[];
  currentYield: number; // percentage
  settlementCycle: number; // T+N where N is this number
  annualTransactionFrequency: number;
  conservativeReinvestmentRate?: number; // percentage, optional
  differentiatedAlpha?: number; // percentage, optional for sensitivity analysis (manual override)
  legacySettlementCosts?: number; // optional, for cost reduction calculation
  // DeFi parameters for alpha calculation
  collateralizationRatio?: number; // 0.0-1.0, e.g., 0.6 for 60%, optional
  borrowingRate?: number; // percentage annual, optional
  defiReinvestmentRate?: number; // percentage annual, optional
  useDefiCalculation?: boolean; // if true, calculate alpha from DeFi params; if false, use manual/asset class default
}

export interface CapitalEfficiencyAlpha {
  rwaReduction: number;
  annualLiquidityRelease: number;
  averageReleasedCapital: number;
  annualOperatingCostReduction: number;
  reinvestmentROI: number;
}

export interface DifferentiatedYieldAlpha {
  baseYield: number;
  differentiatedAlpha: number;
  projectedTotalReturn: number;
  estimatedAnnualAdditionalRevenue: number;
}

export interface SimulationResults {
  capitalEfficiency: CapitalEfficiencyAlpha;
  differentiatedYield: DifferentiatedYieldAlpha;
  totalAnnualBenefit: number;
}
