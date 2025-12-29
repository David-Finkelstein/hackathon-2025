
import React from 'react';
import { InspectionResult, Finding, Severity } from '../types';

interface AnalysisViewProps {
  result: InspectionResult;
  images: { baseline: string; current: string };
  onFinalize: () => void;
  onBack: () => void;
}

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  const styles = {
    [Severity.LOW]: 'bg-green-100 text-green-700',
    [Severity.MEDIUM]: 'bg-yellow-100 text-yellow-700',
    [Severity.HIGH]: 'bg-orange-100 text-orange-700',
    [Severity.CRITICAL]: 'bg-red-100 text-red-700',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles[severity]}`}>{severity}</span>;
};

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, images, onFinalize, onBack }) => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-slate-400 flex items-center gap-1 font-semibold text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h2 className="font-bold text-slate-800">Inspection Results</h2>
        <div className="w-10"></div>
      </div>

      {/* Side by Side Preview */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase text-center">Baseline</p>
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden">
            <img src={images.baseline} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase text-center">After checkout</p>
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative">
            <img src={images.current} className="w-full h-full object-cover" />
            {result.findings.map((f, i) => (
              <div key={i} className="absolute inset-0 flex items-center justify-center">
                 {/* Mock visual markers if location data is provided */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
           <h3 className="font-bold text-lg">Report Summary</h3>
           <span className="bg-blue-500/50 px-3 py-1 rounded-full text-xs font-bold">{result.findings.length} ISSUES</span>
        </div>
        <p className="text-blue-100 text-sm leading-relaxed">{result.summary}</p>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        <h4 className="font-bold text-slate-800 flex items-center gap-2">
          Detailed Findings
          {result.findings.length === 0 && <span className="text-green-500 text-sm font-normal">No issues found ✅</span>}
        </h4>
        
        {result.findings.map((finding) => (
          <div key={finding.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-3 h-3 rounded-full ${finding.type === 'DAMAGE' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                  <h5 className="font-bold text-slate-800 text-base">{finding.item}</h5>
                </div>
                <SeverityBadge severity={finding.severity} />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Est. Cost</p>
                <p className="text-base font-bold text-slate-800">{finding.estimatedCost || 'TBD'}</p>
              </div>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {finding.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                AI Confidence: {(finding.confidence * 100).toFixed(0)}%
              </span>
              <span className="capitalize">📍 {finding.location || 'Unknown'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 sticky bottom-4 z-10 bg-white">
        <button
          onClick={onFinalize}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Confirm & Generate Report
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
    </div>
  );
};

export default AnalysisView;
