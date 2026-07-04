/**
 * Dashboard.jsx — BookWise Personal Reading Diary Redesign (Fully API Bound)
 * Stack: React + Tailwind v4 + Native CSS Shapes
 * Aesthetic: Personal Linen Journal x Dark Academia Workspace
 */

import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

// Simple Shared Component for UI Cards
const JournalCard = ({ children }) => (
  <div className="bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl p-6 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 relative overflow-hidden">
    {children}
  </div>
);

const Dashboard = () => {
  const { user } = useContext(UserContext);

  // Core State Holders - Synchronized to match JSX references
  const [analytics, setAnalytics] = useState({
    streak: 0,
    favoriteGenre: '—',
    mostReadAuthor: '—',
    booksSaved: 0
  });
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock array for graphic speed charts visual rendering
  const mockMonthlyChart = [40, 65, 50, 85, 55, 90];

  // ─── HARVEST LIVE SECURED METRICS REGISTER ───────────────────────────────
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const activeToken = localStorage.getItem('jwt_token');
        if (!activeToken) return;

        // 1. Fetch Analytics Metrics
        const response = await fetch(`http://localhost:5000/api/analytics/${user?.id || 1}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAnalytics({
              streak: data.streak,
              favoriteGenre: data.favoriteGenre,
              mostReadAuthor: data.mostReadAuthor,
              booksSaved: data.booksSaved
            });
          }
        }

        // 2. Fetch Active Reading Status Tracks
        const statusRes = await fetch(`http://localhost:5000/api/reading-status/${user?.id || 1}`, {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setCurrentlyReading((statusData.statuses || []).slice(0, 3));
        }

        // 3. Fetch Premium Dynamic Engine Recommendations for right side widget panel
        const recRes = await fetch(`http://localhost:5000/api/recommendations`, {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (recRes.ok) {
          const recData = await recRes.json();
          // Transform standard book list arrays safely for curated sidebar vibe displays
          const calibratedRecs = (recData.books || recData || []).slice(0, 3).map((book, idx) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            label: idx === 0 ? 'Affinity Pick' : idx === 1 ? 'Weekly Top' : 'System Match',
            vibe: book.genre || 'Personal Growth Focus'
          }));
          setRecommendations(calibratedRecs);
        }

      } catch (err) {
        console.error("Dashboard archival network matrix sync error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const readerName = user?.name || 'Sadiya';

  return (
    <div className="bg-[#F8F3EA] min-h-screen text-[#3E3024] font-sans antialiased pt-28 pb-16 px-6 selection:bg-[#A3B18A]/30">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ─── HEADER WELCOME LOG PANEL ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3024]/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-[#3E3024]">
              Good morning, <span className="italic text-[#B66A50] font-normal">{readerName}</span>
            </h1>
            <p className="font-sans text-xs font-bold text-[#556B2F] tracking-widest uppercase mt-2">
              🌿 Welcome back to your quiet reading corner
            </p>
          </div>
          <div className="text-left sm:text-right font-serif text-xs italic text-[#3E3024]/50 self-end">
            Current Session Logs · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* ─── TOP MATRIX: LIVE ANCHORED JOURNAL WIDGETS ───────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Widget 1: Real Reading Streak */}
          <JournalCard>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">☕</span>
              <h3 className="font-serif text-base font-bold">Habit Velocity Pulse</h3>
            </div>
            <p className="font-serif text-3xl font-black text-[#B66A50]">
              {isLoading ? '—' : analytics.streak} Days <span className="text-base font-sans font-bold text-[#3E3024]/40">🔥</span>
            </p>
            <p className="text-xs text-[#3E3024]/60 font-medium mt-2 leading-relaxed">
              Your reading candle remains lit! Keep adding logs to sustain your daily tracking momentum.
            </p>
          </JournalCard>

          {/* Widget 2: Live Structural Matrix Ledger */}
          <JournalCard>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🪵</span>
              <h3 className="font-serif text-base font-bold">Cabinet Matrix Ledger</h3>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between border-b border-[#3E3024]/5 pb-1">
                <span className="text-[10px] text-[#3E3024]/50 font-bold uppercase tracking-wider font-sans">Books Saved:</span>
                <span className="font-serif text-sm font-black text-[#556B2F]">{isLoading ? '—' : analytics.booksSaved} Volumes</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#3E3024]/5 pb-1">
                <span className="text-[10px] text-[#3E3024]/50 font-bold uppercase tracking-wider font-sans">Favorite Genre:</span>
                <span className="font-serif text-xs font-black text-[#B66A50] truncate max-w-[110px]">{isLoading ? '—' : analytics.favoriteGenre}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#3E3024]/50 font-bold uppercase tracking-wider font-sans">Most Read:</span>
                <span className="font-serif text-xs font-black text-[#3E3024] truncate max-w-[110px]">{isLoading ? '—' : analytics.mostReadAuthor}</span>
              </div>
            </div>
          </JournalCard>

          {/* Widget 3: Monthly Metric Graphic Array */}
          <JournalCard>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="font-serif text-base font-bold">Monthly Speed Chart</h3>
            </div>
            <div className="flex items-end gap-2.5 h-16 pt-2">
              {mockMonthlyChart.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    className="w-full rounded-t-xs transition-all duration-300 bg-[#556B2F]/30"
                    style={{ 
                      height: `${val}%`,
                      backgroundColor: idx === 5 ? '#B66A50' : ''
                    }} 
                  />
                  <span className="text-[8px] font-bold text-[#3E3024]/30 font-mono">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </JournalCard>

        </div>

        {/* ─── DUAL BODY PANEL ROWS ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Active Timelines */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#3E3024] flex items-center gap-2">
              <span>📖</span> Currently Flipping Pages
            </h2>

            <div className="space-y-4">
              {isLoading ? (
                <p className="text-xs font-medium text-[#3E3024]/40 italic">Reviewing shelf marks...</p>
              ) : currentlyReading.length > 0 ? (
                currentlyReading.map((book) => (
                  <div key={book.id} className="bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-5 transition-transform duration-300 hover:-translate-y-0.5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-14 bg-[#F3E6D0] text-[#3E3024] rounded-r-sm border-y border-r border-black/10 flex flex-col justify-end p-1.5 shadow-sm flex-shrink-0 relative">
                        <div className="absolute left-0 inset-y-0 w-0.5 bg-black/10" />
                        <span className="text-[6px] block font-serif font-black leading-tight tracking-tight select-none truncate">{book.title}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#A3B18A]/20 text-[#556B2F] px-2 py-0.5 rounded-sm inline-block mb-1">
                          {book.status?.replace('_', ' ')}
                        </span>
                        <h3 className="font-serif text-base font-bold text-[#3E3024]">{book.title}</h3>
                        <p className="font-sans text-xs text-[#3E3024]/60 font-medium">by {book.author || 'Unknown Author'}</p>
                      </div>
                    </div>

                    <div className="w-full sm:w-48 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-[#3E3024]/50 uppercase tracking-wider">
                        <span>Log Milestone</span>
                        <span>{book.progress_percent || 0}%</span>
                      </div>
                      <div className="w-full bg-[#F8F3EA] h-1.5 rounded-full border border-[#3E3024]/5 overflow-hidden">
                        <div className="bg-[#B66A50] h-full rounded-full" style={{ width: `${book.progress_percent || 0}%` }} />
                      </div>
                      <div className="flex justify-end gap-3 pt-1">
                        <Link to={`/book/${book.book_id}`} className="text-[10px] font-bold text-[#556B2F] uppercase tracking-wider hover:underline">
                          Open Entry
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-medium text-[#3E3024]/40 italic">No files actively running. Open catalog registries to pull files.</p>
              )}
            </div>
          </div>

          {/* Right Panel: AI Curated Recommendations */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#3E3024] flex items-center gap-2">
              <span>🔮</span> Quiet Curations
            </h2>

            <div className="space-y-4">
              {isLoading ? (
                <p className="text-xs font-medium text-[#3E3024]/40 italic">Assembling matching palettes...</p>
              ) : recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <div key={rec.id} className="bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl p-5 shadow-2xs relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#F3E6D0]/20 rounded-bl-full -z-10 pointer-events-none" />
                    
                    <span className="text-[9px] font-mono text-[#C89B3C] font-bold tracking-wider block mb-2">
                      ✦ {rec.label}
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#3E3024] group-hover:text-[#B66A50] transition-colors">
                      {rec.title}
                    </h3>
                    <p className="font-sans text-xs text-[#3E3024]/60 font-medium mb-4">by {rec.author || 'Unknown'}</p>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-[#3E3024]/5 text-[10px] font-bold text-[#3E3024]/40 uppercase tracking-widest italic font-serif">
                      <span className="truncate max-w-[120px]">{rec.vibe}</span>
                      <Link to={`/book/${rec.id}`} className="text-[#556B2F] uppercase font-sans tracking-wider not-italic hover:underline font-bold flex-shrink-0">
                        Inspect →
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-medium text-[#3E3024]/40 italic">Nothing compiled yet.</p>
              )}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
      `}</style>
    </div>
  );
};

export default Dashboard;