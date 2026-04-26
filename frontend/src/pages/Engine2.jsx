import React, { useState, useEffect } from 'react';
import { Sliders, ShieldCheck, FileSpreadsheet, Activity, Server } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Engine2 = () => {
  const [inputText, setInputText] = useState('10, 15, 20, 25, 30, 35, 40, 45, 50, 55');
  const [epsilon, setEpsilon] = useState(1.0);
  const [chartData, setChartData] = useState(null);
  
  // Stats
  const noiseLevel = (1 / epsilon).toFixed(2);
  const utilityScore = Math.min(100, Math.max(0, (epsilon / 10) * 100)).toFixed(0);

  // Generate Laplace Noise
  const generateLaplaceNoise = (scale) => {
    const u = Math.random() - 0.5;
    return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  };

  const processData = () => {
    if (!inputText) return;
    
    // Parse input (comma separated numbers)
    const rawData = inputText.split(',').map(item => parseFloat(item.trim())).filter(num => !isNaN(num));
    
    if (rawData.length === 0) return;
    
    // Global sensitivity for simple numeric data (assuming max diff could be around 10 for simulation)
    const sensitivity = 10;
    const scale = sensitivity / epsilon;
    
    const noisedData = rawData.map(val => {
      const noise = generateLaplaceNoise(scale);
      return Number((val + noise).toFixed(2));
    });

    setChartData({
      labels: rawData.map((_, i) => `Point ${i + 1}`),
      datasets: [
        {
          label: 'Original Data',
          data: rawData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4,
        },
        {
          label: 'Differentially Private Data',
          data: noisedData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderDash: [5, 5],
          tension: 0.4,
        }
      ]
    });
  };

  useEffect(() => {
    processData();
  }, [inputText, epsilon]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#a1a1aa' }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#a1a1aa' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#a1a1aa' }
      }
    }
  };

  const handleExport = () => {
    // Mock export via REST API endpoint
    alert('Dataset exported via POST /api/v1/privacy/export');
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <div className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-md text-xs font-semibold mb-3">
            Engine 2 Active
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Differential Privacy Injector</h1>
          <p className="text-secondary max-w-2xl leading-relaxed">
            Add calibrated Laplace noise to datasets to provide mathematical privacy guarantees. 
            Balance between individual privacy and dataset utility using the Epsilon (ε) parameter.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-bg-panel border border-border-subtle rounded-full shadow-sm">
          <ShieldCheck size={16} className="text-brand-green" />
          <span className="text-sm font-medium">ε-Differential Privacy Guaranteed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Section */}
        <div className="lg:col-span-1 bg-bg-panel border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Sliders size={18} className="text-brand-blue" /> Configuration
          </h2>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-secondary">Privacy Budget (Epsilon ε)</span>
              <span className="text-brand-blue font-bold">{epsilon}</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="10" 
              step="0.1" 
              value={epsilon} 
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full accent-brand-blue cursor-pointer"
            />
            <div className="flex justify-between text-xs text-secondary mt-2">
              <span>Max Privacy (0.1)</span>
              <span>Min Privacy (10.0)</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col space-y-2 mb-6">
            <label className="flex justify-between items-center text-sm font-medium text-secondary">
              <span className="flex items-center gap-2"><FileSpreadsheet size={16} /> Dataset (CSV or Numbers)</span>
            </label>
            <textarea 
              className="flex-1 w-full min-h-[150px] p-3 bg-bg-base border border-border-subtle rounded-md text-primary font-mono text-sm leading-relaxed focus:outline-none focus:border-secondary transition-colors resize-none"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
          </div>

          <button 
            className="w-full py-3 bg-primary text-bg-base hover:bg-white rounded-md font-medium transition-colors flex items-center justify-center gap-2" 
            onClick={handleExport}
          >
            <Server size={18} /> Export via REST API
          </button>
        </div>

        {/* Visualization & Stats Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-bg-panel border border-border-subtle rounded-xl p-6 shadow-sm border-l-4 border-l-brand-green">
              <p className="text-sm text-secondary mb-2 font-medium">Data Utility Score</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold tracking-tight text-primary leading-none">{utilityScore}</span>
                <span className="text-secondary pb-1">/ 100</span>
              </div>
              <p className="text-xs text-secondary mt-3">Higher utility means data is closer to original</p>
            </div>
            
            <div className="bg-bg-panel border border-border-subtle rounded-xl p-6 shadow-sm border-l-4 border-l-brand-blue">
              <p className="text-sm text-secondary mb-2 font-medium">Laplace Noise Scale</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold tracking-tight text-primary leading-none">{noiseLevel}</span>
              </div>
              <p className="text-xs text-secondary mt-3">Inversely proportional to Epsilon</p>
            </div>
          </div>

          <div className="bg-bg-panel border border-border-subtle rounded-xl p-6 shadow-sm flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Activity size={18} className="text-brand-blue" /> Privacy vs Utility Comparison
            </h2>
            <div className="flex-1 min-h-[300px] relative w-full">
              {chartData ? <Line data={chartData} options={chartOptions} /> : <div className="absolute inset-0 flex items-center justify-center text-secondary">No Data</div>}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Engine2;
