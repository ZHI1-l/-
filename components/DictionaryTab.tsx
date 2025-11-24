import React, { useState } from 'react';
import { searchLegalTerm } from '../services/gemini';
import { LoadingState } from '../types';
import { Spinner } from './Spinner';

export const DictionaryTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStatus(LoadingState.LOADING);
    setResult(null);

    try {
      const data = await searchLegalTerm(query);
      setResult(data);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-serif font-bold text-slate-800">法律词条全解</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          输入中文或英文法律术语，获取权威的 Collins 风格释义、例句及法律背景解析。
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-slate-100">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例如: Force Majeure, 善意第三人, Tort..."
            className="w-full pl-4 pr-32 py-4 text-lg border-2 border-slate-200 rounded-lg focus:border-legal-blue focus:ring-0 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={status === LoadingState.LOADING}
            className="absolute right-2 top-2 bottom-2 bg-legal-blue hover:bg-blue-800 text-white px-6 rounded-md font-medium transition-colors flex items-center justify-center min-w-[100px]"
          >
            {status === LoadingState.LOADING ? <Spinner /> : '检索'}
          </button>
        </form>
      </div>

      {status === LoadingState.ERROR && (
        <div className="max-w-3xl mx-auto p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center">
          抱歉，检索时出现错误，请稍后重试。
        </div>
      )}

      {result && status === LoadingState.SUCCESS && (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden animate-fade-in-up">
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center space-x-2">
             <div className="h-3 w-3 rounded-full bg-legal-gold"></div>
             <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">Result</span>
          </div>
          <div className="p-8 prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-legal-blue prose-a:text-blue-600">
             {/* Using whitespace-pre-line to preserve structure from the text generation while allowing wrapping */}
            <div className="whitespace-pre-line leading-relaxed text-slate-800 text-lg">
              {result}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};