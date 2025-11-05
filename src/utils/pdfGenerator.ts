import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SimulationInput, SimulationResults } from '../types';
import { formatCurrency, formatPercentage } from './calculations';
import { Language, translations } from '../i18n/translations';

export function generatePDFReport(
  input: SimulationInput,
  results: SimulationResults,
  language: Language = 'en',
  filename?: string
): void {
  const t = translations[language];
  const defaultFilename = language === 'ja' 
    ? 'ROIシミュレーションレポート.pdf' 
    : 'ROI_Simulation_Report.pdf';
  const finalFilename = filename || defaultFilename;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(t.pdf.subtitle, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Date
  doc.setFontSize(10);
  const dateStr = language === 'ja' 
    ? `${t.pdf.generatedOn}${new Date().toLocaleDateString('ja-JP')}`
    : `${t.pdf.generatedOn}${new Date().toLocaleDateString()}`;
  doc.text(dateStr, margin, yPosition);
  yPosition += 15;

  // Input Parameters Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.inputParameters, margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const assetClassTranslations: Record<string, string> = {
    'Digital Bonds': language === 'ja' ? 'デジタル債券' : 'Digital Bonds',
    'Tokenized Fund Interests': language === 'ja' ? 'トークン化ファンド持分' : 'Tokenized Fund Interests',
    'Trade Finance Assets': language === 'ja' ? '貿易金融資産' : 'Trade Finance Assets',
    'Real Estate': language === 'ja' ? '不動産' : 'Real Estate',
    'Other RWA': language === 'ja' ? 'その他のRWA' : 'Other RWA',
  };
  
  const inputData = [
    [t.inputForm.aum, formatCurrency(input.aum, input.currency)],
    [t.inputForm.assetClass, input.assetClasses.map(ac => assetClassTranslations[ac] || ac).join(', ')],
    [t.inputForm.currentYield, formatPercentage(input.currentYield)],
    [t.inputForm.settlementCycle, `T+${input.settlementCycle}`],
    [t.inputForm.transactionFrequency, `${input.annualTransactionFrequency} ${language === 'ja' ? '回/年' : 'times/year'}`],
    [t.inputForm.reinvestmentRate, formatPercentage(input.conservativeReinvestmentRate || 2.0)],
    [t.inputForm.differentiatedAlpha, formatPercentage(input.differentiatedAlpha || 7.0)],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [[t.pdf.parameter, t.pdf.value]],
    body: inputData,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = margin;
  }

  // Capital Efficiency Alpha Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.capitalEfficiencyAlpha, margin, yPosition);
  yPosition += 10;

  const capitalEfficiencyData = [
    [t.dashboard.rwaReduction, formatCurrency(results.capitalEfficiency.rwaReduction, input.currency)],
    [t.dashboard.annualLiquidityRelease, formatCurrency(results.capitalEfficiency.annualLiquidityRelease, input.currency)],
    [t.dashboard.averageReleasedCapital, formatCurrency(results.capitalEfficiency.averageReleasedCapital, input.currency)],
    [t.dashboard.operatingCostReduction, formatCurrency(results.capitalEfficiency.annualOperatingCostReduction, input.currency)],
    [t.dashboard.reinvestmentROI, formatCurrency(results.capitalEfficiency.reinvestmentROI, input.currency)],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [[language === 'ja' ? '指標' : 'Metric', t.pdf.value]],
    body: capitalEfficiencyData,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = margin;
  }

  // Differentiated Yield Alpha Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.differentiatedYieldAlpha, margin, yPosition);
  yPosition += 10;

  const yieldAlphaData = [
    [t.dashboard.baseYield, formatPercentage(results.differentiatedYield.baseYield)],
    [t.dashboard.differentiatedAlpha, formatPercentage(results.differentiatedYield.differentiatedAlpha)],
    [t.dashboard.projectedTotalReturn, formatPercentage(results.differentiatedYield.projectedTotalReturn)],
    [t.dashboard.estimatedAdditionalRevenue, formatCurrency(results.differentiatedYield.estimatedAnnualAdditionalRevenue, input.currency)],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [[language === 'ja' ? '指標' : 'Metric', t.pdf.value]],
    body: yieldAlphaData,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = margin;
  }

  // Total Annual Benefit Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.totalAnnualBenefitSummary, margin, yPosition);
  yPosition += 10;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const totalBenefitLabel = language === 'ja' ? '年間総利益: ' : 'Total Annual Benefit: ';
  doc.text(
    `${totalBenefitLabel}${formatCurrency(results.totalAnnualBenefit, input.currency)}`,
    margin,
    yPosition
  );
  yPosition += 20;

  // Regulatory Compliance Framework
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdf.regulatoryCompliance, margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  t.pdf.regulatoryComplianceText.forEach((line) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += 6;
  });

  // Calculation Methodology Note
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.text(t.pdf.calculationMethodology, margin, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'italic');
  t.pdf.calculationNote.forEach((line) => {
    doc.text(line, margin, yPosition);
    yPosition += 6;
  });

  // Save the PDF
  doc.save(finalFilename);
}
