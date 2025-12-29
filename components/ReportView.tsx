
import React from 'react';
import { InspectionResult, Property } from '../types';

interface ReportViewProps {
  result: InspectionResult;
  property: Property;
  onClose: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ result, property, onClose }) => {
  const totalCost = result.findings.reduce((acc, curr) => {
    const costMatch = curr.estimatedCost?.match(/\d+/);
    return acc + (costMatch ? parseInt(costMatch[0]) : 0);
  }, 0);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Final Report</h2>
        <button onClick={onClose} className="text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* PDF-like header */}
      <div className="bg-white border-2 border-slate-100 p-6 rounded-3xl space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-2xl mb-2">G</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Guesty Guard Official</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800">#{property.pendingCheckout?.reservationId}</p>
            <p className="text-[10px] text-slate-400">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase">Property</p>
            <p className="font-bold text-slate-800">{property.name}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase">Guest</p>
            <p className="font-bold text-slate-800">{property.pendingCheckout?.guestName}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl">
          <h4 className="text-slate-400 text-[10px] font-bold uppercase mb-2">Findings Summary</h4>
          <div className="space-y-2">
            {result.findings.map((f, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-slate-700">{f.item} ({f.type.toLowerCase()})</span>
                <span className="font-bold text-slate-800">{f.estimatedCost || '$0'}</span>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between items-center font-bold">
              <span className="text-slate-800 uppercase text-xs">Recommended Charge</span>
              <span className="text-blue-600 text-lg">${totalCost}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
           <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all">
             Charge Security Deposit
           </button>
           <button className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             Download Evidence PDF
           </button>
        </div>
      </div>

      <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-r-xl">
        <p className="text-yellow-800 font-bold text-sm mb-1">Evidence Saved</p>
        <p className="text-yellow-700 text-xs leading-relaxed">
          High-resolution comparison photos and AI assessment logs have been securely archived for any potential guest disputes.
        </p>
      </div>

      <button 
        onClick={onClose}
        className="w-full text-slate-400 font-bold py-4 hover:text-slate-600 transition-colors"
      >
        Done - Back to Dashboard
      </button>
    </div>
  );
};

export default ReportView;
