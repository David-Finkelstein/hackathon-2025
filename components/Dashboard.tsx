
import React from 'react';
import { Property } from '../types';

interface DashboardProps {
  properties: Property[];
  onStartInspection: (property: Property) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ properties, onStartInspection }) => {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 p-4 rounded-xl relative overflow-hidden">
        <div className="absolute top-2 right-2 text-2xl opacity-30">🎄</div>
        <div className="absolute bottom-2 left-2 text-xl opacity-30">⛄</div>
        <h2 className="text-slate-800 font-semibold mb-1 relative z-10">Good morning, Maria! 👋🎅</h2>
        <p className="text-slate-500 text-sm relative z-10">You have 2 inspections pending for today. 🎁</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-lg">Today's Checkouts 🏠</h3>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">2 Scheduled ❄️</span>
        </div>

        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-32">
                <img src={property.thumbnail} alt={property.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                  PENDING INSPECTION
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800 truncate">{property.name}</h4>
                <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {property.address}
                </div>
                
                {property.pendingCheckout && (
                  <div className="bg-slate-50 p-3 rounded-lg mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Guest</p>
                      <p className="text-sm font-semibold text-slate-700">{property.pendingCheckout.guestName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Checkout</p>
                      <p className="text-sm font-semibold text-slate-700">{property.pendingCheckout.checkoutTime}</p>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => onStartInspection(property)}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
                >
                  Start Inspection →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Weekly Inspections</p>
          <p className="text-2xl font-bold text-slate-800">5</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <p className="text-green-600/60 text-xs font-bold uppercase mb-1">Recovered</p>
          <p className="text-2xl font-bold text-green-700">$340</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
