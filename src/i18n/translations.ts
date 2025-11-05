export type Language = 'en' | 'ja';

export interface Translations {
  // Header
  header: {
    title: string;
    subtitle: string;
  };

  // Input Form
  inputForm: {
    title: string;
    aum: string;
    currency: string;
    currencyJPY: string;
    currencyUSD: string;
    assetClass: string;
    assetClasses: {
      digitalBonds: string;
      tokenizedFunds: string;
      tradeFinance: string;
      realEstate: string;
      otherRWA: string;
    };
    currentYield: string;
    settlementCycle: string;
    transactionFrequency: string;
    advancedOptions: string;
      reinvestmentRate: string;
      reinvestmentRatePlaceholder: string;
      differentiatedAlpha: string;
      differentiatedAlphaPlaceholder: string;
      differentiatedAlphaHint: string;
      legacySettlementCost: string;
      legacySettlementCostPlaceholder: string;
      defiCalculation: string;
      useDefiCalculation: string;
      collateralizationRatio: string;
      borrowingRate: string;
      defiReinvestmentRate: string;
      defiCalculationHint: string;
  };

  // Dashboard
  dashboard: {
    averageReleasedCapital: string;
    estimatedAdditionalRevenue: string;
    totalAnnualBenefit: string;
    capitalEfficiencyAlpha: string;
    rwaReduction: string;
    annualLiquidityRelease: string;
    operatingCostReduction: string;
    reinvestmentROI: string;
    differentiatedYieldAlpha: string;
    baseYield: string;
    differentiatedAlpha: string;
    projectedTotalReturn: string;
    sensitivityAnalysis: string;
    sensitivityAnalysisDescription: string;
    totalBenefitBreakdown: string;
  };

  // Buttons and Actions
  buttons: {
    calculateROI: string;
    generatePDF: string;
    reset: string;
    switchLanguage: string;
  };

  // Data Protection
  dataProtection: {
    title: string;
    description: string;
  };

  // Footer
  footer: {
    note: string;
  };

  // PDF Report
  pdf: {
    title: string;
    subtitle: string;
    generatedOn: string;
    inputParameters: string;
    parameter: string;
    value: string;
    capitalEfficiencyAlpha: string;
    differentiatedYieldAlpha: string;
    totalAnnualBenefitSummary: string;
    regulatoryCompliance: string;
    regulatoryComplianceText: string[];
    calculationMethodology: string;
    calculationNote: string[];
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: 'ROI Simulator',
      subtitle: 'Quantifying the Return on Investment for Regulated Asset Liquidity',
    },
    inputForm: {
      title: 'Client Data Entry',
      aum: 'Total Assets Under Management (AUM)',
      currency: 'Currency',
      currencyJPY: 'JPY (Japanese Yen)',
      currencyUSD: 'USD (US Dollar)',
      assetClass: 'Target Asset Class (Multi-select)',
      assetClasses: {
        digitalBonds: 'Digital Bonds',
        tokenizedFunds: 'Tokenized Fund Interests',
        tradeFinance: 'Trade Finance Assets',
        realEstate: 'Real Estate',
        otherRWA: 'Other RWA',
      },
      currentYield: 'Current Average Yield (% Annualized)',
      settlementCycle: 'Current Settlement Cycle (T+N)',
      transactionFrequency: 'Current Annual Transaction Frequency (Times/Year)',
      advancedOptions: 'Advanced Options (Optional)',
      reinvestmentRate: 'Conservative Reinvestment Rate (%)',
      reinvestmentRatePlaceholder: 'Default: 2.0%',
      differentiatedAlpha: 'Differentiated Alpha Assumption (%)',
      differentiatedAlphaPlaceholder: 'Default: 7.0%',
      differentiatedAlphaHint: 'Adjust this value to see sensitivity analysis in the results',
      legacySettlementCost: 'Legacy Settlement Cost per Transaction',
      legacySettlementCostPlaceholder: 'Default: ',
      defiCalculation: 'DeFi Alpha Calculation',
      useDefiCalculation: 'Calculate Alpha from DeFi Parameters',
      collateralizationRatio: 'Collateralization Ratio (0.0-1.0)',
      borrowingRate: 'Borrowing Rate (% Annual)',
      defiReinvestmentRate: 'DeFi Reinvestment Rate (% Annual)',
      defiCalculationHint: 'Calculate alpha based on collateralization ratio, borrowing rate, and reinvestment rate (as per README specification)',
    },
    dashboard: {
      averageReleasedCapital: 'Average Released Capital',
      estimatedAdditionalRevenue: 'Estimated Annual Additional Revenue',
      totalAnnualBenefit: 'Total Annual Benefit',
      capitalEfficiencyAlpha: 'Capital Efficiency Alpha',
      rwaReduction: 'RWA Reduction from Settlement Risk Mitigation',
      annualLiquidityRelease: 'Annual Liquidity Constraint Release Value',
      operatingCostReduction: 'Annual Operating Cost Reduction',
      reinvestmentROI: 'Reinvestment Return on Released Capital (ROI)',
      differentiatedYieldAlpha: 'Differentiated Yield Alpha',
      baseYield: 'Base Yield',
      differentiatedAlpha: 'Differentiated Alpha from Network Integration',
      projectedTotalReturn: 'Projected Total Annual Return',
      sensitivityAnalysis: 'Sensitivity Analysis: Differentiated Alpha Impact',
      sensitivityAnalysisDescription: 'Adjust the Differentiated Alpha assumption in the input form to see how it impacts Estimated Annual Additional Revenue',
      totalBenefitBreakdown: 'Total Annual Benefit Breakdown',
    },
    buttons: {
      calculateROI: 'Calculate ROI',
      generatePDF: 'Generate PDF Report',
      reset: 'Reset & Start New Simulation',
      switchLanguage: '日本語',
    },
    dataProtection: {
      title: 'Data Protection Notice',
      description: 'All input data is processed locally in your browser session. No data is saved or transmitted to external servers. Your proprietary information is protected and will be cleared when you close this browser session.',
    },
    footer: {
      note: 'This ROI calculation model should be reviewed by financial engineering and legal experts. Actual results may vary based on specific regulatory requirements and market conditions.',
    },
    pdf: {
      title: 'ROI Simulation Report',
      subtitle: 'Regulated Asset Liquidity Migration Analysis',
      generatedOn: 'Generated: ',
      inputParameters: 'Input Parameters',
      parameter: 'Parameter',
      value: 'Value',
      capitalEfficiencyAlpha: 'Capital Efficiency Alpha',
      differentiatedYieldAlpha: 'Differentiated Yield Alpha',
      totalAnnualBenefitSummary: 'Total Annual Benefit Summary',
      regulatoryCompliance: 'Regulatory Compliance Framework',
      regulatoryComplianceText: [
        'The Integrated Platform combines a compliant enterprise layer with a public blockchain,',
        'ensuring full regulatory compliance while unlocking liquidity for regulated assets.',
        '',
        'Key Regulatory Features:',
        '• T+0 atomic settlement reduces settlement risk and RWA requirements',
        '• Compliant with Basel III and equivalent domestic financial regulations',
        '• Enterprise-grade security and auditability',
        '• Full transaction traceability and regulatory reporting capabilities',
      ],
      calculationMethodology: 'Calculation Methodology Note',
      calculationNote: [
        'Note: All calculations are based on industry-standard models and should be reviewed',
        'by financial engineering and legal experts. Actual results may vary based on specific',
        'regulatory requirements and market conditions.',
      ],
    },
  },
  ja: {
    header: {
      title: 'ROIシミュレーター',
      subtitle: '規制資産流動性への投資収益率の定量化',
    },
    inputForm: {
      title: 'クライアントデータ入力',
      aum: '運用資産総額（AUM）',
      currency: '通貨',
      currencyJPY: 'JPY（日本円）',
      currencyUSD: 'USD（米ドル）',
      assetClass: '対象資産クラス（複数選択可）',
      assetClasses: {
        digitalBonds: 'デジタル債券',
        tokenizedFunds: 'トークン化ファンド持分',
        tradeFinance: '貿易金融資産',
        realEstate: '不動産',
        otherRWA: 'その他のRWA',
      },
      currentYield: '現在の平均利回り（年率%）',
      settlementCycle: '現在の決済サイクル（T+N）',
      transactionFrequency: '現在の年間取引頻度（回/年）',
      advancedOptions: '詳細オプション（任意）',
      reinvestmentRate: '保守的な再投資率（%）',
      reinvestmentRatePlaceholder: 'デフォルト: 2.0%',
      differentiatedAlpha: '差別化アルファの前提（%）',
      differentiatedAlphaPlaceholder: 'デフォルト: 7.0%',
      differentiatedAlphaHint: 'この値を調整すると、結果で感度分析が表示されます',
      legacySettlementCost: '従来の決済コスト（取引あたり）',
      legacySettlementCostPlaceholder: 'デフォルト: ',
      defiCalculation: 'DeFiアルファ計算',
      useDefiCalculation: 'DeFiパラメータからアルファを計算',
      collateralizationRatio: '担保化比率（0.0-1.0）',
      borrowingRate: '借入率（年率%）',
      defiReinvestmentRate: 'DeFi再投資率（年率%）',
      defiCalculationHint: '担保化比率、借入率、再投資率に基づいてアルファを計算（README仕様に基づく）',
    },
    dashboard: {
      averageReleasedCapital: '平均解放資本',
      estimatedAdditionalRevenue: '推定年間追加収益',
      totalAnnualBenefit: '年間総利益',
      capitalEfficiencyAlpha: '資本効率アルファ',
      rwaReduction: '決済リスク軽減によるRWA削減',
      annualLiquidityRelease: '年間流動性制約解放価値',
      operatingCostReduction: '年間運営コスト削減',
      reinvestmentROI: '解放資本の再投資収益率（ROI）',
      differentiatedYieldAlpha: '差別化利回りアルファ',
      baseYield: '基準利回り',
      differentiatedAlpha: 'ネットワーク統合による差別化アルファ',
      projectedTotalReturn: '予測年間総リターン',
      sensitivityAnalysis: '感度分析：差別化アルファへの影響',
      sensitivityAnalysisDescription: '入力フォームで差別化アルファの前提を調整すると、推定年間追加収益への影響を確認できます',
      totalBenefitBreakdown: '年間総利益の内訳',
    },
    buttons: {
      calculateROI: 'ROIを計算',
      generatePDF: 'PDFレポートを生成',
      reset: 'リセットして新しいシミュレーションを開始',
      switchLanguage: 'English',
    },
    dataProtection: {
      title: 'データ保護に関するお知らせ',
      description: 'すべての入力データは、お使いのブラウザセッション内でローカルに処理されます。データは外部サーバーに保存または送信されることはありません。お客様の機密情報は保護され、このブラウザセッションを閉じると消去されます。',
    },
    footer: {
      note: 'このROI計算モデルは、金融工学および法務の専門家による確認が必要です。実際の結果は、特定の規制要件および市場条件に応じて異なる場合があります。',
    },
    pdf: {
      title: 'ROIシミュレーションレポート',
      subtitle: '規制資産流動性移行分析',
      generatedOn: '生成日: ',
      inputParameters: '入力パラメータ',
      parameter: 'パラメータ',
      value: '値',
      capitalEfficiencyAlpha: '資本効率アルファ',
      differentiatedYieldAlpha: '差別化利回りアルファ',
      totalAnnualBenefitSummary: '年間総利益サマリー',
      regulatoryCompliance: '規制コンプライアンスフレームワーク',
      regulatoryComplianceText: [
        '統合プラットフォームは、コンプライアントなエンタープライズ層とパブリックブロックチェーンを組み合わせ、',
        '規制資産の流動性を解放しながら、完全な規制コンプライアンスを確保します。',
        '',
        '主要な規制機能：',
        '• T+0アトミック決済により決済リスクとRWA要件を削減',
        '• バーゼルIIIおよび同等の国内金融規制に準拠',
        '• エンタープライズグレードのセキュリティと監査可能性',
        '• 完全な取引の追跡可能性と規制報告機能',
      ],
      calculationMethodology: '計算方法に関する注記',
      calculationNote: [
        '注記：すべての計算は業界標準モデルに基づいており、金融工学および法務の専門家による',
        '確認が必要です。実際の結果は、特定の規制要件および市場条件に応じて異なる場合があります。',
      ],
    },
  },
};
