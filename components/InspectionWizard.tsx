
import React, { useState } from 'react';
import { Property, InspectionResult } from '../types';
import { analyzePropertyImages } from '../services/geminiService';
import CameraCapture from './CameraCapture';

interface InspectionWizardProps {
  property: Property;
  onCancel: () => void;
  onAnalyze: (result: InspectionResult, baseline: string, current: string) => void;
}

const ROOMS = [
  { id: 'living', name: 'Living Room', icon: '🛋️' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
  { id: 'bathroom', name: 'Bathroom', icon: '🛁' },
];

const InspectionWizard: React.FC<InspectionWizardProps> = ({ property, onCancel, onAnalyze }) => {
  const [step, setStep] = useState(1);
  const [roomType, setRoomType] = useState('Living Room');
  const [baselineImage, setBaselineImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<'baseline' | 'current' | null>(null);

  const startAnalysis = async () => {
    if (!baselineImage) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      // const result = // API
      const result = await analyzePropertyImages(baselineImage, currentImage, roomType);
      onAnalyze(result, baselineImage, currentImage);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setIsAnalyzing(false);
    }
  };

  if (showCamera) {
    return (
      <CameraCapture
        title={showCamera === 'baseline' && `${roomType}`}
        onPhotoCapture={(photoDataUrl) => {
          if (showCamera === 'baseline') {
            setBaselineImage(photoDataUrl);
          } else {
            setCurrentImage(photoDataUrl);
          }
          setShowCamera(null);
        }}
        onCancel={() => setShowCamera(null)}
      />
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-[70vh] text-center space-y-6">
        <div className="w-24 h-24 border-8 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Analyzing Images...</h2>
          <p className="text-slate-500">AI is comparing baseline and current photos for damages and missing items.</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl w-full text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-slate-700">Objects identified</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">Checking for damages</span>
          </div>
          <div className="flex items-center gap-2 opacity-30">
            <div className="w-4 h-4 rounded-full bg-slate-300"></div>
            <span className="text-sm font-medium text-slate-700">Generating report</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => step === 1 ? onCancel() : setStep(1)} 
          className="text-slate-400 flex items-center gap-1 font-semibold text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase">Inspection Flow</span>
        <div className="w-10"></div>
      </div>

      <header>
        <h2 className="text-2xl font-bold text-slate-800">{property.name}</h2>
        <p className="text-slate-500 text-sm">Step {step} of 3: {step === 1 ? 'Select Room' : step === 2 ? 'Upload Photos' : 'Review'}</p>
      </header>

      {step === 1 && (
        <div className="grid grid-cols-2 gap-4">
          {ROOMS.map(room => (
            <button
              key={room.id}
              onClick={() => { setRoomType(room.name); setStep(2); }}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${roomType === room.name ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'}`}
            >
              <span className="text-4xl">{room.icon}</span>
              <span className="font-bold text-slate-800">{room.name}</span>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {/* Baseline Photo */}
          <div className="space-y-2">
            {baselineImage ? (
              <div className="relative aspect-video bg-slate-900 border-2 border-slate-300 rounded-2xl overflow-hidden">
                <img src={baselineImage} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => setShowCamera('baseline')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg active:scale-95 transition-all"
                  >
                    📷 Retake
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCamera('baseline')}
                className="w-full aspect-video bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center gap-3 active:scale-[0.99] transition-all"
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl">
                  📷
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">Open Camera</p>
                  <p className="text-blue-100 text-sm">Take baseline photo</p>
                </div>
              </button>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">
              {error}
            </p>
          )}

          <button
            disabled={!baselineImage}
            onClick={startAnalysis}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
          >
            ✅ Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default InspectionWizard;
