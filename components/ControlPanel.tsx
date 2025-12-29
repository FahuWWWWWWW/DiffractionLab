import React from 'react';
import { DiffractionParams } from '../types';

interface ControlPanelProps {
  params: DiffractionParams;
  setParams: React.Dispatch<React.SetStateAction<DiffractionParams>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ params, setParams }) => {
  const handleChange = (key: keyof DiffractionParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 text-slate-100 flex flex-col gap-6 h-full">
      <h2 className="text-xl font-bold border-b border-slate-600 pb-2 mb-2">实验参数控制</h2>

      {/* Wavelength Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-300">波长 (λ)</label>
          <span className="text-sm font-mono bg-slate-900 px-2 py-1 rounded text-cyan-400">
            {params.wavelength} nm
          </span>
        </div>
        <input
          type="range"
          min="400"
          max="700"
          step="1"
          value={params.wavelength}
          onChange={(e) => handleChange('wavelength', Number(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="w-full h-2 rounded mt-1" style={{ 
            background: 'linear-gradient(to right, #5000aa, #0000ff, #00ff00, #ffff00, #ff7f00, #ff0000)' 
        }} />
      </div>

      {/* Slit Width Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-300">狭缝宽度 (a)</label>
          <span className="text-sm font-mono bg-slate-900 px-2 py-1 rounded text-emerald-400">
            {params.slitWidth} μm
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={params.slitWidth}
          onChange={(e) => handleChange('slitWidth', Number(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <p className="text-xs text-slate-400 mt-1">
          增加狭缝宽度会使通过的光量增加，但中央亮纹会变窄。
        </p>
      </div>

      {/* Distance Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-300">屏幕距离 (z)</label>
          <span className="text-sm font-mono bg-slate-900 px-2 py-1 rounded text-purple-400">
            {params.distance.toFixed(2)} m
          </span>
        </div>
        <input
          type="range"
          min="0.01"
          max="2.0"
          step="0.01"
          value={params.distance}
          onChange={(e) => handleChange('distance', Number(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
         <p className="text-xs text-slate-400 mt-1">
          距离越近（近场），菲涅尔衍射的特征（复杂的边缘条纹）越明显。
        </p>
      </div>
    </div>
  );
};