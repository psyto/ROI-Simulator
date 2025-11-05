import React from 'react';
import { SimulationResults, SimulationInput } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculations';
import { useLanguage } from '../i18n/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardProps {
  input: SimulationInput;
  results: SimulationResults;
}

export default function Dashboard({ input, results }: DashboardProps) {
  const { t, language } = useLanguage();
  
  // Prepare data for charts
  const capitalEfficiencyData = [
    {
      name: t.dashboard.rwaReduction,
      value: results.capitalEfficiency.rwaReduction,
    },
    {
      name: t.dashboard.averageReleasedCapital,
      value: results.capitalEfficiency.averageReleasedCapital,
    },
    {
      name: t.dashboard.operatingCostReduction,
      value: results.capitalEfficiency.annualOperatingCostReduction,
    },
    {
      name: t.dashboard.reinvestmentROI,
      value: results.capitalEfficiency.reinvestmentROI,
    },
  ];

  const yieldComparisonData = [
    {
      name: language === 'ja' ? '現在' : 'Current',
      yield: results.differentiatedYield.baseYield,
    },
    {
      name: language === 'ja' ? 'ネットワーク利用時' : 'With Network',
      yield: results.differentiatedYield.projectedTotalReturn,
    },
  ];

  const totalBenefitBreakdown = [
    {
      name: language === 'ja' ? '資本効率' : 'Capital Efficiency',
      value: results.capitalEfficiency.reinvestmentROI + results.capitalEfficiency.annualOperatingCostReduction,
    },
    {
      name: language === 'ja' ? '利回りアルファ' : 'Yield Alpha',
      value: results.differentiatedYield.estimatedAnnualAdditionalRevenue,
    },
  ];

  // Sensitivity analysis data
  const sensitivityData = [];
  const baseAlpha = input.differentiatedAlpha || 7.0;
  for (let i = -5; i <= 5; i++) {
    const alpha = baseAlpha + i;
    const revenue = (input.aum * (input.currency === 'USD' ? 1 : 0.0067)) * (alpha / 100) * (input.currency === 'USD' ? 1 : 149.3);
    sensitivityData.push({
      alpha: `${alpha > 0 ? '+' : ''}${alpha.toFixed(1)}%`,
      revenue: revenue,
    });
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="metric-value">
            {formatCurrency(results.capitalEfficiency.averageReleasedCapital, input.currency)}
          </div>
          <div className="metric-label">{t.dashboard.averageReleasedCapital}</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            {formatCurrency(results.differentiatedYield.estimatedAnnualAdditionalRevenue, input.currency)}
          </div>
          <div className="metric-label">{t.dashboard.estimatedAdditionalRevenue}</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            {formatCurrency(results.totalAnnualBenefit, input.currency)}
          </div>
          <div className="metric-label">{t.dashboard.totalAnnualBenefit}</div>
        </div>
      </div>

      {/* Capital Efficiency Alpha Section */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{t.dashboard.capitalEfficiencyAlpha}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={capitalEfficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => formatCurrency(value, input.currency)} />
                <Tooltip formatter={(value: number) => formatCurrency(value, input.currency)} />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">{t.dashboard.rwaReduction}</div>
              <div className="text-2xl font-bold text-primary-700 mt-1">
                {formatCurrency(results.capitalEfficiency.rwaReduction, input.currency)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">{t.dashboard.annualLiquidityRelease}</div>
              <div className="text-2xl font-bold text-primary-700 mt-1">
                {formatCurrency(results.capitalEfficiency.annualLiquidityRelease, input.currency)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">{t.dashboard.operatingCostReduction}</div>
              <div className="text-2xl font-bold text-primary-700 mt-1">
                {formatCurrency(results.capitalEfficiency.annualOperatingCostReduction, input.currency)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">{t.dashboard.reinvestmentROI}</div>
              <div className="text-2xl font-bold text-primary-700 mt-1">
                {formatCurrency(results.capitalEfficiency.reinvestmentROI, input.currency)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Differentiated Yield Alpha Section */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{t.dashboard.differentiatedYieldAlpha}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yieldComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Bar dataKey="yield" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">{t.dashboard.baseYield}</div>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {formatPercentage(results.differentiatedYield.baseYield)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">{t.dashboard.differentiatedAlpha}</div>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {formatPercentage(results.differentiatedYield.differentiatedAlpha)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">{t.dashboard.projectedTotalReturn}</div>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {formatPercentage(results.differentiatedYield.projectedTotalReturn)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">{t.dashboard.estimatedAdditionalRevenue}</div>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {formatCurrency(results.differentiatedYield.estimatedAnnualAdditionalRevenue, input.currency)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sensitivity Analysis */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{t.dashboard.sensitivityAnalysis}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {t.dashboard.sensitivityAnalysisDescription}
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensitivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="alpha" />
            <YAxis tickFormatter={(value) => formatCurrency(value, input.currency)} />
            <Tooltip formatter={(value: number) => formatCurrency(value, input.currency)} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              name={t.dashboard.estimatedAdditionalRevenue}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Total Benefit Breakdown */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{t.dashboard.totalBenefitBreakdown}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={totalBenefitBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatCurrency(value, input.currency)} />
            <Tooltip formatter={(value: number) => formatCurrency(value, input.currency)} />
            <Bar dataKey="value" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
