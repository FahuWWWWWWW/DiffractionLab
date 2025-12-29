import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { calculateIntensity, wavelengthToColor } from '../utils/physics';
import { DiffractionParams } from '../types';

interface VisualizationProps {
  params: DiffractionParams;
}

export const Visualization: React.FC<VisualizationProps> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<any[]>([]);

  // Memoize heavy calculations
  const { plotData, maxIntensity } = useMemo(() => {
    const points = 200; // Resolution
    const rangeMm = 20; // Screen width in mm to simulate (-10mm to +10mm)
    const step = rangeMm / points;
    
    const newData = [];
    let maxI = 0;

    for (let i = 0; i <= points; i++) {
      const x = -rangeMm / 2 + i * step;
      const intensities = calculateIntensity(x, params.wavelength, params.slitWidth, params.distance);
      
      // Track max for normalization
      if (intensities.fresnel > maxI) maxI = intensities.fresnel;
      
      newData.push({
        x: Number(x.toFixed(2)),
        Fresnel: intensities.fresnel,
        Fraunhofer: intensities.fraunhofer
      });
    }

    // Normalize Fresnel to match typical Fraunhofer scaling for comparison, 
    // or keep raw relative to show energy conservation. 
    // For educational visualization, normalizing peak to 1 helps seeing the SHAPE difference.
    // However, showing them on different scales can be confusing. 
    // Let's Normalize Fresnel against ITSELF to fill the graph, and Fraunhofer is naturally 0-1.
    
    const normalizedData = newData.map(d => ({
        ...d,
        Fresnel: maxI > 0 ? d.Fresnel / maxI : 0,
        // Fraunhofer is already normalized to I0=1 at center
    }));

    return { plotData: normalizedData, maxIntensity: maxI };
  }, [params]);

  useEffect(() => {
    setData(plotData);
  }, [plotData]);

  // Draw the 2D Pattern on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Get color
    const baseColor = wavelengthToColor(params.wavelength);
    
    // Draw vertical lines based on Fresnel intensity
    // We map the data x-range to canvas width
    const dataLen = plotData.length;
    
    for (let i = 0; i < width; i++) {
        // Map pixel i to data index
        const dataIndex = Math.floor((i / width) * dataLen);
        const point = plotData[dataIndex];
        
        if (point) {
            const intensity = point.Fresnel;
            // Draw a vertical line with opacity = intensity
            // Parse base color to apply opacity
            ctx.fillStyle = baseColor.replace(/[\d.]+\)$/, `${intensity})`); 
            ctx.fillRect(i, 0, 1, height);
        }
    }
    
    // Add a center marker
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

  }, [plotData, params.wavelength]);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* 2D Pattern Visualization */}
      <div className="bg-black rounded-xl overflow-hidden border border-slate-700 shadow-inner relative group">
        <canvas 
            ref={canvasRef} 
            width={800} 
            height={100} 
            className="w-full h-32 object-cover block"
        />
        <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-slate-300 pointer-events-none">
            模拟屏幕视图 (菲涅尔)
        </div>
        <div className="absolute bottom-1 right-2 text-xs text-slate-500 font-mono">
           -10mm &larr; 位置 &rarr; +10mm
        </div>
      </div>

      {/* Intensity Graph */}
      <div className="flex-grow bg-slate-900 rounded-xl border border-slate-700 p-4 min-h-[300px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-200 font-semibold">光强分布 I(x)</h3>
            <div className="text-xs text-slate-400">
                归一化光强 vs. 位置 (mm)
            </div>
        </div>
        
        <div className="flex-grow w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                    dataKey="x" 
                    stroke="#94a3b8" 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    label={{ value: '位置 (mm)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} 
                />
                <YAxis 
                    stroke="#94a3b8" 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    domain={[0, 1.1]}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ fontSize: 12 }}
                    labelStyle={{ color: '#cbd5e1', marginBottom: 5 }}
                    formatter={(value: number) => value.toFixed(3)}
                />
                <Legend verticalAlign="top" height={36}/>
                
                {/* Physics: Fresnel (General) */}
                <Line 
                    type="monotone" 
                    dataKey="Fresnel" 
                    stroke={wavelengthToColor(params.wavelength)} 
                    strokeWidth={3} 
                    dot={false}
                    name="物理模拟 (菲涅尔)"
                    animationDuration={300}
                />
                
                {/* Physics: Fraunhofer (Approximation) */}
                <Line 
                    type="monotone" 
                    dataKey="Fraunhofer" 
                    stroke="#ffffff" 
                    strokeDasharray="5 5" 
                    strokeWidth={1} 
                    dot={false}
                    name="理论近似 (夫琅禾费)"
                    opacity={0.5}
                    animationDuration={300}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};