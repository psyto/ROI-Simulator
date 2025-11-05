import { SimulationInput, CapitalEfficiencyAlpha, DifferentiatedYieldAlpha, SimulationResults, AssetClass } from '../types';

// Network fee per transaction (in USD, very low)
const NETWORK_FEE_PER_TRANSACTION = 0.0005;

// Estimated RWA reduction factor (percentage reduction per day of settlement cycle improvement)
// This is a simplified model - should be reviewed by financial engineering experts
const RWA_REDUCTION_FACTOR_PER_DAY = 0.15; // 0.15% per day

// Default conservative reinvestment rate if not provided
const DEFAULT_REINVESTMENT_RATE = 2.0; // 2% annual

// Default differentiated alpha if not provided (based on DeFi composability)
const DEFAULT_DIFFERENTIATED_ALPHA = 7.0; // 7% additional yield (between 8-9% base and 16% max)

// Default legacy settlement cost per transaction (estimated)
const DEFAULT_LEGACY_SETTLEMENT_COST = 10.0; // $10 per transaction

// Asset class-specific parameters
// These values should be reviewed by financial engineering experts
export interface AssetClassParameters {
  defaultDifferentiatedAlpha: number; // Default additional yield percentage for this asset class
  rwaReductionMultiplier: number; // Multiplier for RWA reduction calculation (1.0 = standard)
  transactionFrequencyMultiplier: number; // Multiplier for transaction frequency impact (1.0 = standard)
  // Default DeFi parameters for this asset class
  defaultCollateralizationRatio: number; // Default collateralization ratio (0.0-1.0)
  defaultBorrowingRate: number; // Default borrowing rate (annual %)
  defaultDefiReinvestmentRate: number; // Default DeFi reinvestment rate (annual %)
}

const ASSET_CLASS_PARAMETERS: Record<AssetClass, AssetClassParameters> = {
  'Digital Bonds': {
    defaultDifferentiatedAlpha: 6.5, // Lower volatility, more predictable
    rwaReductionMultiplier: 1.0, // Standard
    transactionFrequencyMultiplier: 1.2, // Higher frequency benefits
    defaultCollateralizationRatio: 0.60, // 60% - conservative
    defaultBorrowingRate: 5.0, // 5% annual borrowing rate
    defaultDefiReinvestmentRate: 8.0, // 8% reinvestment rate
  },
  'Tokenized Fund Interests': {
    defaultDifferentiatedAlpha: 8.0, // Higher composability potential
    rwaReductionMultiplier: 0.9, // Slightly lower RWA impact
    transactionFrequencyMultiplier: 1.0, // Standard
    defaultCollateralizationRatio: 0.60, // 60% - standard
    defaultBorrowingRate: 6.0, // 6% annual borrowing rate
    defaultDefiReinvestmentRate: 10.0, // 10% reinvestment rate - higher composability
  },
  'Trade Finance Assets': {
    defaultDifferentiatedAlpha: 7.5, // Good DeFi integration potential
    rwaReductionMultiplier: 1.1, // Higher RWA reduction potential
    transactionFrequencyMultiplier: 1.3, // High frequency benefits
    defaultCollateralizationRatio: 0.60, // 60% - standard
    defaultBorrowingRate: 5.5, // 5.5% annual borrowing rate
    defaultDefiReinvestmentRate: 9.5, // 9.5% reinvestment rate
  },
  'Real Estate': {
    defaultDifferentiatedAlpha: 5.0, // Lower liquidity, more conservative
    rwaReductionMultiplier: 0.8, // Lower RWA impact
    transactionFrequencyMultiplier: 0.7, // Lower frequency
    defaultCollateralizationRatio: 0.70, // 70% - more conservative, lower leverage
    defaultBorrowingRate: 4.5, // 4.5% annual borrowing rate - conservative
    defaultDefiReinvestmentRate: 6.5, // 6.5% reinvestment rate - conservative
  },
  'Other RWA': {
    defaultDifferentiatedAlpha: 7.0, // Standard default
    rwaReductionMultiplier: 1.0, // Standard
    transactionFrequencyMultiplier: 1.0, // Standard
    defaultCollateralizationRatio: 0.60, // 60% - standard
    defaultBorrowingRate: 5.5, // 5.5% annual borrowing rate
    defaultDefiReinvestmentRate: 8.5, // 8.5% reinvestment rate
  },
};

/**
 * Calculate weighted average parameters for multiple asset classes
 * Assumes equal weighting across selected asset classes
 * Export for use in UI components to get default DeFi parameters
 */
export function calculateAssetClassWeightedAverage(
  assetClasses: AssetClass[]
): AssetClassParameters {
  if (assetClasses.length === 0) {
    // Fallback to default if no asset classes selected
    return ASSET_CLASS_PARAMETERS['Other RWA'];
  }

  const totalAlpha = assetClasses.reduce(
    (sum, ac) => sum + ASSET_CLASS_PARAMETERS[ac].defaultDifferentiatedAlpha,
    0
  );
  const totalRwaMultiplier = assetClasses.reduce(
    (sum, ac) => sum + ASSET_CLASS_PARAMETERS[ac].rwaReductionMultiplier,
    0
  );
  const totalTxMultiplier = assetClasses.reduce(
    (sum, ac) => sum + ASSET_CLASS_PARAMETERS[ac].transactionFrequencyMultiplier,
    0
  );
  const totalCollRatio = assetClasses.reduce(
    (sum, ac) => sum + ASSET_CLASS_PARAMETERS[ac].defaultCollateralizationRatio,
    0
  );
  const totalBorrowRate = assetClasses.reduce(
    (sum, ac) => sum + ASSET_CLASS_PARAMETERS[ac].defaultBorrowingRate,
    0
  );
  const totalDefiReinvest = assetClasses.reduce(
    (sum, ac) => sum + ASSET_CLASS_PARAMETERS[ac].defaultDefiReinvestmentRate,
    0
  );

  const count = assetClasses.length;

  return {
    defaultDifferentiatedAlpha: totalAlpha / count,
    rwaReductionMultiplier: totalRwaMultiplier / count,
    transactionFrequencyMultiplier: totalTxMultiplier / count,
    defaultCollateralizationRatio: totalCollRatio / count,
    defaultBorrowingRate: totalBorrowRate / count,
    defaultDefiReinvestmentRate: totalDefiReinvest / count,
  };
}

/**
 * Get default differentiated alpha for a single asset class
 * Export for use in UI components
 */
export function getDefaultAlphaForAssetClass(assetClass: AssetClass): number {
  return ASSET_CLASS_PARAMETERS[assetClass].defaultDifferentiatedAlpha;
}

/**
 * Calculate average default alpha for multiple asset classes
 * Export for use in UI components
 */
export function getAverageDefaultAlpha(assetClasses: AssetClass[]): number {
  if (assetClasses.length === 0) {
    return ASSET_CLASS_PARAMETERS['Other RWA'].defaultDifferentiatedAlpha;
  }
  const totalAlpha = assetClasses.reduce(
    (sum, ac) => sum + ASSET_CLASS_PARAMETERS[ac].defaultDifferentiatedAlpha,
    0
  );
  return totalAlpha / assetClasses.length;
}

/**
 * Calculate differentiated alpha from DeFi parameters
 * Based on README specification: 60% Collateralization Ratio, borrowing rate, and reinvestment rate
 * 
 * Formula explanation:
 * - Leverage effect: 1 / collateralizationRatio (e.g., 1/0.6 = 1.67x leverage)
 * - Additional yield from leveraged position: (borrowingRate * leverage) - borrowingRate
 * - Reinvestment boost: reinvestmentRate contributes to additional returns
 * - Net alpha = leveraged yield spread + reinvestment contribution
 * 
 * @param collateralizationRatio Collateralization ratio (0.0-1.0), e.g., 0.6 for 60%
 * @param borrowingRate Annual borrowing rate (%)
 * @param reinvestmentRate Annual reinvestment rate (%)
 * @param baseYield Current base yield (%) - used for context but not directly in calculation
 * @returns Calculated differentiated alpha (%)
 */
export function calculateAlphaFromDeFiParams(
  collateralizationRatio: number,
  borrowingRate: number,
  reinvestmentRate: number,
  baseYield: number = 8.5
): number {
  // Validate inputs
  if (collateralizationRatio <= 0 || collateralizationRatio > 1) {
    throw new Error('Collateralization ratio must be between 0 and 1');
  }
  if (borrowingRate < 0 || reinvestmentRate < 0) {
    throw new Error('Rates must be non-negative');
  }

  // Leverage factor: 1 / collateralizationRatio
  // Example: 60% collateralization = 1/0.6 = 1.67x leverage
  const leverageFactor = 1 / collateralizationRatio;

  // Calculate leveraged position yield
  // With leverage, you can borrow against collateral and reinvest
  // The spread between reinvestment rate and borrowing rate, multiplied by leverage
  const yieldSpread = reinvestmentRate - borrowingRate;
  const leveragedSpread = yieldSpread * (leverageFactor - 1); // Leverage - 1 (since 1x is the base)

  // Additional alpha from leveraged strategy
  // This represents the additional return from using borrowed funds
  const leveragedAlpha = leveragedSpread * 0.8; // Apply 80% efficiency factor (risk/liquidity costs)

  // Reinvestment contribution
  // Even without leverage, reinvesting at higher rates adds value
  // This is weighted by the collateralization ratio (how much of the position is available)
  const reinvestmentContribution = reinvestmentRate * (1 - collateralizationRatio) * 0.6;

  // Total alpha = leveraged alpha + reinvestment contribution
  const totalAlpha = leveragedAlpha + reinvestmentContribution;

  // Cap at reasonable maximum (e.g., 15% additional yield)
  return Math.min(totalAlpha, 15.0);
}

export function calculateCapitalEfficiencyAlpha(input: SimulationInput): CapitalEfficiencyAlpha {
  const { aum, settlementCycle, annualTransactionFrequency, currency, conservativeReinvestmentRate, legacySettlementCosts, assetClasses } = input;
  
  // Get asset class-specific parameters (weighted average if multiple classes)
  const assetParams = calculateAssetClassWeightedAverage(assetClasses);
  
  // Convert AUM to USD for calculations if needed
  const aumUSD = currency === 'USD' ? aum : aum * 0.0067; // Approximate JPY to USD conversion
  
  // Apply transaction frequency multiplier from asset class parameters
  const adjustedTransactionFrequency = annualTransactionFrequency * assetParams.transactionFrequencyMultiplier;
  
  // Calculate total annual transaction value
  const totalAnnualTransactionValue = aumUSD * adjustedTransactionFrequency;
  
  // Calculate average released capital from T+N to T+0 settlement
  // Formula: (Current Settlement Cycle N x Total Annual Transaction Value) / 365.25 Days
  const averageReleasedCapital = (settlementCycle * totalAnnualTransactionValue) / 365.25;
  
  // Calculate annual liquidity constraint release value
  const annualLiquidityRelease = averageReleasedCapital * 365.25;
  
  // Calculate RWA reduction (simplified model)
  // RWA reduction is proportional to settlement cycle days, adjusted by asset class multiplier
  const rwaReduction = aumUSD * (settlementCycle * RWA_REDUCTION_FACTOR_PER_DAY / 100) * assetParams.rwaReductionMultiplier;
  
  // Calculate annual operating cost reduction
  // Use adjusted transaction frequency for cost calculations
  const legacyCosts = legacySettlementCosts || DEFAULT_LEGACY_SETTLEMENT_COST;
  const totalLegacyCosts = legacyCosts * adjustedTransactionFrequency;
  const totalNetworkFees = NETWORK_FEE_PER_TRANSACTION * adjustedTransactionFrequency;
  const annualOperatingCostReduction = totalLegacyCosts - totalNetworkFees;
  
  // Calculate reinvestment ROI on released capital
  const reinvestmentRate = conservativeReinvestmentRate || DEFAULT_REINVESTMENT_RATE;
  const reinvestmentROI = averageReleasedCapital * (reinvestmentRate / 100);
  
  // Convert back to original currency if needed
  const conversionRate = currency === 'USD' ? 1 : 149.3; // Approximate USD to JPY
  
  return {
    rwaReduction: rwaReduction * conversionRate,
    annualLiquidityRelease: annualLiquidityRelease * conversionRate,
    averageReleasedCapital: averageReleasedCapital * conversionRate,
    annualOperatingCostReduction: annualOperatingCostReduction * conversionRate,
    reinvestmentROI: reinvestmentROI * conversionRate,
  };
}

export function calculateDifferentiatedYieldAlpha(input: SimulationInput): DifferentiatedYieldAlpha {
  const { 
    aum, 
    currency, 
    currentYield, 
    differentiatedAlpha, 
    assetClasses,
    collateralizationRatio,
    borrowingRate,
    defiReinvestmentRate,
    useDefiCalculation
  } = input;
  
  // Get asset class-specific parameters (weighted average if multiple classes)
  const assetParams = calculateAssetClassWeightedAverage(assetClasses);
  
  // Convert AUM to USD for calculations if needed
  const aumUSD = currency === 'USD' ? aum : aum * 0.0067;
  
  const baseYield = currentYield;
  
  // Determine alpha calculation method (priority order):
  // 1. Manual override (user-specified differentiatedAlpha)
  // 2. DeFi calculation (if useDefiCalculation is true and params are provided)
  // 3. Asset class default
  let alpha: number;
  
  if (differentiatedAlpha !== undefined) {
    // Manual override - user explicitly provided alpha
    alpha = differentiatedAlpha;
  } else if (useDefiCalculation && collateralizationRatio !== undefined && borrowingRate !== undefined && defiReinvestmentRate !== undefined) {
    // Calculate from DeFi parameters
    try {
      alpha = calculateAlphaFromDeFiParams(
        collateralizationRatio,
        borrowingRate,
        defiReinvestmentRate,
        baseYield
      );
    } catch (error) {
      // Fallback to asset class default if calculation fails
      console.warn('DeFi calculation failed, using asset class default:', error);
      alpha = assetParams.defaultDifferentiatedAlpha;
    }
  } else {
    // Use asset class default
    alpha = assetParams.defaultDifferentiatedAlpha;
  }
  
  const projectedTotalReturn = baseYield + alpha;
  
  // Calculate estimated annual additional revenue
  const estimatedAnnualAdditionalRevenue = aumUSD * (alpha / 100);
  
  // Convert back to original currency if needed
  const conversionRate = currency === 'USD' ? 1 : 149.3;
  
  return {
    baseYield,
    differentiatedAlpha: alpha,
    projectedTotalReturn,
    estimatedAnnualAdditionalRevenue: estimatedAnnualAdditionalRevenue * conversionRate,
  };
}

export function calculateSimulationResults(input: SimulationInput): SimulationResults {
  const capitalEfficiency = calculateCapitalEfficiencyAlpha(input);
  const differentiatedYield = calculateDifferentiatedYieldAlpha(input);
  
  const totalAnnualBenefit = 
    capitalEfficiency.reinvestmentROI + 
    capitalEfficiency.annualOperatingCostReduction + 
    differentiatedYield.estimatedAnnualAdditionalRevenue;
  
  return {
    capitalEfficiency,
    differentiatedYield,
    totalAnnualBenefit,
  };
}

export function formatCurrency(value: number, currency: 'JPY' | 'USD'): string {
  const symbol = currency === 'USD' ? '$' : '¥';
  const decimals = currency === 'USD' ? 2 : 0;
  
  if (value >= 1_000_000_000) {
    return `${symbol}${(value / 1_000_000_000).toFixed(decimals)}B`;
  } else if (value >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(decimals)}M`;
  } else if (value >= 1_000) {
    return `${symbol}${(value / 1_000).toFixed(decimals)}K`;
  }
  return `${symbol}${value.toFixed(decimals)}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
