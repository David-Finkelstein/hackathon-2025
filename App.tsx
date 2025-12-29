
import React, { useState } from 'react';
import { AppView, Property, Finding, InspectionResult } from './types';
import Dashboard from './components/Dashboard';
import InspectionWizard from './components/InspectionWizard';
import AnalysisView from './components/AnalysisView';
import ReportView from './components/ReportView';

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
  const [inspectionResult, setInspectionResult] = useState<InspectionResult | null>(null);
  const [images, setImages] = useState<{ baseline: string; current: string } | null>(null);

  const startInspection = (property: Property) => {
    setSelectedProperty(property);
    setView('INSPECTION_WIZARD');
  };

  const onAnalysisComplete = (result: InspectionResult, baseline: string, current: string) => {
    setInspectionResult(result);
    setImages({ baseline, current });
    setView('ANALYSIS');
  };

  const finalizeInspection = () => {
    setView('REPORT');
  };

  const resetToDashboard = () => {
    setView('DASHBOARD');
    setSelectedProperty(null);
    setInspectionResult(null);
    setImages(null);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-white shadow-xl relative">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2" onClick={resetToDashboard} style={{ cursor: 'pointer' }}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">G</div>
          <h1 className="text-xl font-bold tracking-tight">Guesty Guard</h1>
        </div>
        <button className="text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </header>

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

        {view === 'ANALYSIS' && inspectionResult && images && (
          <AnalysisView 
            result={inspectionResult} 
            images={images} 
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
      </main>

      {/* Persistent Call to Action Area for Dashboard */}
      {view === 'DASHBOARD' && (
        <div className="fixed bottom-0 max-w-lg w-full bg-white border-t border-slate-200 p-4 flex justify-around">
          <button className="flex flex-col items-center text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            <span className="text-xs mt-1">Properties</span>
          </button>
          <button className="flex flex-col items-center text-slate-400">
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
