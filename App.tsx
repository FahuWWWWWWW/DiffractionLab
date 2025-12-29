import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { Visualization } from './components/Visualization';
import { AnalysisPanel } from './components/AnalysisPanel';
import { DiffractionParams } from './types';

const App: React.FC = () => {
  const [params, setParams] = useState<DiffractionParams>({
    wavelength: 550, // Green light
    slitWidth: 200, // 200 microns
    distance: 0.5, // 0.5 meters
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Diffraction<span className="text-cyan-400">Lab</span> 衍射实验
            </h1>
          </div>
          <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
            物理光学模拟器
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          
          {/* Left Column: Controls & Analysis (4/12) */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            <ControlPanel params={params} setParams={setParams} />
            <div className="flex-grow">
               <AnalysisPanel params={params} />
            </div>
          </div>

          {/* Right Column: Visualization (8/12) */}
          <div className="lg:col-span-8 flex flex-col h-full">
            <Visualization params={params} />
          </div>
        
        </div>
      </main>
      
      {/* Custom Scrollbar Styles for this component specifically */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b; 
        }
      `}</style>
    </div>
  );
};

export default App;