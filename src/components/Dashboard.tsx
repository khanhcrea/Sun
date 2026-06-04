import React, { useState } from 'react';
import { CatProfile, WeightRecord, DailyLogState } from '../types';
import { Heart, Sparkles, Pencil, Check, X, ClipboardList, Weight, Droplets, Camera } from 'lucide-react';

interface DashboardProps {
  profile: CatProfile;
  weightHistory: WeightRecord[];
  dailyLogs: DailyLogState;
  onUpdateProfile: (updated: CatProfile) => void;
}

export default function Dashboard({ profile, weightHistory, dailyLogs, onUpdateProfile }: DashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<CatProfile>({ ...profile });

  const latestWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : 0;

  const getNumericWeight = (w: number | string): number => {
    if (typeof w === 'number') return w;
    const match = w.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 6.0;
  };

  const getDisplayWeight = (w: number | string): string => {
    const s = String(w);
    return s.includes('kg') ? s : `${s} kg`;
  };

  const completedTasks = dailyLogs.tasks.filter(t => t.completed).length;
  const totalTasks = dailyLogs.tasks.length;
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleSave = () => {
    onUpdateProfile(edited);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEdited({ ...profile });
    setIsEditing(false);
  };

  // Curated list of heartwarming cat quotes
  const felineQuotes = [
    "Time spent with cats is never wasted. — Colette",
    "In ancient times cats were worshipped as gods; they have not forgotten this. — Terry Pratchett",
    "Cats choose us; we don't own them. — Kristin Cast",
    "Like a graceful vase, a cat, even when motionless, seems to flow. — George F. Will"
  ];

  const todayQuote = felineQuotes[Math.floor(new Date().getDate() % felineQuotes.length)];

  return (
    <div id="home-dashboard" className="space-y-8 animate-fade-in">
      {/* Decorative Zen Header Banner */}
      <div className="relative bg-gradient-to-r from-warm-beige/60 to-cream border border-warm-beige/80 rounded-[24px] p-6 text-center md:text-left overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(#E67E22_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-accent font-semibold block mb-1">
              Konnichiwa, Companion
            </span>
            <h2 className="font-serif text-3xl text-warm-charcoal font-medium">
              Welcome to {profile.name}'s Cozy Corner
            </h2>
            <p className="text-xs text-warm-mocha/70 mt-1 italic font-light">
              "{todayQuote}"
            </p>
          </div>
          <div className="bg-white/80 border border-warm-beige/60 py-2.5 px-4 rounded-xl text-center cozy-shadow-lg backdrop-blur-sm min-w-[120px]">
            <span className="block text-[9px] font-mono tracking-wider text-sage uppercase">Feline Local Time</span>
            <span className="font-sans font-semibold text-warm-charcoal text-sm">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Big Photo Column + Biography Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Premium Custom Portrait Photo Frame (Desktop Span 5) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm">
            {/* Soft geometric styling frame */}
            <div className="absolute -inset-1.5 bg-accent/20 rounded-[32px] blur-xs" />
            <div className="relative bg-white border border-warm-beige p-3 rounded-[28px] cozy-shadow">
              <div className="aspect-square w-full h-full overflow-hidden rounded-[20px] relative bg-warm-beige-light flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img
                    id="dashboard-avatar-img"
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-warm-mocha/45 h-full w-full">
                    <Camera className="w-10 h-10 mb-2 text-sage opacity-70 stroke-1" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider block">No Avatar Link</span>
                    <span className="text-[10px] mt-1 text-warm-mocha/60 leading-relaxed max-w-[190px] block">
                      Click "Customize bio data" below to paste a custom picture URL
                    </span>
                  </div>
                )}
                
                {/* Float Status Ribbon */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-warm-beige/75 py-1 px-3 rounded-full text-[10px] font-mono tracking-wide text-warm-mocha flex items-center gap-1.5 shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Happy & Dreaming
                </div>
              </div>

              {/* Minimalist Caption plate */}
              <div className="mt-4 text-center border-t border-warm-beige/50 pt-3">
                <p className="font-serif text-xl italic text-warm-mocha font-semibold">
                  "{profile.name}"
                </p>
                <p className="text-[10px] font-mono text-sage tracking-wider uppercase mt-0.5">
                  The {profile.breed}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio details, Personality & Quick Indicators (Desktop Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/80 backdrop-blur-md rounded-[28px] border border-warm-beige p-8 cozy-shadow space-y-6">
            
            {/* Block 1: Identification Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-warm-beige/60 pb-5 gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-sage block mb-1">Name & Breed</span>
                <h3 className="font-serif text-3xl font-bold text-warm-charcoal">{profile.name}</h3>
                <span className="text-xs text-warm-mocha/80 font-mono mt-0.5 block">{profile.breed}</span>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-cream/80 border border-warm-beige/80 rounded-xl px-4 py-2 text-center">
                  <span className="block text-[9px] font-mono text-sage uppercase">Age</span>
                  <span id="dashboard-age-val" className="font-serif text-lg font-bold text-accent">{profile.age}</span>
                </div>
                <div className="bg-cream/80 border border-warm-beige/80 rounded-xl px-4 py-2 text-center">
                  <span className="block text-[9px] font-mono text-sage uppercase">Weight</span>
                  <span id="dashboard-weight-val" className="font-serif text-lg font-bold text-accent">{getDisplayWeight(latestWeight)}</span>
                </div>
              </div>
            </div>

            {/* Block 2: Endearing narrative */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-sage block mb-2">Our Feline's Biography</span>
              <p className="text-warm-mocha/90 text-sm leading-relaxed font-light font-sans">
                {profile.bio}
              </p>
            </div>

            {/* Block 3: Personality traits badges */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-sage block mb-3">Personality Coordinates</span>
              <div className="flex flex-wrap gap-2">
                {profile.personality.map((trait, i) => (
                  <span
                    key={i}
                    className="bg-accent-light/70 text-accent text-xs font-semibold px-3 py-1.5 rounded-full border border-accent/15 flex items-center gap-1 hover:bg-accent/10 transition-colors"
                  >
                    <Heart className="w-3 h-3 fill-accent/10" />
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Block 4: Customize Button toggle */}
            {!isEditing && (
              <div className="pt-3 border-t border-warm-beige/40 flex justify-end">
                <button
                  id="dashboard-edit-btn"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 bg-warm-beige-light hover:bg-warm-beige text-warm-mocha text-xs font-semibold font-mono tracking-wider uppercase px-4 py-2 rounded-xl border border-warm-beige transition-all"
                >
                  <Pencil className="w-3 h-3 text-accent" />
                  Customize bio data
                </button>
              </div>
            )}
          </div>

          {/* Quick Care Overview Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Completed logs stat */}
            <div className="bg-white/60 border border-warm-beige rounded-[20px] p-5 cozy-shadow flex items-center gap-4 hover:border-accent/35 transition-colors">
              <div className="bg-accent-light p-3 rounded-xl text-accent">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-mono text-sage uppercase tracking-wider">Today's Schedule</span>
                <span className="block text-sm font-bold text-warm-charcoal">{completedTasks}/{totalTasks} Complete</span>
                <div className="w-full bg-warm-beige h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-accent h-full transition-all duration-500" style={{ width: `${taskPercentage}%` }} />
                </div>
              </div>
            </div>

            {/* Hydration tracker overview */}
            <div className="bg-white/60 border border-warm-beige rounded-[20px] p-5 cozy-shadow flex items-center gap-4 hover:border-accent/35 transition-colors">
              <div className="bg-[#EBF5FB] p-3 rounded-xl text-[#3498DB]">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[9px] font-mono text-sage uppercase tracking-wider">Water Intake</span>
                <span className="block text-sm font-bold text-warm-charcoal">{dailyLogs.waterCount} of {dailyLogs.waterTarget} Bowls</span>
                <p className="text-[10px] text-warm-mocha/65 font-sans mt-0.5">Approx. {dailyLogs.waterCount * 100}ml drunk</p>
              </div>
            </div>

            {/* Weight growth indicator badge */}
            <div className="bg-white/60 border border-warm-beige rounded-[20px] p-5 cozy-shadow flex items-center gap-4 hover:border-accent/35 transition-colors">
              <div className="bg-[#F2F5F1] p-3 rounded-xl text-sage">
                <Weight className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[9px] font-mono text-sage uppercase tracking-wider">Weight Milestone</span>
                <span className="block text-sm font-bold text-warm-charcoal">{getDisplayWeight(latestWeight)} Tracker</span>
                <p className="text-[10px] text-warm-mocha/65 font-sans mt-0.5">
                  {weightHistory.length > 1 
                    ? `+${Math.max(0, parseFloat((getNumericWeight(latestWeight) - getNumericWeight(weightHistory[0].weight)).toFixed(2)))}kg cumulative growth`
                    : 'Initial baseline set'}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Profile Customize / Editing overlay form inline */}
      {isEditing && (
        <div className="bg-white border-2 border-accent/20 rounded-[28px] p-6 md:p-8 cozy-shadow-lg animate-fade-in space-y-6">
          <div className="flex justify-between items-center border-b border-warm-beige pb-4">
            <h3 className="font-serif text-2xl text-warm-mocha font-bold flex items-center gap-2">
              <Sparkles className="text-accent w-5 h-5" /> Customize Feline Profile
            </h3>
            <button onClick={handleCancel} className="text-warm-mocha/40 hover:text-accent cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-warm-mocha/70 tracking-wider uppercase mb-1.5">Cat Name</label>
              <input
                type="text"
                value={edited.name}
                onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                className="w-full bg-cream/50 border border-warm-beige rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-warm-mocha transition-colors"
                placeholder="Name"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-warm-mocha/70 tracking-wider uppercase mb-1.5">Breed / Lineage</label>
              <input
                type="text"
                value={edited.breed}
                onChange={(e) => setEdited({ ...edited, breed: e.target.value })}
                className="w-full bg-cream/50 border border-warm-beige rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-warm-mocha transition-colors"
                placeholder="e.g. Orange Tabby Shorthair"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-warm-mocha/70 tracking-wider uppercase mb-1.5">Age description</label>
              <input
                type="text"
                value={edited.age}
                onChange={(e) => setEdited({ ...edited, age: e.target.value })}
                className="w-full bg-cream/50 border border-warm-beige rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-warm-mocha transition-colors"
                placeholder="2 Years"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-warm-mocha/70 tracking-wider uppercase mb-1.5">Large Avatar Image URL</label>
              <input
                type="text"
                value={edited.avatarUrl}
                onChange={(e) => setEdited({ ...edited, avatarUrl: e.target.value })}
                className="w-full bg-cream/50 border border-warm-beige rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent text-warm-mocha transition-colors"
                placeholder="Enter custom absolute or relative image path"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-mono text-warm-mocha/70 tracking-wider uppercase mb-1.5">Story / Narrative Bio</label>
              <textarea
                rows={3}
                value={edited.bio}
                onChange={(e) => setEdited({ ...edited, bio: e.target.value })}
                className="w-full bg-cream/50 border border-warm-beige rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-warm-mocha transition-colors resize-none"
                placeholder="Write an enduring narrative bio..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-warm-beige pt-5">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 border border-warm-beige rounded-xl text-xs font-mono font-medium tracking-wide text-warm-mocha uppercase hover:bg-cream/50 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl text-xs font-mono font-semibold tracking-wider uppercase transition-all shadow-xs"
            >
              <Check className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
