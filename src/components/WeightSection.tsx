import React, { useState } from 'react';
import { WeightRecord } from '../types';
import { Weight, PlusCircle, Trash2, Calendar, LineChart as ChartIcon, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface WeightSectionProps {
  weightHistory: WeightRecord[];
  onUpdateWeight: (updated: WeightRecord[]) => void;
}

export default function WeightSection({ weightHistory, onUpdateWeight }: WeightSectionProps) {
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState('');

  const getNumericWeight = (w: number | string): number => {
    if (typeof w === 'number') return w;
    const match = w.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 6.0;
  };

  const getDisplayWeight = (w: number | string): string => {
    const s = String(w);
    return s.includes('kg') ? s : `${s} kg`;
  };

  // Stats calculation
  const latestWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : 0;

  const initialWeight = weightHistory.length > 0 
    ? weightHistory[0].weight 
    : 0;

  const totalGrowth = getNumericWeight(latestWeight) > getNumericWeight(initialWeight) 
    ? parseFloat((getNumericWeight(latestWeight) - getNumericWeight(initialWeight)).toFixed(2)) 
    : 0;

  const averageWeight = weightHistory.length > 0 
    ? parseFloat((weightHistory.reduce((sum, r) => sum + getNumericWeight(r.weight), 0) / weightHistory.length).toFixed(2))
    : 0;

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedWeight = parseFloat(newWeight);
    if (isNaN(parsedWeight) || parsedWeight <= 0 || parsedWeight > 30) {
      setErrorMsg('Please input a valid weight between 0.1kg and 30kg.');
      return;
    }

    if (!newDate) {
      setErrorMsg('Please select a valid date.');
      return;
    }

    // Check if date already exists to prompt replacement or just append
    const existingIndex = weightHistory.findIndex(entry => entry.date === newDate);
    let updatedHistory = [...weightHistory];

    if (existingIndex > -1) {
      if (window.confirm(`A weight entry for ${newDate} already exists. Would you like to update it?`)) {
        updatedHistory[existingIndex] = {
          ...updatedHistory[existingIndex],
          weight: parsedWeight
        };
      } else {
        return;
      }
    } else {
      const entry: WeightRecord = {
        id: `w-${Date.now()}`,
        date: newDate,
        weight: parsedWeight
      };
      updatedHistory.push(entry);
    }

    // Sort by date chronologically
    updatedHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    onUpdateWeight(updatedHistory);
    
    // Reset form inputs
    setNewWeight('');
    setNewDate(new Date().toISOString().split('T')[0]);
  };

  const handleDeleteWeight = (id: string) => {
    if (weightHistory.length <= 1) {
      alert("At least one baseline weight log record is required.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this weight log?")) {
      const updated = weightHistory.filter(w => w.id !== id);
      onUpdateWeight(updated);
    }
  };

  // Prepare data for the Chart
  const chartData = weightHistory.map(entry => ({
    name: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: getNumericWeight(entry.weight),
    displayWeight: getDisplayWeight(entry.weight),
    rawDate: entry.date
  }));

  // Render a custom Tooltip for beautiful cozy aesthetics
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-warm-beige p-3 rounded-xl cozy-shadow text-xs space-y-1">
          <p className="font-mono text-sage">{payload[0].payload.rawDate}</p>
          <p className="font-semibold text-warm-charcoal flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Weight: <span className="text-accent font-bold">{payload[0].payload.displayWeight}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="weight-section" className="space-y-12 animate-fade-in">
      
      {/* SECTION HEADER */}
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-warm-charcoal font-semibold mb-2">
          interactive weight tracker
        </h2>
        <p className="text-sage font-mono text-xs uppercase tracking-widest">
          feline growth charts, body mass trends & veterinary records
        </p>
        <div className="mt-3 w-16 h-1 bg-accent/25 rounded-full mx-auto" />
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Latest weight */}
        <div className="bg-white/70 border border-warm-beige rounded-[24px] p-6 cozy-shadow flex justify-between items-center relative overflow-hidden group hover:border-accent/30 transition-transform hover:scale-101">
          <div className="space-y-1.5">
            <span className="block text-[10px] font-mono tracking-widest text-sage uppercase">Latest Weight</span>
            <span id="weight-latest" className="block font-serif text-3xl font-extrabold text-warm-mocha">{getDisplayWeight(latestWeight)}</span>
            <span className="block text-[11px] text-warm-mocha/60">Healthy core companion weight</span>
          </div>
          <div className="bg-accent-light p-4 rounded-[20px] text-accent">
            <Weight className="w-6 h-6" />
          </div>
        </div>

        {/* Total change */}
        <div className="bg-white/70 border border-warm-beige rounded-[24px] p-6 cozy-shadow flex justify-between items-center relative overflow-hidden group hover:border-accent/30 transition-transform hover:scale-101">
          <div className="space-y-1.5">
            <span className="block text-[10px] font-mono tracking-widest text-sage uppercase font-medium">Growth Journey</span>
            <span id="weight-growth" className="block font-serif text-3xl font-extrabold text-accent">+{totalGrowth} kg</span>
            <span className="block text-[11px] text-warm-mocha/60">Since {weightHistory.length > 0 ? weightHistory[0].date : 'baseline'}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-[20px]">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Vet Target Guidance */}
        <div className="bg-white/70 border border-warm-beige rounded-[24px] p-6 cozy-shadow flex justify-between items-center relative overflow-hidden group hover:border-accent/30 transition-transform hover:scale-101">
          <div className="space-y-1.5">
            <span className="block text-[10px] font-mono tracking-widest text-sage uppercase font-medium">Target Threshold</span>
            <span className="block font-serif text-2xl font-bold text-sage">4.2 - 4.8 kg</span>
            <span className="block text-[11px] text-warm-mocha/60">Veterinarian benchmark for orange males</span>
          </div>
          <div className="bg-[#F2F5F1] p-4 rounded-[20px] text-sage">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* CHART & LOG SPLIT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* GROWTH CHART (Desktop Span 7) */}
        <div className="lg:col-span-7 bg-white/80 border border-warm-beige rounded-[28px] p-6 md:p-8 cozy-shadow space-y-6">
          <div className="flex justify-between items-center border-b border-warm-beige pb-4">
            <span className="text-xs font-mono tracking-widest text-sage uppercase flex items-center gap-1.5 font-bold">
              <ChartIcon className="w-4 h-4 text-accent" /> growth timeline chart
            </span>
            <span className="text-[10px] font-mono bg-cream border border-warm-beige/80 py-1 px-3 rounded-full text-warm-mocha">
              Average Body Mass: {averageWeight} kg
            </span>
          </div>

          <div className="h-[320px] w-full" id="growth-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E67E22" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#E67E22" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5ECD7" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#4E3629" 
                  fontSize={10}
                  fontFamily="JetBrains Mono, monospace"
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#4E3629" 
                  fontSize={10}
                  fontFamily="JetBrains Mono, monospace"
                  tickLine={false}
                  domain={['dataMin - 0.4', 'dataMax + 0.4']}
                  dx={-5}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#E67E22" 
                  strokeWidth={3} 
                  activeDot={{ r: 6, fill: '#E67E22', stroke: '#FFF', strokeWidth: 2 }}
                  dot={{ r: 4, fill: '#FFF', stroke: '#E67E22', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-warm-mocha/60 text-center font-sans font-light mt-2">
            *This graph displays body mass growth chronologically. Hover over data nodes to examine specific dates.
          </p>
        </div>

        {/* LOG FORM & TABLE (Desktop Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Add Entry Form Card */}
          <div className="bg-white/80 border border-warm-beige rounded-[28px] p-6 cozy-shadow space-y-4">
            <span className="text-xs font-mono tracking-widest text-sage uppercase flex items-center gap-1.5 font-bold">
              <PlusCircle className="w-4 h-4 text-accent" /> log weight entry
            </span>

            <form onSubmit={handleAddWeight} id="weight-form" className="space-y-4 pt-1">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-mono">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-warm-mocha/70 tracking-wider uppercase mb-1.5">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="30"
                    placeholder="e.g. 4.6"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full bg-cream/40 border border-warm-beige rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-warm-mocha transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-warm-mocha/70 tracking-wider uppercase mb-1.5 font-medium">Log Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-cream/40 border border-warm-beige rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-warm-mocha"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                id="weight-submit-btn"
                className="w-full bg-accent hover:bg-accent/90 text-white font-mono uppercase font-bold tracking-wider py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                Save Weight Entry
              </button>
            </form>
          </div>

          {/* Historical Log Entries Table */}
          <div className="bg-white/80 border border-warm-beige rounded-[28px] p-6 cozy-shadow space-y-4 max-h-[300px] overflow-y-auto">
            <span className="text-xs font-mono tracking-widest text-sage uppercase block pb-2 border-b border-warm-beige/60">
              body mass ledger log ({weightHistory.length})
            </span>

            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-warm-beige/60" id="weight-table">
                    <thead>
                      <tr>
                        <th scope="col" className="py-2.5 pl-4 pr-3 text-left text-xs font-mono tracking-wider font-semibold text-sage uppercase sm:pl-0">
                          Date Done
                        </th>
                        <th scope="col" className="px-3 py-2.5 text-right text-xs font-mono tracking-wider font-semibold text-sage uppercase">
                          Weight Value
                        </th>
                        <th scope="col" className="relative py-2.5 pl-3 pr-4 sm:pr-0">
                          <span className="sr-only">Delete</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-warm-beige/30">
                      {weightHistory.slice().reverse().map((entry) => (
                        <tr key={entry.id} className="hover:bg-cream/20 transition-colors group">
                          <td className="whitespace-nowrap py-2.5 pl-4 pr-3 text-xs font-mono text-warm-mocha/80 sm:pl-0 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-sage" /> {entry.date}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-right text-sm font-semibold text-warm-mocha font-sans">
                            {getDisplayWeight(entry.weight)}
                          </td>
                          <td className="relative whitespace-nowrap py-2.5 pl-3 pr-4 text-right text-xs font-medium sm:pr-0">
                            <button
                              onClick={() => handleDeleteWeight(entry.id)}
                              className="text-warm-mocha/45 hover:text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                              title="Delete log record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
