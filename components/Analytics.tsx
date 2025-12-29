
import React, { useState } from 'react';

interface AnalyticsProps {
  onBack: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onBack }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Mock analytics data
  const stats = {
    totalInspections: 142,
    damagesFound: 23,
    totalRecovered: 4250,
    avgResponseTime: '12 min',
    weeklyChange: {
      inspections: +12,
      damages: -8,
      recovered: +23,
      responseTime: -15
    }
  };

  const weeklyData = [
    { day: 'Mon', inspections: 18, damages: 3, recovered: 340 },
    { day: 'Tue', inspections: 22, damages: 5, recovered: 680 },
    { day: 'Wed', inspections: 15, damages: 2, recovered: 220 },
    { day: 'Thu', inspections: 25, damages: 4, recovered: 890 },
    { day: 'Fri', inspections: 28, damages: 6, recovered: 1120 },
    { day: 'Sat', inspections: 20, damages: 2, recovered: 450 },
    { day: 'Sun', inspections: 14, damages: 1, recovered: 180 }
  ];

  const topProperties = [
    { name: 'Sunset Beach Apt', inspections: 12, damages: 2, recovered: 450 },
    { name: 'Mountain View Condo', inspections: 10, damages: 4, recovered: 890 },
    { name: 'Downtown Loft', inspections: 9, damages: 1, recovered: 120 },
    { name: 'Lakeside Villa', inspections: 8, damages: 3, recovered: 680 }
  ];

  const damageTypes = [
    { type: 'Wall Damage', count: 8, percentage: 35 },
    { type: 'Missing Items', count: 6, percentage: 26 },
    { type: 'Furniture Damage', count: 5, percentage: 22 },
    { type: 'Cleanliness Issues', count: 4, percentage: 17 }
  ];

  const maxInspections = Math.max(...weeklyData.map(d => d.inspections));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 relative overflow-hidden">
        <div className="absolute top-2 left-4 text-2xl opacity-20">🎄</div>
        <div className="absolute top-2 right-4 text-2xl opacity-20">⛄</div>
        <div className="p-4 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={onBack} 
              className="text-slate-400 flex items-center gap-1 font-semibold text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl font-bold text-slate-800">📊 Analytics 🎁</h1>
            <div className="w-10"></div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Key Metrics */}
        <section>
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-2">
            Key Metrics ❄️
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-500 font-bold uppercase">Inspections</p>
                <span className={`text-xs font-bold ${stats.weeklyChange.inspections > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.weeklyChange.inspections > 0 ? '↑' : '↓'} {Math.abs(stats.weeklyChange.inspections)}%
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.totalInspections}</p>
              <p className="text-xs text-slate-400 mt-1">This {timeRange}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-500 font-bold uppercase">Damages</p>
                <span className={`text-xs font-bold ${stats.weeklyChange.damages < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.weeklyChange.damages > 0 ? '↑' : '↓'} {Math.abs(stats.weeklyChange.damages)}%
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.damagesFound}</p>
              <p className="text-xs text-slate-400 mt-1">Issues found</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-green-700 font-bold uppercase">Recovered</p>
                <span className="text-xs font-bold text-green-700">
                  ↑ {stats.weeklyChange.recovered}%
                </span>
              </div>
              <p className="text-3xl font-bold text-green-800">${stats.totalRecovered}</p>
              <p className="text-xs text-green-600 mt-1">Total damages billed</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-500 font-bold uppercase">Avg Time</p>
                <span className="text-xs font-bold text-green-600">
                  ↓ {Math.abs(stats.weeklyChange.responseTime)}%
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.avgResponseTime}</p>
              <p className="text-xs text-slate-400 mt-1">Per inspection</p>
            </div>
          </div>
        </section>

        {/* Weekly Inspections Chart */}
        <section>
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3">
            Weekly Activity
          </h2>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-end justify-between h-40 gap-2">
              {weeklyData.map((data) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end h-32">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg relative group cursor-pointer transition-all hover:from-blue-700 hover:to-blue-500"
                      style={{ height: `${(data.inspections / maxInspections) * 100}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-slate-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                          <p className="font-bold">{data.inspections} inspections</p>
                          <p className="text-slate-300">{data.damages} damages</p>
                          <p className="text-green-400">${data.recovered}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{data.day}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Damage Types Breakdown */}
        <section>
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3">
            Damage Types
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {damageTypes.map((damage, index) => (
              <div
                key={damage.type}
                className={`p-4 ${index !== damageTypes.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">{damage.type}</span>
                  <span className="text-sm font-bold text-slate-900">{damage.count}</span>
                </div>
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                    style={{ width: `${damage.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-slate-400">{damage.percentage}% of total</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Properties */}
        <section>
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3">
            Property Performance
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {topProperties.map((property, index) => (
              <div key={property.name} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{property.name}</h3>
                      <p className="text-xs text-slate-400">{property.inspections} inspections</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">${property.recovered}</p>
                    <p className="text-xs text-slate-400">{property.damages} damages</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-blue-600 font-bold">{property.inspections}</p>
                    <p className="text-[10px] text-blue-400 uppercase">Checks</p>
                  </div>
                  <div className="bg-red-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-red-600 font-bold">{property.damages}</p>
                    <p className="text-[10px] text-red-400 uppercase">Issues</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-green-600 font-bold">${property.recovered}</p>
                    <p className="text-[10px] text-green-400 uppercase">Billed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Insights */}
        <section>
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3">
            Insights
          </h2>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Inspection Volume Up</h3>
                  <p className="text-sm text-slate-600">
                    You've completed 12% more inspections this {timeRange} compared to last period.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Recovery Rate Strong</h3>
                  <p className="text-sm text-slate-600">
                    Average recovery per damage is $185, up 23% from last {timeRange}.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Response Time Improved</h3>
                  <p className="text-sm text-slate-600">
                    Your average inspection time is now 12 minutes, down 15% from last period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;

