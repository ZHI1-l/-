import React, { useState } from 'react';
import { DictionaryTab } from './components/DictionaryTab';
import { ComparisonTab } from './components/ComparisonTab';

enum Tab {
  DICTIONARY = 'DICTIONARY',
  COMPARISON = 'COMPARISON'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DICTIONARY);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-legal-blue text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-legal-gold">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
            <span className="text-xl font-serif font-bold tracking-wide">LexiLaw 法律智库</span>
          </div>
          <nav className="flex space-x-1 bg-blue-900/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab(Tab.DICTIONARY)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === Tab.DICTIONARY
                  ? 'bg-white text-legal-blue shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              词条检索
            </button>
            <button
              onClick={() => setActiveTab(Tab.COMPARISON)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === Tab.COMPARISON
                  ? 'bg-white text-legal-blue shadow-sm'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              用词对比
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === Tab.DICTIONARY ? <DictionaryTab /> : <ComparisonTab />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} LexiLaw. Powered by Gemini 2.5 Flash.</p>
          <p className="mt-1">Legal English Dictionary & Terminology Analysis</p>
        </div>
      </footer>
    </div>
  );
};

export default App;