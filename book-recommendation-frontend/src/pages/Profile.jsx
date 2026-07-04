/**
 * Profile.jsx — BookWise Personal Reading Diary & Shelf DNA Visualizer
 * Stack: React + Tailwind v4 + Soft Vintage Textures
 * Aesthetic: Personal Library Membership Card x Dark Academia Diary Logs
 */

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { getAllBooks } from '../services/bookService';

const API = 'http://localhost:5000';

// Design system matched status labels & atmospheric color tokens
const STATUS_LABELS = {
  want_to_read: { label: 'Want to Read', icon: '🔖', color: 'text-[#556B2F] bg-[#A3B18A]/20' },
  currently_reading: { label: 'Currently Reading', icon: '📖', color: 'text-[#B66A50] bg-[#B66A50]/10' },
  finished: { label: 'Finished', icon: '✅', color: 'text-[#C89B3C] bg-[#C89B3C]/10' },
  did_not_finish: { label: 'Dropped', icon: '❌', color: 'text-[#6F4E37] bg-[#F3E6D0]' },
};

const Profile = () => {
  const { user } = useContext(UserContext);
  const [statuses, setStatuses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [totalSystemBooks, setTotalSystemBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🟢 Phase 4 Shelf DNA Visualizer State Matrix
  const [dna, setDna] = useState(null);
  const [isDnaLoading, setIsDnaLoading] = useState(true);

  // ─── LIVE BACKEND DATA REGISTERS SYNC ──────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    
    const activeToken = localStorage.getItem('jwt_token');

    // Secure Header Config
    const fetchOptions = {
      headers: {
        'Authorization': `Bearer ${activeToken}`
      }
    };

    // Concurrent Harvesting Pipeline
    Promise.all([
      fetch(`${API}/api/reading-status/${user.id}`, fetchOptions).then((r) => r.json()).catch(() => ({ statuses: [] })),
      fetch(`${API}/api/favorites/${user.id}`, fetchOptions).then((r) => r.json()).catch(() => ({ favorites: [] })),
      getAllBooks().catch(() => []),
      fetch(`${API}/api/analytics/dna`, fetchOptions).then((r) => r.json()).catch(() => ({ success: false }))
    ]).then(([statusData, favData, booksData, dnaData]) => {
      setStatuses(statusData.statuses || []);
      setFavorites(favData.favorites || favData.books || []);
      setTotalSystemBooks(booksData ? booksData.length : 0);
      
      if (dnaData.success) {
        setDna(dnaData);
      }
    }).catch((err) => {
      console.error('Archival diary alignment sync error:', err);
    }).finally(() => {
      setIsLoading(false);
      setIsDnaLoading(false);
    });
  }, [user]);

  const countByStatus = (s) => statuses.filter((x) => x.status === s).length;
  const finished = countByStatus('finished');
  const reading = countByStatus('currently_reading');

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="bg-[#F8F3EA] min-h-screen text-[#3E3024] font-sans antialiased pt-28 pb-20 px-4 selection:bg-[#A3B18A]/30">
      
      {/* Decorative background overlay line textures */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(rgba(62,48,36,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(62,48,36,0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className="max-w-3xl mx-auto space-y-10 relative z-10">
        
        {/* ─── VINTAGE MEMBERSHIP CARD HEADER ───────────────────────────────── */}
        <div className="bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          {/* Deckle paper spine indicator */}
          <div className="absolute left-0 inset-y-0 w-1.5 bg-[#B66A50]" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar Stylized as an Antique Library Book Stamp */}
            <div className="w-20 h-20 rounded-xl bg-[#6F4E37] flex flex-col items-center justify-center text-[#FFFDF8] text-2xl font-serif font-black shadow-md border border-[#3E3024]/10 flex-shrink-0 relative group select-none">
              <span className="absolute top-1 left-1.5 text-[8px] opacity-30 font-sans">ID</span>
              {initials}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h1 className="font-serif text-2xl sm:text-4xl font-black text-[#3E3024] tracking-tight">
                {user?.name || 'Anonymous Reader'}
              </h1>
              <p className="font-mono text-xs text-[#3E3024]/50 font-bold">{user?.email}</p>
              
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#556B2F]/10 text-[#556B2F] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#556B2F]/15">
                  📚 Onboarding Base Focus: {user?.favorite_genre || 'General Narrative'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 🟢 NEW COMPONENT INSET: THE DYNAMIC SHELF DNA VISUALIZER ────── */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#3E3024] flex items-center gap-2">
            <span>🧬</span> Literary Profile DNA
          </h2>

          {isDnaLoading ? (
            <div className="bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl p-6 text-center text-xs italic opacity-50 font-serif">
              Synthesizing active archive telemetry segments...
            </div>
          ) : (
            <div className="bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden animate-fadeIn">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#556B2F] via-[#B66A50] to-[#C89B3C]" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Left Block: Core Trait Description */}
                <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-[#3E3024]/10 pb-4 md:pb-0 md:pr-4 space-y-1">
                  <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#3E3024]/40">Personality Strain</p>
                  <h3 className="font-serif text-2xl font-black text-[#B66A50] tracking-tight">
                    ✦ {dna?.personality || "Enlightened Explorer"}
                  </h3>
                  <p className="text-[10px] font-sans text-[#3E3024]/50 leading-relaxed pt-1 italic">
                    {dna?.behavior || "Seeking wide-spectrum personal refinement loops."}
                  </p>
                </div>

                {/* Center/Right Block: Vector Density Bars */}
                <div className="md:col-span-2 space-y-3.5">
                  <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#3E3024]/40">Active Vault Density Modules</p>
                  
                  {dna?.metrics && dna.metrics.length > 0 ? (
                    <div className="space-y-3">
                      {dna.metrics.map((metric, idx) => (
                        <div key={idx} className="space-y-1.5 text-xs font-sans">
                          <div className="flex justify-between items-baseline font-bold text-[#3E3024]/80">
                            <span className="tracking-wide">{metric.saved_reason} Ledger</span>
                            <span className="font-mono text-[10px] opacity-60">{metric.count} Volume(s)</span>
                          </div>
                          {/* Progress Line */}
                          <div className="w-full h-1.5 bg-[#3E3024]/5 rounded-full overflow-hidden border border-black/5">
                            <div 
                              className="bg-[#556B2F] h-full rounded-full transition-all duration-700"
                              style={{ width: `${Math.min(metric.count * 25, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-serif italic text-[#3E3024]/40 pt-1">
                      No structural vault segments mapped yet. Categorize volumes into custom Vault fields to plot structural chart densities.
                    </p>
                  )}
                  
                  <div className="pt-2 border-t border-[#3E3024]/5 text-[10px] font-sans text-[#3E3024]/50">
                    <span className="font-bold text-[#556B2F]">Engine Directive Style:</span> {dna?.style || "Balanced, Narrative-focused"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ─── READING METRIC INDEX CARDS ──────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#3E3024] flex items-center gap-2">
            <span>📊</span> Reading Metrics Register
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Completed', value: finished, icon: '✅', color: 'bg-[#C89B3C]/5 border-[#C89B3C]/10 text-[#C89B3C]' },
              { label: 'In Progress', value: reading, icon: '📖', color: 'bg-[#B66A50]/5 border-[#B66A50]/10 text-[#B66A50]' },
              { label: 'Total Catalog', value: totalSystemBooks, icon: '🔖', color: 'bg-[#556B2F]/5 border-[#556B2F]/10 text-[#556B2F]' },
              { label: 'Vaulted Favorites', value: favorites.length, icon: '❤️', color: 'bg-[#6F4E37]/5 border-[#6F4E37]/10 text-[#B66A50]' },
            ].map((card) => (
              <div key={card.label} className={`rounded-xl border bg-[#FFFDF8] p-5 text-center transition-all duration-300 hover:shadow-xs ${card.color}`}>
                <p className="text-xl mb-1">{card.icon}</p>
                <p className="font-serif text-2xl font-black text-[#3E3024]">{isLoading ? '—' : card.value}</p>
                <p className="font-sans text-[10px] text-[#3E3024]/50 font-bold uppercase tracking-wider mt-1">{card.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── THE READING JOURNAL TIMELINE LIST ───────────────────────────── */}
        {statuses.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#3E3024] flex items-center gap-2">
              <span>📜</span> Reading History Ledger
            </h2>
            
            <div className="bg-[#FFFDF8] rounded-2xl border border-[#3E3024]/10 shadow-xs overflow-hidden divide-y divide-[#3E3024]/5">
              {statuses.map((s) => {
                const meta = STATUS_LABELS[s.status] || { label: s.status, icon: '📚', color: 'text-[#3E3024]/60 bg-[#3E3024]/5' };
                return (
                  <Link key={s.id} to={`/book/${s.book_id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-[#F3E6D0]/20 transition-colors group">
                    <div className="w-8 h-11 bg-[#F8F3EA] border border-[#3E3024]/10 rounded-xs flex-shrink-0 overflow-hidden relative shadow-2xs">
                      {s.image_url ? (
                        <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs opacity-30">📖</div>
                      )}
                      <div className="absolute left-0 inset-y-0 w-0.5 bg-black/10" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-black text-[#3E3024] truncate group-hover:text-[#B66A50] transition-colors">
                        {s.title}
                      </p>
                      <p className="font-sans text-xs text-[#3E3024]/50 font-medium italic">by {s.author}</p>
                    </div>

                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm flex-shrink-0 ${meta.color}`}>
                      {meta.icon} {meta.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty Active Logs Fallback Wrapper Layout */}
        {!isLoading && statuses.length === 0 && (
          <div className="text-center py-20 bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl max-w-md mx-auto shadow-2xs">
            <span className="text-4xl block mb-3 opacity-40">🪶</span>
            <p className="font-serif text-base font-bold text-[#3E3024]/60 italic">Your reading diary is silent.</p>
            <p className="font-sans text-xs text-[#3E3024]/40 font-medium mt-1">No books are currently under operational tracking flags.</p>
            <Link to="/library" className="inline-block mt-5 px-5 py-2.5 bg-[#556B2F] text-[#F8F3EA] rounded-full font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#435524] transition-colors shadow-xs">
              Open Main Archive
            </Link>
          </div>
        )}

        {/* ─── STATIONARY REGISTRATION PROFILE SUMMARY ───────────────────────── */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#3E3024] flex items-center gap-2">
            <span>🪵</span> Library Registration Details
          </h2>
          
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#3E3024]/10 shadow-xs divide-y divide-[#3E3024]/5 overflow-hidden relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#3E3024 1px, transparent 1px)', backgroundSize: '100% 24px', transform: 'translateY(6px)' }} />
            
            {[
              { label: 'Full Registry Name', value: user?.name },
              { label: 'Archived Email Link', value: user?.email },
              { label: 'Thematic Access Tier', value: 'BookWise Premium Core System' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center px-5 py-4 relative z-10">
                <span className="font-sans text-xs font-bold text-[#3E3024]/50 uppercase tracking-wider">{row.label}</span>
                <span className="font-serif text-sm font-black text-[#3E3024]">{row.value || '—'}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700&display=swap');
        
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }

        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Profile;