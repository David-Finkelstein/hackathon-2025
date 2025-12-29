import React from 'react';
import { CompareResponse, RoomAssessment, DamageItem, RoomImages } from '../types';

interface AnalysisViewProps {
  result: CompareResponse;
  roomImages: RoomImages;
  onFinalize: () => void;
  onBack: () => void;
}

const SeverityBadge: React.FC<{ severity: 'low' | 'medium' | 'high' }> = ({ severity }) => {
  const styles = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${styles[severity]}`}>{severity}</span>;
};

const ConditionBadge: React.FC<{ condition: 'missing' | 'damaged' | 'broken' }> = ({ condition }) => {
  const styles = {
    missing: 'bg-orange-100 text-orange-700',
    damaged: 'bg-red-100 text-red-700',
    broken: 'bg-red-200 text-red-800',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${styles[condition]}`}>{condition}</span>;
};

const StatusBadge: React.FC<{ status: 'all_clear' | 'minor_issues' | 'major_concerns' }> = ({ status }) => {
  const config = {
    all_clear: { bg: 'bg-green-500', text: 'All Clear' },
    minor_issues: { bg: 'bg-yellow-500', text: 'Minor Issues' },
    major_concerns: { bg: 'bg-red-500', text: 'Major Concerns' },
  };
  return (
    <span className={`${config[status].bg} text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}>
      {config[status].text}
    </span>
  );
};

const RoomCard: React.FC<{ assessment: RoomAssessment; image: string | null }> = ({ assessment, image }) => {
  const roomIcons: Record<string, string> = {
    'Kitchen': '🍳',
    'Bathroom': '🛁',
    'Living Room': '🛋️',
    'Bedroom': '🛏️',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Room Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100">
        {image && (
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img src={image} className="w-full h-full object-cover" alt={assessment.room} />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{roomIcons[assessment.room] || '🏠'}</span>
            <h4 className="font-bold text-slate-800">{assessment.room}</h4>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {assessment.damageDetected ? (
              <span className="text-red-600 text-xs font-semibold flex items-center gap-1">
                ⚠️ {assessment.items.length} issue(s) found
              </span>
            ) : (
              <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                ✓ No issues detected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Items List */}
      {assessment.items.length > 0 && (
        <div className="p-4 space-y-3">
          {assessment.items.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-bold text-slate-800 text-sm">{item.itemName}</h5>
                <div className="flex gap-1">
                  <ConditionBadge condition={item.condition} />
                  <SeverityBadge severity={item.severity} />
                </div>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      {assessment.notes && (
        <div className="px-4 pb-4">
          <p className="text-slate-500 text-xs italic bg-slate-50 p-2 rounded-lg">
            📝 {assessment.notes}
          </p>
        </div>
      )}
    </div>
  );
};

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, roomImages, onFinalize, onBack }) => {
  const getRoomImage = (roomName: string): string | null => {
    const mapping: Record<string, keyof RoomImages> = {
      'Kitchen': 'kitchen',
      'Bathroom': 'bathroom',
      'Living Room': 'livingRoom',
      'Bedroom': 'bedroom',
    };
    return roomImages[mapping[roomName]] || null;
  };

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

      {/* Summary Card */}
      <div className={`p-4 rounded-2xl text-white shadow-lg ${
        result.summary.overallStatus === 'all_clear' ? 'bg-green-600' :
        result.summary.overallStatus === 'minor_issues' ? 'bg-yellow-600' : 'bg-red-600'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">Property Summary</h3>
          <StatusBadge status={result.summary.overallStatus} />
        </div>
        <p className="text-white/90 text-sm leading-relaxed mb-3">{result.summary.summary}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="opacity-80">Total Issues Found</span>
          <span className="font-bold text-xl">{result.summary.totalIssuesFound}</span>
        </div>
      </div>

      {/* Items to Check */}
      {result.summary.itemsToCheck.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
            ⚠️ Items Requiring Attention
          </h4>
          <div className="space-y-2">
            {result.summary.itemsToCheck.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-amber-600">•</span>
                <span className="font-medium text-amber-800">{item.room}:</span>
                <span className="text-amber-700">{item.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Room Assessments */}
      <div className="space-y-4">
        <h4 className="font-bold text-slate-800 flex items-center gap-2">
          Room-by-Room Analysis
        </h4>
        
        {result.roomAssessments.map((assessment, idx) => (
          <RoomCard 
            key={idx} 
            assessment={assessment} 
            image={getRoomImage(assessment.room)}
          />
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
