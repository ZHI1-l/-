import React, { useState } from 'react';
import { compareLegalTerms } from '../services/gemini';
import { ComparisonResultItem, LoadingState } from '../types';
import { Spinner } from './Spinner';

export const ComparisonTab: React.FC = () => {
  const [chineseTerm, setChineseTerm] = useState('');
  const [candidates, setCandidates] = useState<string[]>(['', '']); // Start with 2 empty inputs
  const [results, setResults] = useState<ComparisonResultItem[] | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  const handleCandidateChange = (index: number, value: string) => {
    const newCandidates = [...candidates];
    newCandidates[index] = value;
    setCandidates(newCandidates);
  };

  const addCandidateField = () => {
    setCandidates([...candidates, '']);
  };

  const removeCandidateField = (index: number) => {
    if (candidates.length <= 1) return;
    const newCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(newCandidates);
  };

  const handleCompare = async () => {
    const validCandidates = candidates.filter(c => c.trim() !== '');
    if (!chineseTerm.trim() || validCandidates.length === 0) {
      alert("请输入中文标准词和至少一个英文翻译候选项。");
      return;
    }

    setStatus(LoadingState.LOADING);
    setResults(null);

    try {
      const response = await compareLegalTerms(chineseTerm, validCandidates);
      setResults(response.analysis);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <div className="space-y-8 pb-12">
       <div className="text-center space-y-4">
        <h2 className="text-3xl font-serif font-bold text-slate-800">用词精准度对比</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          以中文法律概念为基准，分析不同英语翻译的契合度，寻找最地道的法律表达。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-legal-blue">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-legal-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
              中文基准词
            </h3>
            <input
              type="text"
              value={chineseTerm}
              onChange={(e) => setChineseTerm(e.target.value)}
              placeholder="例如：不可抗力"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-legal-blue focus:border-transparent outline-none"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-legal-gold">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-legal-gold text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
              英语候选词
            </h3>
            <div className="space-y-3">
              {candidates.map((candidate, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={candidate}
                    onChange={(e) => handleCandidateChange(index, e.target.value)}
                    placeholder={`候选词 ${index + 1}`}
                    className="flex-grow p-2 border border-slate-300 rounded-lg focus:border-legal-gold outline-none text-sm"
                  />
                  {candidates.length > 1 && (
                    <button
                      onClick={() => removeCandidateField(index)}
                      className="text-slate-400 hover:text-red-500 px-2"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addCandidateField}
                className="text-sm text-legal-blue font-medium hover:underline mt-2 flex items-center"
              >
                + 添加更多选项
              </button>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={status === LoadingState.LOADING}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center"
          >
            {status === LoadingState.LOADING ? (
              <>
                <Spinner /> <span className="ml-2">分析中...</span>
              </>
            ) : (
              '开始对比分析'
            )}
          </button>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2">
           {status === LoadingState.IDLE && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 p-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                <p>在左侧输入词汇以查看分析报告</p>
              </div>
           )}

           {status === LoadingState.ERROR && (
             <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
               分析失败，请检查网络或稍后重试。
             </div>
           )}

           {status === LoadingState.SUCCESS && results && (
             <div className="space-y-6">
               {results
                 .sort((a, b) => b.score - a.score)
                 .map((item, idx) => (
                 <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                       <span className="text-4xl font-bold text-legal-blue">{item.score}</span>
                       <span className="text-xs uppercase text-slate-500 font-semibold tracking-wide mt-1">Score</span>
                       <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                         <div 
                            className={`h-full rounded-full ${item.score > 80 ? 'bg-green-500' : item.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${item.score}%` }}
                          ></div>
                       </div>
                    </div>
                    <div className="md:w-3/4">
                      <h4 className="text-xl font-serif font-bold text-slate-900 mb-2">{item.term}</h4>
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                        {item.reason}
                      </p>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};