/**
 * Profile.jsx — BookWise Personal Reading Diary Redesign
 * Stack: React + Tailwind v4 + Soft Vintage Textures
 * Aesthetic: Personal Library Membership Card x Dark Academia Diary
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
  finished: { label: 'Finished', icon: '✅', color: 'text-[#C89B3C]/10' },
  did_not_finish: { label: 'Dropped', icon: '❌', color: 'text-[#6F4E37] bg-[#F3E6D0]' },
};

const Profile = () => {
  const { user } = useContext(UserContext);
  const [statuses, setStatuses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [totalSystemBooks, setTotalSystemBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ─── LIVE BACKEND DATA REGISTERS SYNC ──────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    
    Promise.all([
      fetch(`${API}/api/reading-status/${user.id}`).then((r) => r.json()),
      fetch(`${API}/api/favorites/${user.id}`).then((r) => r.json()),
      getAllBooks().catch(() => [])
    ]).then(([statusData, favData, booksData]) => {
      setStatuses(statusData.statuses || []);
      setFavorites(favData.favorites || favData.books || []);
      setTotalSystemBooks(booksData ? booksData.length : 0);
    }).catch((err) => {
      console.error('Archival diary sync error:', err);
    }).finally(() => setIsLoading(false));
  }, [user]);

  const countByStatus = (s) => statuses.filter((x) => x.status === s).length;
  const finished = countByStatus('finished');
  const reading = countByStatus('currently_reading');
  const wantToRead = countByStatus('want_to_read');

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
                  📚 Core Season: {user?.favorite_genre || 'General Narrative'}
                </span>
              </div>
            </div>
          </div>
        </div>

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
                    {/* Tiny visual book boundary block */}
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
              { label: 'Thematic Affinity Mapping', value: user?.favorite_genre },
              { label: 'Sanctuary Access Tier', value: 'BookWise Premium Core' },
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
      `}</style>
    </div>
  );
};

export default Profile;