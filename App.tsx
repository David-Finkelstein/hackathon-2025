
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
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-white shadow-xl relative">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2" onClick={resetToDashboard} style={{ cursor: 'pointer' }}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">G</div>
          <h1 className="text-xl font-bold tracking-tight">Guesty Guard</h1>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400 hover:text-white transition-colors">
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
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Menu</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-400 hover:text-slate-600"
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
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="font-medium text-slate-700">Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  setView('ANALYTICS');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium text-slate-700">Analytics</span>
              </button>
              
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-slate-700">History</span>
              </button>
              
              <div className="border-t border-slate-200 my-4"></div>
              
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-slate-700">Settings</span>
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
        <div className="fixed bottom-0 max-w-lg w-full bg-white border-t border-slate-200 p-4 flex justify-around">
          <button 
            onClick={() => setView('DASHBOARD')}
            className={`flex flex-col items-center ${view === 'DASHBOARD' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            <span className="text-xs mt-1">Properties</span>
          </button>
          <button 
            onClick={() => setView('ANALYTICS')}
            className={`flex flex-col items-center ${view === 'ANALYTICS' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span className="text-xs mt-1">Analytics</span>
          </button>
          <button className="flex flex-col items-center text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-xs mt-1">History</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
