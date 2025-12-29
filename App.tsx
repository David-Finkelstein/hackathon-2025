
import React, { useState } from 'react';
import { AppView, Property, CompareResponse, RoomImages } from './types';
import Dashboard from './components/Dashboard';
import InspectionWizard from './components/InspectionWizard';
import AnalysisView from './components/AnalysisView';
import ReportView from './components/ReportView';
import Analytics from './components/Analytics';

const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop_1',
    name: 'Sunset Beach Apartment',
    address: '123 Ocean Drive, Miami Beach, FL',
    thumbnail: 'https://picsum.photos/seed/beach/400/300',
    pendingCheckout: {
      guestName: 'John Smith',
      checkoutTime: '11:00 AM',
      reservationId: 'RES-78234'
    }
  },
  {
    id: 'prop_2',
    name: 'Mountain View Condo',
    address: '456 Alpine Way, Aspen, CO',
    thumbnail: 'https://picsum.photos/seed/mountain/400/300',
    pendingCheckout: {
      guestName: 'Lisa Wong',
      checkoutTime: '2:00 PM',
      reservationId: 'RES-99120'
    }
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('DASHBOARD');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inspectionResult, setInspectionResult] = useState<CompareResponse | null>(null);
  const [roomImages, setRoomImages] = useState<RoomImages | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const startInspection = (property: Property) => {
    setSelectedProperty(property);
    setView('INSPECTION_WIZARD');
  };

  const onAnalysisComplete = (result: CompareResponse, images: RoomImages) => {
    setInspectionResult(result);
    setRoomImages(images);
    setView('ANALYSIS');
  };

  const finalizeInspection = () => {
    setView('REPORT');
  };

  const resetToDashboard = () => {
    setView('DASHBOARD');
    setSelectedProperty(null);
    setInspectionResult(null);
    setRoomImages(null);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-gradient-to-br from-slate-50 to-blue-50 shadow-xl relative">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#54A18A] to-[#007A67] text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-2 relative z-10" onClick={resetToDashboard} style={{ cursor: 'pointer' }}>
          {/* Guesty Logo */}
          <div className="relative">
            <img 
              src="data:image/png;base64,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" 
              alt="Guesty" 
              className="h-8 w-auto"
            />
          </div>
          <span className="text-white/40 mx-1">|</span>
          <h1 className="text-lg font-bold tracking-tight">Guard</h1>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white/80 hover:text-white transition-colors relative z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </header>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Drawer */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform">
            <div className="p-4 bg-gradient-to-r from-[#54A18A] to-[#007A67] flex items-center justify-between relative overflow-hidden">
              <h2 className="font-bold text-white relative z-10">Menu</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-white/80 hover:text-white relative z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              <button
                onClick={() => {
                  resetToDashboard();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#54A18A]/10 hover:to-[#007A67]/10 transition-all flex items-center gap-3 group"
              >
                <svg className="w-5 h-5 text-[#54A18A] group-hover:text-[#007A67] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="font-medium text-slate-700 group-hover:text-[#54A18A]">Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  setView('ANALYTICS');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#54A18A]/10 hover:to-[#007A67]/10 transition-all flex items-center gap-3 group"
              >
                <svg className="w-5 h-5 text-[#54A18A] group-hover:text-[#007A67] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium text-slate-700 group-hover:text-[#54A18A]">Analytics</span>
              </button>
              
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#54A18A]/10 hover:to-[#007A67]/10 transition-all flex items-center gap-3 group"
              >
                <svg className="w-5 h-5 text-[#54A18A] group-hover:text-[#007A67] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-slate-700 group-hover:text-[#54A18A]">History</span>
              </button>
              
              <div className="border-t border-slate-100 my-4"></div>
              
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#54A18A]/10 hover:to-[#007A67]/10 transition-all flex items-center gap-3 group"
              >
                <svg className="w-5 h-5 text-[#54A18A] group-hover:text-[#007A67] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-slate-700 group-hover:text-[#54A18A]">Settings</span>
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {view === 'DASHBOARD' && (
          <Dashboard properties={MOCK_PROPERTIES} onStartInspection={startInspection} />
        )}
        
        {view === 'INSPECTION_WIZARD' && selectedProperty && (
          <InspectionWizard 
            property={selectedProperty} 
            onCancel={resetToDashboard} 
            onAnalyze={onAnalysisComplete} 
          />
        )}

        {view === 'ANALYSIS' && inspectionResult && roomImages && (
          <AnalysisView 
            result={inspectionResult} 
            roomImages={roomImages} 
            onFinalize={finalizeInspection}
            onBack={() => setView('INSPECTION_WIZARD')}
          />
        )}

        {view === 'REPORT' && inspectionResult && selectedProperty && (
          <ReportView 
            result={inspectionResult} 
            property={selectedProperty}
            onClose={resetToDashboard}
          />
        )}

        {view === 'ANALYTICS' && (
          <Analytics onBack={resetToDashboard} />
        )}
      </main>

      {/* Persistent Bottom Navigation */}
      {(view === 'DASHBOARD' || view === 'ANALYTICS') && (
        <div className="fixed bottom-0 max-w-lg w-full bg-white/95 backdrop-blur-sm border-t border-slate-100 p-4 flex justify-around shadow-lg relative overflow-hidden">
          <button 
            onClick={() => setView('DASHBOARD')}
            className={`flex flex-col items-center transition-all relative z-10 ${view === 'DASHBOARD' ? 'text-[#54A18A]' : 'text-slate-400 hover:text-[#54A18A]'}`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            <span className="text-xs mt-1 font-medium">Properties 🏠</span>
          </button>
          <button 
            onClick={() => setView('ANALYTICS')}
            className={`flex flex-col items-center transition-all relative z-10 ${view === 'ANALYTICS' ? 'text-[#007A67]' : 'text-slate-400 hover:text-[#007A67]'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span className="text-xs mt-1 font-medium">Analytics 📊</span>
          </button>
          <button className="flex flex-col items-center text-slate-400 hover:text-[#6B46C1] transition-all relative z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-xs mt-1 font-medium">History 📜</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
