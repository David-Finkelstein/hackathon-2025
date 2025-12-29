import React, { useState } from 'react';
import { Property, CompareResponse, RoomImages } from '../types';
import { analyzeAllRooms } from '../services/geminiService';
import CameraCapture from './CameraCapture';

interface InspectionWizardProps {
  property: Property;
  onCancel: () => void;
  onAnalyze: (result: CompareResponse, roomImages: RoomImages) => void;
}

const ROOMS = [
  { id: 'kitchen', name: 'Kitchen', icon: '🍳', key: 'kitchen' as const },
  { id: 'bathroom', name: 'Bathroom', icon: '🛁', key: 'bathroom' as const },
  { id: 'livingRoom', name: 'Living Room', icon: '🛋️', key: 'livingRoom' as const },
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️', key: 'bedroom' as const },
];

const InspectionWizard: React.FC<InspectionWizardProps> = ({ property, onCancel, onAnalyze }) => {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [roomImages, setRoomImages] = useState<RoomImages>({
    kitchen: null,
    bathroom: null,
    livingRoom: null,
    bedroom: null,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const currentRoom = ROOMS[currentRoomIndex];
  const allPhotosComplete = ROOMS.every(room => roomImages[room.key] !== null);
  const completedRooms = ROOMS.filter(room => roomImages[room.key] !== null).length;

  const handlePhotoCapture = (photoDataUrl: string) => {
    setRoomImages(prev => ({
      ...prev,
      [currentRoom.key]: photoDataUrl,
    }));
    setShowCamera(false);
    
    // Auto-advance to next room if not the last one
    if (currentRoomIndex < ROOMS.length - 1) {
      setCurrentRoomIndex(currentRoomIndex + 1);
    }
  };

  const startAnalysis = async () => {
    if (!allPhotosComplete) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeAllRooms(roomImages);
      onAnalyze(result, roomImages);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
      setIsAnalyzing(false);
    }
  };

  if (showCamera) {
    return (
      <CameraCapture
        title={currentRoom.name}
        onPhotoCapture={handlePhotoCapture}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-[70vh] text-center space-y-6 relative">
        <div className="absolute top-8 left-8 text-3xl opacity-20 animate-pulse">🎄</div>
        <div className="absolute top-8 right-8 text-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}>⛄</div>
        <div className="absolute bottom-8 left-1/4 text-2xl opacity-20 animate-pulse" style={{ animationDelay: '0.3s' }}>❄️</div>
        <div className="absolute bottom-8 right-1/4 text-2xl opacity-20 animate-pulse" style={{ animationDelay: '0.7s' }}>🎅</div>
        
        <div className="w-24 h-24 border-8 border-[#007A67]/30 border-t-[#54A18A] rounded-full animate-spin relative z-10"></div>
        <div className="space-y-2 relative z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#54A18A] to-[#007A67] bg-clip-text text-transparent">🎁 Analyzing All Rooms... 🎁</h2>
          <p className="text-slate-600">AI is comparing baseline and current photos for damages and missing items.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-4 rounded-xl w-full text-left border border-[#54A18A]/20 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669]"></div>
            <span className="text-sm font-medium text-slate-700">Uploading images</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#54A18A] to-[#007A67] animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">Analyzing 4 rooms for damages</span>
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
          onClick={onCancel} 
          className="text-slate-400 flex items-center gap-1 font-semibold text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase">🎄 Inspection Flow 🎅</span>
        <div className="w-10"></div>
      </div>

      <header className="relative">
        <div className="absolute -top-2 -right-2 text-2xl animate-pulse">❄️</div>
        <h2 className="text-2xl font-bold text-slate-800">{property.name} 🏠</h2>
        <p className="text-slate-500 text-sm">📸 Capture photos of all 4 rooms ({completedRooms}/4 complete) 🎁</p>
      </header>

      {/* Progress Indicator */}
      <div className="flex gap-2">
        {ROOMS.map((room, index) => (
          <div
            key={room.id}
            className={`flex-1 h-2 rounded-full transition-all ${
              roomImages[room.key] ? 'bg-gradient-to-r from-[#10B981] to-[#059669]' : 
              index === currentRoomIndex ? 'bg-gradient-to-r from-[#54A18A] to-[#007A67]' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-2 gap-4">
        {ROOMS.map((room, index) => {
          const hasPhoto = roomImages[room.key] !== null;
          const isCurrent = index === currentRoomIndex;
          
          return (
            <button
              key={room.id}
              onClick={() => {
                setCurrentRoomIndex(index);
                if (!hasPhoto) {
                  setShowCamera(true);
                }
              }}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 relative overflow-hidden shadow-sm ${
                isCurrent ? 'border-[#54A18A] bg-gradient-to-br from-blue-50 to-teal-50 shadow-md' : 
                hasPhoto ? 'border-[#10B981] bg-gradient-to-br from-green-50 to-teal-50' : 'border-slate-100 bg-white hover:border-[#54A18A]/30'
              }`}
            >
              {hasPhoto && (
                <div className="absolute inset-0">
                  <img 
                    src={roomImages[room.key]!} 
                    className="w-full h-full object-cover opacity-30" 
                    alt={room.name}
                  />
                </div>
              )}
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-3xl">{room.icon}</span>
                <span className="font-bold text-slate-800 text-sm">{room.name}</span>
                {hasPhoto ? (
                  <span className="text-[#10B981] text-xs font-semibold flex items-center gap-1">
                    ✓ Captured
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">Tap to capture</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Room Action */}
      {!roomImages[currentRoom.key] && (
        <button
          onClick={() => setShowCamera(true)}
          className="w-full aspect-video bg-gradient-to-br from-[#54A18A] to-[#007A67] text-white rounded-2xl shadow-lg flex flex-col items-center justify-center gap-3 active:scale-[0.99] transition-all hover:shadow-xl"
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl">
            📷
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">Capture {currentRoom.name}</p>
            <p className="text-white/80 text-sm">Take photo after checkout</p>
          </div>
        </button>
      )}

      {/* Retake current photo */}
      {roomImages[currentRoom.key] && (
        <div className="space-y-3">
          <div className="relative aspect-video bg-slate-900 border-2 border-[#10B981] rounded-2xl overflow-hidden shadow-md">
            <img src={roomImages[currentRoom.key]!} className="w-full h-full object-cover" alt={currentRoom.name} />
            <div className="absolute top-3 left-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-3 py-1 rounded-lg text-sm font-bold shadow-md">
              {currentRoom.icon} {currentRoom.name}
            </div>
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setShowCamera(true)}
                className="bg-gradient-to-r from-[#54A18A] to-[#007A67] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg active:scale-95 transition-all hover:shadow-xl"
              >
                📷 Retake
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-200 shadow-sm">
          {error}
        </p>
      )}

      <button
        disabled={!allPhotosComplete}
        onClick={startAnalysis}
        className="w-full bg-gradient-to-r from-[#54A18A] to-[#007A67] text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] hover:shadow-xl disabled:from-slate-400 disabled:to-slate-500"
      >
        {allPhotosComplete ? '✅ Analyze All Rooms' : `📷 Capture remaining ${4 - completedRooms} room(s)`}
      </button>
    </div>
  );
};

export default InspectionWizard;
