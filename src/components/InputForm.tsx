import React from 'react';
import { SimulationInput, AssetClass, Currency } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { getDefaultAlphaForAssetClass, getAverageDefaultAlpha, calculateAssetClassWeightedAverage } from '../utils/calculations';

interface InputFormProps {
  input: SimulationInput;
  onChange: (input: SimulationInput) => void;
}

export default function InputForm({ input, onChange }: InputFormProps) {
  const { t, language } = useLanguage();
  
  const assetClassOptions: { key: AssetClass; label: string }[] = [
    { key: 'Digital Bonds', label: t.inputForm.assetClasses.digitalBonds },
    { key: 'Tokenized Fund Interests', label: t.inputForm.assetClasses.tokenizedFunds },
    { key: 'Trade Finance Assets', label: t.inputForm.assetClasses.tradeFinance },
    { key: 'Real Estate', label: t.inputForm.assetClasses.realEstate },
    { key: 'Other RWA', label: t.inputForm.assetClasses.otherRWA },
  ];

  const handleChange = (field: keyof SimulationInput, value: any) => {
    onChange({ ...input, [field]: value });
  };

  const handleAssetClassToggle = (assetClass: AssetClass) => {
    const newAssetClasses = input.assetClasses.includes(assetClass)
      ? input.assetClasses.filter(ac => ac !== assetClass)
      : [...input.assetClasses, assetClass];
    handleChange('assetClasses', newAssetClasses);
  };
  const getDefaultSettlementCost = () => {
    if (input.currency === 'USD') {
      return '$10';
    }
    return '¥1,493';
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.inputForm.title}</h2>
      
      <div className="space-y-6">
        {/* AUM and Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">
              {t.inputForm.aum}
            </label>
            <input
              type="number"
              className="input-field"
              value={input.aum || ''}
              onChange={(e) => handleChange('aum', parseFloat(e.target.value) || 0)}
              placeholder={language === 'ja' ? 'AUMを入力' : 'Enter AUM'}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="label">{t.inputForm.currency}</label>
            <select
              className="input-field"
              value={input.currency}
              onChange={(e) => handleChange('currency', e.target.value as Currency)}
            >
              <option value="JPY">{t.inputForm.currencyJPY}</option>
              <option value="USD">{t.inputForm.currencyUSD}</option>
            </select>
          </div>
        </div>

        {/* Asset Classes */}
        <div>
          <label className="label">{t.inputForm.assetClass}</label>
          <p className="text-xs text-gray-500 mb-2">
            {language === 'ja' 
              ? '※ 選択した資産クラスにより、デフォルトの差別化アルファ率が自動的に適用されます'
              : '※ Selected asset classes will automatically apply default differentiated alpha rates'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {assetClassOptions.map((assetClass) => {
              const defaultAlpha = getDefaultAlphaForAssetClass(assetClass.key);
              
              return (
                <label
                  key={assetClass.key}
                  className="flex flex-col cursor-pointer p-3 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={input.assetClasses.includes(assetClass.key)}
                      onChange={() => handleAssetClassToggle(assetClass.key)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">{assetClass.label}</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 ml-6">
                    {language === 'ja' 
                      ? `デフォルトアルファ: ${defaultAlpha}%`
                      : `Default α: ${defaultAlpha}%`}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Current Yield */}
        <div>
          <label className="label">
            {t.inputForm.currentYield}
          </label>
          <input
            type="number"
            className="input-field"
            value={input.currentYield || ''}
            onChange={(e) => handleChange('currentYield', parseFloat(e.target.value) || 0)}
              placeholder={language === 'ja' ? '例: 8.5' : 'e.g., 8.5'}
            min="0"
            max="100"
            step="0.01"
          />
        </div>

        {/* Settlement Cycle */}
        <div>
          <label className="label">
            {t.inputForm.settlementCycle}
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-medium">T+</span>
            <input
              type="number"
              className="input-field flex-1"
              value={input.settlementCycle || ''}
              onChange={(e) => handleChange('settlementCycle', parseInt(e.target.value) || 0)}
              placeholder={language === 'ja' ? '例: 2' : 'e.g., 2'}
              min="0"
              step="1"
            />
          </div>
        </div>

        {/* Transaction Frequency */}
        <div>
          <label className="label">
            {t.inputForm.transactionFrequency}
          </label>
          <input
            type="number"
            className="input-field"
            value={input.annualTransactionFrequency || ''}
            onChange={(e) => handleChange('annualTransactionFrequency', parseInt(e.target.value) || 0)}
              placeholder={language === 'ja' ? '例: 12' : 'e.g., 12'}
            min="0"
            step="1"
          />
        </div>

        {/* Advanced Options (Collapsible) */}
        <details className="border-t pt-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
            {t.inputForm.advancedOptions}
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">
                {t.inputForm.reinvestmentRate}
              </label>
              <input
                type="number"
                className="input-field"
                value={input.conservativeReinvestmentRate || ''}
                onChange={(e) => handleChange('conservativeReinvestmentRate', parseFloat(e.target.value) || undefined)}
                placeholder={t.inputForm.reinvestmentRatePlaceholder}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label className="label">
                {t.inputForm.differentiatedAlpha}
              </label>
              <input
                type="number"
                className="input-field"
                value={input.differentiatedAlpha || ''}
                onChange={(e) => handleChange('differentiatedAlpha', parseFloat(e.target.value) || undefined)}
                placeholder={(() => {
                  // Calculate default alpha based on selected asset classes
                  if (input.assetClasses.length > 0) {
                    const avgAlpha = getAverageDefaultAlpha(input.assetClasses);
                    return language === 'ja' 
                      ? `デフォルト（選択資産クラス平均）: ${avgAlpha.toFixed(1)}%`
                      : `Default (avg of selected): ${avgAlpha.toFixed(1)}%`;
                  }
                  return t.inputForm.differentiatedAlphaPlaceholder;
                })()}
                min="0"
                max="100"
                step="0.1"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t.inputForm.differentiatedAlphaHint}
              </p>
              {input.assetClasses.length > 0 && (
                <p className="text-xs text-primary-600 mt-1">
                  {language === 'ja'
                    ? `※ 未入力の場合は、選択した資産クラスの平均デフォルト値（${getAverageDefaultAlpha(input.assetClasses).toFixed(1)}%）が適用されます`
                    : `※ If left blank, the average default value (${getAverageDefaultAlpha(input.assetClasses).toFixed(1)}%) of selected asset classes will be applied`}
                </p>
              )}
            </div>
            <div>
              <label className="label">
                {t.inputForm.legacySettlementCost} ({input.currency === 'USD' ? 'USD' : 'JPY'})
              </label>
              <input
                type="number"
                className="input-field"
                value={input.legacySettlementCosts || ''}
                onChange={(e) => handleChange('legacySettlementCosts', parseFloat(e.target.value) || undefined)}
                placeholder={`${t.inputForm.legacySettlementCostPlaceholder}${getDefaultSettlementCost()}`}
                min="0"
                step="0.01"
              />
            </div>

            {/* DeFi Calculation Section */}
            <div className="border-t pt-4 mt-4">
              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.useDefiCalculation || false}
                    onChange={(e) => handleChange('useDefiCalculation', e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">{t.inputForm.useDefiCalculation}</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  {t.inputForm.defiCalculationHint}
                </p>
              </div>

              {input.useDefiCalculation && (
                <div className="space-y-4 ml-6 border-l-2 border-primary-200 pl-4">
                  <div>
                    <label className="label">
                      {t.inputForm.collateralizationRatio}
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={input.collateralizationRatio !== undefined ? input.collateralizationRatio * 100 : ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        handleChange('collateralizationRatio', value !== undefined && !isNaN(value) ? value / 100 : undefined);
                      }}
                      placeholder={(() => {
                        if (input.assetClasses.length > 0) {
                          const params = calculateAssetClassWeightedAverage(input.assetClasses);
                          return language === 'ja' 
                            ? `デフォルト: ${(params.defaultCollateralizationRatio * 100).toFixed(0)}%`
                            : `Default: ${(params.defaultCollateralizationRatio * 100).toFixed(0)}%`;
                        }
                        return language === 'ja' ? '例: 60 (60%)' : 'e.g., 60 (60%)';
                      })()}
                      min="0"
                      max="100"
                      step="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'ja' 
                        ? '※ 60%の場合は「60」と入力してください（0.6として計算されます）'
                        : '※ Enter as percentage (e.g., 60 for 60%, which equals 0.6)'}
                    </p>
                  </div>
                  <div>
                    <label className="label">
                      {t.inputForm.borrowingRate}
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={input.borrowingRate || ''}
                      onChange={(e) => handleChange('borrowingRate', parseFloat(e.target.value) || undefined)}
                      placeholder={(() => {
                        if (input.assetClasses.length > 0) {
                          const params = calculateAssetClassWeightedAverage(input.assetClasses);
                          return language === 'ja' 
                            ? `デフォルト: ${params.defaultBorrowingRate.toFixed(1)}%`
                            : `Default: ${params.defaultBorrowingRate.toFixed(1)}%`;
                        }
                        return language === 'ja' ? '例: 5.5' : 'e.g., 5.5';
                      })()}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="label">
                      {t.inputForm.defiReinvestmentRate}
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={input.defiReinvestmentRate || ''}
                      onChange={(e) => handleChange('defiReinvestmentRate', parseFloat(e.target.value) || undefined)}
                      placeholder={(() => {
                        if (input.assetClasses.length > 0) {
                          const params = calculateAssetClassWeightedAverage(input.assetClasses);
                          return language === 'ja' 
                            ? `デフォルト: ${params.defaultDefiReinvestmentRate.toFixed(1)}%`
                            : `Default: ${params.defaultDefiReinvestmentRate.toFixed(1)}%`;
                        }
                        return language === 'ja' ? '例: 8.5' : 'e.g., 8.5';
                      })()}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  {input.useDefiCalculation && input.collateralizationRatio !== undefined && input.borrowingRate !== undefined && input.defiReinvestmentRate !== undefined && (
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                      <p className="text-xs text-blue-800">
                        {language === 'ja' 
                          ? `※ DeFiパラメータから計算されたアルファが使用されます。手動でアルファを指定する場合は、上記の「差別化アルファの前提」に入力してください（優先されます）。`
                          : `※ Alpha will be calculated from DeFi parameters. To override, enter a manual value in "Differentiated Alpha Assumption" above (takes priority).`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
