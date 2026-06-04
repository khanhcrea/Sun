import React, { useState } from 'react';
import { CatProfile, DailyLogState, DailyTask, MoodRecord } from '../types';
import { 
  Smile, Droplets, Plus, Check, Trash2, Heart, Star, Sparkles, BookOpen, 
  Moon, Compass, ShieldAlert, Award, Coffee, Eye, PlusCircle, CheckCircle, RefreshCw 
} from 'lucide-react';

interface BehaviorSectionProps {
  profile: CatProfile;
  dailyLogs: DailyLogState;
  moodHistory: MoodRecord[];
  onUpdateProfile: (updated: CatProfile) => void;
  onUpdateDailyLogs: (updated: DailyLogState) => void;
  onUpdateMoodHistory: (updated: MoodRecord[]) => void;
}

export default function BehaviorSection({
  profile,
  dailyLogs,
  moodHistory,
  onUpdateProfile,
  onUpdateDailyLogs,
  onUpdateMoodHistory
}: BehaviorSectionProps) {
  
  // Interactive mood logger state
  const [activeMood, setActiveMood] = useState<'peaceful' | 'playful' | 'sleepy' | 'curious' | 'grumpy' | 'hungry'>('peaceful');
  const [moodNote, setMoodNote] = useState('');
  const [isLoadingMood, setIsLoadingMood] = useState(false);

  // New task builder state
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'diet' | 'activity' | 'hygiene' | 'other'>('diet');
  const [newTaskTime, setNewTaskTime] = useState('08:00 AM');

  // Favorites editing
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [editedToy, setEditedToy] = useState(profile.favoriteToy);
  const [editedSpot, setEditedSpot] = useState(profile.favoriteSpot);

  // Mood configuration definitions
  const MOOD_TYPES = {
    peaceful: { label: 'Peaceful', icon: '🌸', color: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100/50' },
    playful: { label: 'Playful', icon: '🧶', color: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100/50' },
    sleepy: { label: 'Sleepy', icon: '💤', color: 'bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100/50' },
    curious: { label: 'Curious', icon: '👀', color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100/50' },
    grumpy: { label: 'Grumpy', icon: '😾', color: 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100/50' },
    hungry: { label: 'Hungry', icon: '🐟', color: 'bg-burnt-orange-light text-burnt-orange border-accent/20 hover:bg-accent/10' }
  };

  // Water counting operations
  const incrementWater = () => {
    onUpdateDailyLogs({
      ...dailyLogs,
      waterCount: Math.min(dailyLogs.waterTarget + 2, dailyLogs.waterCount + 1)
    });
  };

  const decrementWater = () => {
    onUpdateDailyLogs({
      ...dailyLogs,
      waterCount: Math.max(0, dailyLogs.waterCount - 1)
    });
  };

  // Task operations
  const toggleTask = (taskId: string) => {
    const updatedTasks = dailyLogs.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdateDailyLogs({
      ...dailyLogs,
      tasks: updatedTasks
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const task: DailyTask = {
      id: `t-${Date.now()}`,
      name: newTaskName.trim(),
      category: newTaskCategory,
      completed: false,
      time: newTaskTime
    };

    onUpdateDailyLogs({
      ...dailyLogs,
      tasks: [...dailyLogs.tasks, task]
    });

    setNewTaskName('');
    setNewTaskTime('08:00 AM');
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = dailyLogs.tasks.filter(t => t.id !== taskId);
    onUpdateDailyLogs({
      ...dailyLogs,
      tasks: updated
    });
  };

  const handleResetTasks = () => {
    if (window.confirm("Would you like to reset all of today's chores to incomplete status to start a fresh day?")) {
      const reset = dailyLogs.tasks.map(t => ({ ...t, completed: false }));
      onUpdateDailyLogs({
        ...dailyLogs,
        tasks: reset,
        waterCount: 0
      });
    }
  };

  // Mood submission
  const handleLogMood = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingMood(true);

    // Simulate mild satisfying Japanese tea ceremony delay
    setTimeout(() => {
      const record: MoodRecord = {
        id: `m-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        mood: activeMood,
        note: moodNote.trim() || undefined
      };

      onUpdateMoodHistory([record, ...moodHistory]);
      setMoodNote('');
      setIsLoadingMood(false);
    }, 450);
  };

  const handleDeleteMood = (id: string) => {
    if (window.confirm(`Delete this logged mood entry from ${profile.name}'s diary?`)) {
      const updated = moodHistory.filter(m => m.id !== id);
      onUpdateMoodHistory(updated);
    }
  };

  const handleSavePreferences = () => {
    onUpdateProfile({
      ...profile,
      favoriteToy: editedToy,
      favoriteSpot: editedSpot
    });
    setIsEditingPreferences(false);
  };

  const handleCancelPreferences = () => {
    setEditedToy(profile.favoriteToy);
    setEditedSpot(profile.favoriteSpot);
    setIsEditingPreferences(false);
  };

  return (
    <div id="behavior-section" className="space-y-12 animate-fade-in animate-delay-100">
      
      {/* SECTION HEADER */}
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-warm-charcoal font-semibold mb-2">
          behavior & cozy habits
        </h2>
        <p className="text-sage font-mono text-xs uppercase tracking-widest">
          mood coordinates, preference baskets & routine checklist trackers
        </p>
        <div className="mt-3 w-16 h-1 bg-accent/25 rounded-full mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT: MOOD TRACKER & PREFERENCES (Desktop Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Mood Logger Box */}
          <div className="bg-white/80 border border-warm-beige rounded-[28px] p-6 cozy-shadow space-y-5">
            <span className="text-xs font-mono tracking-widest text-sage uppercase flex items-center gap-1.5 font-bold">
              <Smile className="w-4 h-4 text-accent" /> feline mood tracker
            </span>

            <form onSubmit={handleLogMood} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(MOOD_TYPES) as Array<keyof typeof MOOD_TYPES>).map((key) => {
                  const item = MOOD_TYPES[key];
                  const isSelected = activeMood === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveMood(key)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-accent bg-accent/5 scale-102 ring-1 ring-accent' 
                          : 'border-warm-beige/60 bg-cream/20 hover:scale-101'
                      }`}
                    >
                      <span className="text-2xl mb-1">{item.icon}</span>
                      <span className="text-[10px] font-mono font-semibold tracking-wide text-warm-mocha">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-[9px] font-mono text-warm-mocha/60 uppercase tracking-widest mb-1.5">Mood context note (optional)</label>
                <input
                  type="text"
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="e.g. Purred wildly on the bamboo futon"
                  className="w-full bg-cream/40 border border-warm-beige rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-accent text-warm-mocha"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingMood}
                className="w-full bg-accent hover:bg-accent/90 text-white font-mono uppercase font-bold tracking-wider py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoadingMood ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Recording...
                  </>
                ) : (
                  <>
                    Register Mood Log
                  </>
                )}
              </button>
            </form>

            {/* Mood History Ledger */}
            <div className="border-t border-warm-beige/60 pt-4">
              <span className="text-[9px] font-mono tracking-widest text-sage uppercase block mb-3 font-semibold">Mood Diary History logs</span>
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {moodHistory.map((m) => {
                  const config = MOOD_TYPES[m.mood] || { label: m.mood, icon: '🐾', color: 'bg-cream text-warm-mocha' };
                  return (
                    <div 
                      key={m.id} 
                      className="bg-cream/25 border border-warm-beige/40 rounded-xl p-3 flex justify-between items-start hover:border-warm-beige transition-colors group"
                    >
                      <div className="flex gap-2.5 items-start">
                        <span className="text-xl bg-white p-1 rounded-lg border border-warm-beige/60 shadow-xs leading-none">
                          {config.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-mono uppercase font-semibold text-accent">{config.label}</span>
                            <span className="w-1 h-1 rounded-full bg-warm-mocha/30" />
                            <span className="text-[9px] font-mono text-sage">{m.date}</span>
                          </div>
                          {m.note && (
                            <p className="text-xs text-warm-mocha/80 font-sans font-light mt-0.5 pr-2">
                              "{m.note}"
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMood(m.id)}
                        className="text-warm-mocha/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                {moodHistory.length === 0 && (
                  <p className="text-center text-xs text-warm-mocha/45 italic py-4 font-light">No moods logged in ledger yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences Basket Card */}
          <div className="bg-white/80 border border-warm-beige rounded-[28px] p-6 cozy-shadow space-y-4">
            <div className="flex justify-between items-center border-b border-warm-beige pb-3">
              <span className="text-xs font-mono tracking-widest text-sage uppercase flex items-center gap-1.5 font-bold">
                <Star className="w-4 h-4 text-accent" /> daily favorites Basket
              </span>
              {!isEditingPreferences && (
                <button
                  onClick={() => setIsEditingPreferences(true)}
                  className="text-[10px] font-mono uppercase tracking-wide text-accent hover:text-accent-dark font-bold cursor-pointer"
                >
                  Edit Favorites
                </button>
              )}
            </div>

            {!isEditingPreferences ? (
              <div className="space-y-3 pt-1">
                <div className="flex justify-between text-xs items-center p-2.5 bg-cream/20 rounded-xl border border-warm-beige/40">
                  <span className="font-mono text-sage uppercase">Favored Toy</span>
                  <span id="preference-toy" className="font-serif font-bold text-warm-mocha text-sm">{profile.favoriteToy}</span>
                </div>
                <div className="flex justify-between text-xs items-center p-2.5 bg-cream/20 rounded-xl border border-warm-beige/40">
                  <span className="font-mono text-sage uppercase">Zen Spot</span>
                  <span id="preference-spot" className="font-serif font-bold text-warm-mocha text-sm">{profile.favoriteSpot}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1 animate-fade-in">
                <div>
                  <label className="block text-[9px] font-mono text-warm-mocha/60 uppercase tracking-widest mb-1">Prized Toy</label>
                  <input
                    type="text"
                    value={editedToy}
                    onChange={(e) => setEditedToy(e.target.value)}
                    className="w-full bg-cream/30 border border-warm-beige rounded-xl px-3 py-1.5 text-xs text-warm-mocha focus:outline-none"
                    placeholder="e.g. Linen ball"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-warm-mocha/60 uppercase tracking-widest mb-1">Zen Spot</label>
                  <input
                    type="text"
                    value={editedSpot}
                    onChange={(e) => setEditedSpot(e.target.value)}
                    className="w-full bg-cream/30 border border-warm-beige rounded-xl px-3 py-1.5 text-xs text-warm-mocha focus:outline-none"
                    placeholder="e.g. Cushion on rug"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={handleCancelPreferences}
                    className="px-2.5 py-1 border border-warm-beige text-[10px] font-mono uppercase rounded text-warm-mocha"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-3 py-1 bg-accent hover:bg-accent/95 text-white text-[10px] font-mono font-bold uppercase rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COMPONENT: ROUTINE SCHEDULE & WATER TRACKER (Desktop Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Hydration Counter Panel */}
          <div className="bg-white/80 border border-warm-beige rounded-[28px] p-6 md:p-8 cozy-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EBF5FB]/35 rounded-bl-[160px] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-warm-beige pb-4 mb-5 gap-3">
              <div>
                <span className="text-xs font-mono tracking-widest text-sage uppercase flex items-center gap-1.5 font-bold">
                  <Droplets className="w-4 h-4 text-[#3498DB]" /> feline hydration station
                </span>
                <span className="text-[11px] text-warm-mocha/60 font-sans font-light mt-0.5 block">
                  Keep {profile.name} well hydrated with fresh running spring water
                </span>
              </div>
              <div className="bg-[#EBF5FB] border border-[#AED6F1]/55 py-1 px-3.5 rounded-full text-xs font-mono font-bold text-[#2980B9]">
                Goal: {dailyLogs.waterTarget} Bowls (400ml)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Graphic Visual Representation of Bowls */}
              <div className="md:col-span-7 flex flex-wrap gap-2.5 justify-center md:justify-start" id="hydration-bowl-grid">
                {Array.from({ length: dailyLogs.waterTarget }).map((_, idx) => {
                  const isDrunk = idx < dailyLogs.waterCount;
                  return (
                    <div 
                      key={idx}
                      className={`relative w-12 h-10 rounded-b-2xl rounded-t-sm border-2 flex items-center justify-center transition-all duration-300 shadow-sm ${
                        isDrunk
                          ? 'border-[#3498DB] bg-[#EBF5FB] text-[#2980B9] scale-102 ring-1 ring-[#3498DB]/10'
                          : 'border-warm-beige bg-white text-warm-mocha/20'
                      }`}
                      title={isDrunk ? `Bowl ${idx + 1} Drunk` : `Bowl ${idx + 1} Empty`}
                    >
                      {/* Water liquid waves details */}
                      {isDrunk && (
                        <div className="absolute inset-x-0 bottom-0 top-[35%] bg-[#3498DB]/30 rounded-b-xl border-t border-[#3498DB] animate-pulse pointer-events-none" />
                      )}
                      <span className="text-sm font-semibold relative z-10">{idx + 1}</span>
                    </div>
                  );
                })}
                {/* Overflow Bowls in case of extra hydration */}
                {dailyLogs.waterCount > dailyLogs.waterTarget && 
                  Array.from({ length: dailyLogs.waterCount - dailyLogs.waterTarget }).map((_, idx) => (
                    <div 
                      key={idx}
                      className="relative w-12 h-10 rounded-b-2xl rounded-t-sm border-2 border-emerald-500 bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform scale-102 ring-1 ring-emerald-500/15"
                      title="Bonus Hydration"
                    >
                      <div className="absolute inset-x-0 bottom-0 top-[25%] bg-emerald-500/20 rounded-b-xl border-t border-emerald-500 animate-pulse pointer-events-none" />
                      <span className="text-[9px] font-bold font-mono">+{idx + 1}</span>
                    </div>
                  ))
                }
              </div>

              {/* Action Buttons to increment / decrement water */}
              <div className="md:col-span-5 flex md:flex-col justify-center gap-2">
                <button
                  type="button"
                  id="water-increment-btn"
                  onClick={incrementWater}
                  className="flex-1 bg-[#3498DB] hover:bg-[#2980B9] text-white py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-101 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Log Water Bowl
                </button>
                <button
                  type="button"
                  id="water-decrement-btn"
                  onClick={decrementWater}
                  disabled={dailyLogs.waterCount === 0}
                  className="bg-white hover:bg-cream border border-[#AED6F1]/70 px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-[#2980B9] uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  Sub Bowl
                </button>
              </div>

            </div>
          </div>

          {/* Daily Checklist Routine Tracker */}
          <div className="bg-white/80 border border-warm-beige rounded-[28px] p-6 md:p-8 cozy-shadow space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-warm-beige pb-4 gap-3">
              <div>
                <span className="text-xs font-mono tracking-widest text-sage uppercase flex items-center gap-1.5 font-bold">
                  <BookOpen className="w-4 h-4 text-accent" /> daily care routines guide
                </span>
                <span className="text-[11px] text-warm-mocha/60 font-sans font-light mt-0.5 block">
                  Toggle completed habits or compile new chores for {profile.name}'s diary grid
                </span>
              </div>
              <button
                onClick={handleResetTasks}
                className="text-[10px] font-mono border border-accent/25 hover:bg-accent/5 px-3 py-1.5 rounded-lg text-accent uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                Reset Chores
              </button>
            </div>

            {/* List of Tasks */}
            <div className="space-y-3" id="routine-checklist-nodes">
              {dailyLogs.tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`border rounded-2xl p-4 flex justify-between items-center cursor-pointer transition-all ${
                    task.completed 
                      ? 'border-warm-beige bg-cream/20 text-warm-mocha/60 shadow-xs' 
                      : 'border-warm-beige bg-white text-warm-charcoal hover:border-accent/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      task.completed 
                        ? 'border-accent bg-accent text-white' 
                        : 'border-warm-beige bg-white'
                    }`}>
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </div>
                    
                    <div className="min-w-0">
                      <p className={`text-xs md:text-sm font-semibold truncate ${task.completed ? 'line-through text-warm-mocha/45' : ''}`}>
                        {task.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-cream border border-warm-beige/30 uppercase tracking-wide">
                          {task.category}
                        </span>
                        {task.time && (
                          <span className="text-[9px] font-mono text-sage">{task.time}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid triggering completion toggle
                      handleDeleteTask(task.id);
                    }}
                    className="text-warm-mocha/30 hover:text-red-500 rounded-full p-1 border border-transparent hover:border-warm-beige transition-colors cursor-pointer"
                    title="Remove Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {dailyLogs.tasks.length === 0 && (
                <p className="text-center text-xs text-warm-mocha/40 py-8 italic font-light">No tasks added to today's list.</p>
              )}
            </div>

            {/* Add New Chore Form Row inline */}
            <form onSubmit={handleAddTask} id="task-builder-form" className="bg-cream/20 border border-warm-beige/65 rounded-[20px] p-4 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-sage block font-bold">Write New Daily Care Chore</span>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
                <div className="md:col-span-5">
                  <label className="block text-[8px] font-mono text-warm-mocha/60 uppercase tracking-widest mb-1">Chore Detail</label>
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="e.g. Clean the litter sandbox"
                    className="w-full bg-white border border-warm-beige rounded-xl px-3 py-1.5 text-xs text-warm-mocha"
                    required
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-[8px] font-mono text-warm-mocha/60 uppercase tracking-widest mb-1 text-left">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e: any) => setNewTaskCategory(e.target.value)}
                    className="w-full bg-white border border-warm-beige rounded-xl px-2 py-1.5 text-xs text-warm-mocha"
                  >
                    <option value="diet">Diet</option>
                    <option value="activity">Activity</option>
                    <option value="hygiene">Hygiene</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[8px] font-mono text-warm-mocha/60 uppercase tracking-widest mb-1">Hours Schedule</label>
                  <input
                    type="text"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    placeholder="e.g. 09:00 PM"
                    className="w-full bg-white border border-warm-beige rounded-xl px-2.5 py-1.5 text-xs text-warm-mocha"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent-dark text-white py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
