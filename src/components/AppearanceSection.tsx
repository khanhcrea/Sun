import React, { useState } from 'react';
import { CatProfile, GalleryImage } from '../types';
import { Camera, Image, Sparkles, ChevronLeft, ChevronRight, X, Heart, Plus, Edit3, Check, Trash2 } from 'lucide-react';

interface AppearanceSectionProps {
  profile: CatProfile;
  gallery: GalleryImage[];
  onUpdateProfile: (updated: CatProfile) => void;
  onUpdateGallery: (updated: GalleryImage[]) => void;
}

export default function AppearanceSection({ profile, gallery, onUpdateProfile, onUpdateGallery }: AppearanceSectionProps) {
  const [isEditingTraits, setIsEditingTraits] = useState(false);
  const [editedFur, setEditedFur] = useState(profile.furColor);
  const [editedPattern, setEditedPattern] = useState(profile.pattern);
  const [editedFeatures, setEditedFeatures] = useState<string[]>([...profile.distinctiveFeatures]);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Gallery view controls
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSaveTraits = () => {
    onUpdateProfile({
      ...profile,
      furColor: editedFur,
      pattern: editedPattern,
      distinctiveFeatures: editedFeatures
    });
    setIsEditingTraits(false);
  };

  const handleCancelTraits = () => {
    setEditedFur(profile.furColor);
    setEditedPattern(profile.pattern);
    setEditedFeatures([...profile.distinctiveFeatures]);
    setIsEditingTraits(false);
    setNewFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    setEditedFeatures(editedFeatures.filter((_, i) => i !== idx));
  };

  const addFeature = () => {
    if (newFeatureInput.trim() && !editedFeatures.includes(newFeatureInput.trim())) {
      setEditedFeatures([...editedFeatures, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim() || !newCaption.trim()) return;

    const newPhoto: GalleryImage = {
      id: `g-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newCaption.trim(),
      date: newDate
    };

    onUpdateGallery([newPhoto, ...gallery]);
    setNewPhotoUrl('');
    setNewCaption('');
    setNewDate(new Date().toISOString().split('T')[0]);
    setShowAddForm(false);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering lightbox
    if (window.confirm(`Are you sure you want to remove this photo from ${profile.name}'s album?`)) {
      onUpdateGallery(gallery.filter(img => img.id !== id));
      if (lightboxIndex !== null) {
        setLightboxIndex(null);
      }
    }
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % gallery.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
    }
  };


  return (
    <div id="appearance-section" className="space-y-12 animate-fade-in">
      
      {/* SECTION HEADER */}
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-warm-charcoal font-semibold mb-2">
          appearance & aesthetic pattern
        </h2>
        <p className="text-sage font-mono text-xs uppercase tracking-widest">
          fur composition, signature patterns & curated photo records
        </p>
        <div className="mt-3 w-16 h-1 bg-accent/25 rounded-full mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: TRAITS CARD (Desktop Span 5) */}
        <div className="lg:col-span-5 bg-white/80 border border-warm-beige rounded-[28px] p-6 md:p-8 cozy-shadow relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/3 rounded-bl-[120px] pointer-events-none" />
          
          <div className="flex justify-between items-center border-b border-warm-beige pb-4">
            <span className="text-xs font-mono tracking-widest text-sage uppercase flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-4 h-4 text-accent" /> Physical Identity
            </span>
            {!isEditingTraits && (
              <button
                id="edit-traits-btn"
                onClick={() => setIsEditingTraits(true)}
                className="flex items-center gap-1 text-[11px] font-mono tracking-wide uppercase text-accent hover:text-accent-dark font-bold cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Traits
              </button>
            )}
          </div>

          {!isEditingTraits ? (
            <div className="space-y-6">
              {/* Fur Color */}
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-sage mb-1">Coat Fur Color</span>
                <p id="appearance-fur-color" className="font-serif text-xl font-semibold text-warm-charcoal leading-relaxed">
                  {profile.furColor}
                </p>
              </div>

              {/* Pattern */}
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-sage mb-1">Signature Pattern</span>
                <p id="appearance-pattern" className="font-serif text-lg text-warm-mocha font-medium leading-relaxed">
                  {profile.pattern}
                </p>
              </div>

              {/* Distinctive Features */}
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-sage mb-2">Distinctive Details</span>
                <ul className="space-y-3">
                  {profile.distinctiveFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-warm-mocha/90 font-light font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  {profile.distinctiveFeatures.length === 0 && (
                    <p className="text-xs text-warm-mocha/50 italic font-light">No distinctive details recorded.</p>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            // Edit Traits Inline Form
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-mono text-warm-mocha/70 tracking-wider uppercase mb-1.5">Coat Fur Color</label>
                <input
                  type="text"
                  value={editedFur}
                  onChange={(e) => setEditedFur(e.target.value)}
                  className="w-full bg-cream/40 border border-warm-beige rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent text-warm-mocha transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-warm-mocha/70 tracking-wider uppercase mb-1.5">Signature Pattern</label>
                <input
                  type="text"
                  value={editedPattern}
                  onChange={(e) => setEditedPattern(e.target.value)}
                  className="w-full bg-cream/40 border border-warm-beige rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent text-warm-mocha transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-warm-mocha/70 tracking-wider uppercase mb-1.5">Distinctive Features</label>
                
                <div className="flex flex-wrap gap-2 p-3 bg-cream/10 border border-warm-beige rounded-xl mb-3 mb-2.5">
                  {editedFeatures.map((feat, idx) => (
                    <span 
                      key={idx} 
                      className="bg-cream border border-warm-beige text-xs px-2.5 py-1 rounded-full flex items-center gap-1 text-warm-mocha"
                    >
                      {feat}
                      <button 
                        type="button" 
                        onClick={() => removeFeature(idx)} 
                        className="text-warm-mocha/50 hover:text-accent font-semibold ml-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {editedFeatures.length === 0 && (
                    <span className="text-xs text-warm-mocha/40 font-mono">No attributes listed yet.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 bg-cream/40 border border-warm-beige rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-accent text-warm-mocha transition-colors"
                    placeholder="New trait (e.g. Amber eyes)"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-accent hover:bg-accent-dark text-white px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 border-t border-warm-beige pt-4 mt-3">
                <button
                  onClick={handleCancelTraits}
                  className="px-3.5 py-1.5 border border-warm-beige rounded-lg text-xs font-mono text-warm-mocha uppercase hover:bg-cream/40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTraits}
                  className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-mono font-semibold uppercase tracking-wider"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: GALLERY (Desktop Span 7) */}
        <div id="gallery-container" className="lg:col-span-7 space-y-6">
          
          <div className="flex justify-between items-center bg-white/70 border border-warm-beige rounded-[20px] p-4 cozy-shadow">
            <span className="font-serif text-lg font-semibold text-warm-charcoal flex items-center gap-2">
              <Image className="w-5 h-5 text-accent" /> Album Photo Gallery ({gallery.length})
            </span>
            <button
              id="add-photo-btn"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 bg-accent text-white hover:bg-accent/90 rounded-xl px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showAddForm ? 'Close' : 'Add Photo'}
            </button>
          </div>

          {/* Add Photo Form Panel */}
          {showAddForm && (
            <form onSubmit={handleAddPhoto} className="bg-white/90 border border-accent/25 rounded-2xl p-6 cozy-shadow animate-fade-in space-y-4">
              <h4 className="font-serif text-lg text-warm-charcoal font-semibold">
                Attach New Feline Snap
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-warm-mocha/70 tracking-wider uppercase mb-1">Photo Image URL</label>
                  <input
                    type="text"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="w-full bg-cream/40 border border-warm-beige rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-warm-mocha"
                    placeholder="Provide image web URL"
                    required
                  />

                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-warm-mocha/70 tracking-wider uppercase mb-1">Caption Description</label>
                    <input
                      type="text"
                      value={newCaption}
                      onChange={(e) => setNewCaption(e.target.value)}
                      className="w-full bg-cream/40 border border-warm-beige rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-warm-mocha"
                      placeholder="e.g. Exploring kitchen cabinets..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-warm-mocha/70 tracking-wider uppercase mb-1">Date Documented</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-cream/40 border border-warm-beige rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-warm-mocha"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-warm-beige/65 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3.5 py-1.5 border border-warm-beige rounded-xl text-[10px] font-mono uppercase text-warm-mocha"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-[10px] font-mono uppercase font-bold tracking-wider"
                >
                  Save Photo
                </button>
              </div>
            </form>
          )}

          {/* GRID GALLERY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {gallery.map((img, index) => (
              <div
                key={img.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative bg-white border border-warm-beige rounded-2xl overflow-hidden cursor-pointer cozy-shadow transition-all duration-300 hover:scale-[1.015] hover:border-accent/30"
              >
                <div className="aspect-video w-full overflow-hidden relative bg-warm-beige-light">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                    referrerPolicy="no-referrer"
                  />
                  {/* Backdrop Overlay on Hover */}
                  <div className="absolute inset-0 bg-warm-mocha/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-warm-mocha flex items-center gap-1.5 shadow-md">
                      <Camera className="w-3.5 h-3.5 text-accent" /> Inspect Frame
                    </span>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeletePhoto(img.id, e)}
                    className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-warm-mocha/60 hover:text-red-500 rounded-full p-1.5 shadow-sm hover:scale-110 active:scale-95 transition-all text-xs cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="p-4 bg-white/60">
                  <span className="block text-[9px] font-mono text-sage uppercase tracking-wider mb-1">{img.date}</span>
                  <p className="text-xs text-warm-mocha/85 font-light line-clamp-2 leading-relaxed">
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {gallery.length === 0 && (
            <div className="text-center py-16 bg-white/40 border border-dashed border-warm-beige rounded-[24px]">
              <Image className="w-10 h-10 text-sage mx-auto mb-3 opacity-60 animate-bounce" />
              <p className="text-sm font-medium text-warm-mocha">Album is currently empty.</p>
              <p className="text-xs text-warm-mocha/65 mt-1">Click the 'Add Photo' button to record memories.</p>
            </div>
          )}

        </div>
      </div>

      {/* LIGHTBOX POPUP MODAL */}
      {lightboxIndex !== null && (
        <div 
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 bg-warm-charcoal/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in"
        >
          {/* Lightbox Container Box */}
          <div 
            onClick={(e) => e.stopPropagation()} // Stop closing click
            className="bg-white border-[12px] border-white max-w-4xl w-full rounded-2xl overflow-hidden cozy-shadow-lg relative flex flex-col"
          >
            {/* Top Toolbar Action Bar */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setLightboxIndex(null)}
                className="bg-black/65 hover:bg-black/85 text-white p-2 rounded-full cursor-pointer transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Giant Photo Display Frame */}
            <div className="relative aspect-video bg-warm-beige-light flex items-center justify-center">
              <img
                src={gallery[lightboxIndex].url}
                alt={gallery[lightboxIndex].caption}
                className="max-h-[70vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Slider Left Arrow */}
              <button
                onClick={prevLightbox}
                className="absolute left-4 bg-black/50 hover:bg-black/75 text-white rounded-full p-2.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Slider Right Arrow */}
              <button
                onClick={nextLightbox}
                className="absolute right-4 bg-black/50 hover:bg-black/75 text-white rounded-full p-2.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Feline Captions Overlay */}
            <div className="bg-cream/90 border-t border-warm-beige/60 p-4 font-sans flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div className="flex-1">
                <span className="text-[10px] font-mono tracking-widest text-accent uppercase block mb-1">
                  Captured: {gallery[lightboxIndex].date}
                </span>
                <p className="text-sm font-light text-warm-mocha leading-relaxed">
                  {gallery[lightboxIndex].caption}
                </p>
              </div>
              <div className="text-[11px] font-mono text-sage whitespace-nowrap bg-white border border-warm-beige/80 py-1.5 px-3.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Frame {lightboxIndex + 1} of {gallery.length}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
