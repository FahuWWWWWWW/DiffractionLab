import React from 'react';
import { calculateFresnelNumber, wavelengthToColor } from '../utils/physics';
import { DiffractionParams, Regime } from '../types';

interface AnalysisPanelProps {
  params: DiffractionParams;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ params }) => {
  const F = calculateFresnelNumber(params.wavelength, params.slitWidth, params.distance);

  let regime = Regime.TRANSITION;
  let explanation = "";
  let colorClass = "text-yellow-400";

  if (F < 0.1) {
    regime = Regime.FRAUNHOFER;
    explanation = "屏幕距离狭缝很远（或狭缝很窄）。光线实际上是平行的。简单的 Sinc 函数近似非常准确。";
    colorClass = "text-green-400";
  } else if (F > 10) {
    regime = Regime.FRESNEL; // Deep Fresnel
    explanation = "屏幕距离狭缝非常近。狭缝的“几何阴影”清晰可见，但在边缘处有复杂的衍射条纹。此时夫琅禾费近似完全失效。";
    colorClass = "text-red-400";
  } else {
    regime = Regime.FRESNEL; // Near Fresnel / Transition
    explanation = "我们处于近场（菲涅尔衍射区）。衍射图样非常复杂，且随距离变化迅速。中央主极大中间甚至可能出现凹陷！";
    colorClass = "text-cyan-400";
  }

  const laserColor = wavelengthToColor(params.wavelength);

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: laserColor, boxShadow: `0 0 8px ${laserColor}` }}></span>
        物理分析
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">菲涅尔数 (F)</span>
            <span className="text-2xl font-mono font-bold text-white">{F.toFixed(3)}</span>
            <span className="block text-xs text-slate-500 mt-1">F = a² / zλ</span>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">当前区域</span>
            <span className={`text-lg font-bold ${colorClass}`}>{regime.split('(')[0]}</span>
            <span className="block text-xs text-slate-500 mt-1">{regime.includes('(') ? regime.split('(')[1].replace(')', '') : ''}</span>
        </div>
      </div>

      <div className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex-grow">
        <p className="mb-2"><strong className="text-white">观察：</strong> {explanation}</p>
        <p className="mt-4 text-xs text-slate-400 italic">
          尝试拖动 <strong>屏幕距离</strong> 滑块。
          随着 z 增加（F 减小），复杂的菲涅尔波纹会逐渐演变成经典的夫琅禾费中央主峰。
        </p>
      </div>
    </div>
  );
};