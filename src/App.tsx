import React, { useState, useMemo } from 'react';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import { SimulationInput, SimulationResults } from './types';
import { calculateSimulationResults } from './utils/calculations';
import { generatePDFReport } from './utils/pdfGenerator';
import { useLanguage } from './i18n/LanguageContext';

const defaultInput: SimulationInput = {
  aum: 1000, // 1 billion in base currency
  currency: 'USD',
  assetClasses: [],
  currentYield: 8.5,
  settlementCycle: 2,
  annualTransactionFrequency: 12,
};

function App() {
  const { t, language, setLanguage } = useLanguage();
  const [input, setInput] = useState<SimulationInput>(defaultInput);
  const [showResults, setShowResults] = useState(false);

  const results = useMemo<SimulationResults | null>(() => {
    if (!showResults || !input.aum || input.assetClasses.length === 0) {
      return null;
    }
    return calculateSimulationResults(input);
  }, [input, showResults]);

  const handleCalculate = () => {
    if (!input.aum || input.aum <= 0) {
      alert(language === 'ja' ? '有効なAUM値を入力してください' : 'Please enter a valid AUM value');
      return;
    }
    if (input.assetClasses.length === 0) {
      alert(language === 'ja' ? '少なくとも1つの資産クラスを選択してください' : 'Please select at least one asset class');
      return;
    }
    if (!input.currentYield || input.currentYield <= 0) {
      alert(language === 'ja' ? '有効な現在の利回りを入力してください' : 'Please enter a valid current yield');
      return;
    }
    if (!input.settlementCycle || input.settlementCycle < 0) {
      alert(language === 'ja' ? '有効な決済サイクルを入力してください' : 'Please enter a valid settlement cycle');
      return;
    }
    if (!input.annualTransactionFrequency || input.annualTransactionFrequency <= 0) {
      alert(language === 'ja' ? '有効な年間取引頻度を入力してください' : 'Please enter a valid annual transaction frequency');
      return;
    }
    setShowResults(true);
  };

  const handleReset = () => {
    setInput(defaultInput);
    setShowResults(false);
  };

  const handleGeneratePDF = () => {
    if (!results) {
      alert(language === 'ja' ? 'まず結果を計算してください' : 'Please calculate results first');
      return;
    }
    generatePDFReport(input, results, language);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t.header.title}
              </h1>
              <p className="text-gray-600 mt-2">
                {t.header.subtitle}
              </p>
            </div>
            <button
              onClick={toggleLanguage}
              className="btn-secondary text-sm px-4 py-2"
            >
              {t.buttons.switchLanguage}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Input Form */}
          <InputForm input={input} onChange={setInput} />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCalculate}
              className="btn-primary"
              disabled={showResults}
            >
              {t.buttons.calculateROI}
            </button>
            {showResults && (
              <>
                <button
                  onClick={handleGeneratePDF}
                  className="btn-secondary"
                >
                  {t.buttons.generatePDF}
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  {t.buttons.reset}
                </button>
              </>
            )}
          </div>

          {/* Results Dashboard */}
          {showResults && results && (
            <Dashboard input={input} results={results} />
          )}

          {/* Info Banner */}
          {!showResults && (
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    {t.dataProtection.title}
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      {t.dataProtection.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            {t.footer.note}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
