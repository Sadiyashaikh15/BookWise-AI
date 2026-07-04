/**
 * Home.jsx — The Sanctuary Grand Archive (Continuous Discovery Redesign)
 * Stack: React + Tailwind v4 + Split State Management Architecture
 * Aesthetic: Warm Linen Parchment x Intelligent Librarian Dialogue Feed
 */

import React, { useState, useEffect, useContext } from 'react';
import BookCard from '../components/bookcard/BookCard';
import { UserContext } from '../context/UserContext';
import { getAllBooks } from '../services/bookService';

const Home = () => {
  const { user, token } = useContext(UserContext);

  // ─── STATE MANAGEMENT PANELS ──────────────────────────────────────────────
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  // Lifecycle Signals
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [isRecLoading, setIsRecLoading] = useState(false);

  // Discovery Form Input States
  const [goalPrompt, setGoalPrompt] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [aiRationaleText, setAiRationaleText] = useState(
    'Because this matches your established profile affinities in Productivity and Self Growth.'
  );

  const quickGoals = [
    "Become disciplined",
    "Placement preparation",
    "Learn investing",
    "Improve communication",
    "Programming",
    "Psychology"
  ];

  // ─── PIPELINE 1: INITIAL PASSIVE DATA HARVESTING ─────────────────────────
  useEffect(() => {
    const fetchUniversalArchiveLogs = async () => {
      try {
        setIsMainLoading(true);

        // 1. Fetch Master Library Collection Records (Public endpoint)
        const booksData = await getAllBooks();
        const verifiedBooks = booksData || [];
        setBooks(verifiedBooks);

        // 2. Extract Popular This Week Rows sorted via baseline rating metrics
        const sortedPopular = [...verifiedBooks]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4);
        setPopularBooks(sortedPopular);

        const activeToken = token || localStorage.getItem('jwt_token');

        // 3. Sync User Favorites Array & Prime Personalized Recommendations
        if (activeToken) {
          // ✅ FIX: Injected the required authentication header to prevent backend failure
          const favResponse = await fetch(`http://localhost:5000/api/favorites/${user?.id || 1}`, {
            headers: {
              'Authorization': `Bearer ${activeToken}`
            }
          });
          
          if (favResponse.ok) {
            const favData = await favResponse.json();
            // Natively targets the 'favorites' array array mapping returned from our secure database query
            setFavorites((favData.favorites || []).map((f) => f.id));
          }

          // 4. Prime the Recommended Shelf Reactively via Token Session Identity
          setIsRecLoading(true);
          const recResponse = await fetch(`http://localhost:5000/api/recommendations`, {
            headers: {
              'Authorization': `Bearer ${activeToken}`
            }
          });
          
          if (recResponse.ok) {
            const recData = await recResponse.json();
            const recList = recData.books || recData.recommendations || recData || [];
            setRecommendedBooks(recList.slice(0, 4));
          }
        } else {
          // Unauthenticated default layout seed values configuration
          setRecommendedBooks(verifiedBooks.slice(5, 9));
        }
      } catch (err) {
        console.error("Archive network sync warning:", err);
      } finally {
        setIsMainLoading(false);
        setIsRecLoading(false);
      }
    };

    fetchUniversalArchiveLogs();
  }, [user, token]);
  // ─── PIPELINE 2: GUIDED AI DISCOVERY INTAKE PIPELINE ──────────────────────
  const handleLibrarianDiscovery = async (prompt) => {
    if (!prompt.trim()) return;
    
    const activeToken = token || localStorage.getItem('jwt_token');
    if (!activeToken) {
      alert("Cross the sanctuary threshold—please log in to ask the AI Librarian.");
      return;
    }

    setIsRecLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/librarian/discover', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ goal_prompt: prompt.trim() }),
      });
      
      const data = await response.json();
      if (data.success && data.books && data.books.length > 0) {
        // Intercept and update only the premium contextual evaluation board
        setRecommendedBooks(data.books.slice(0, 4));
        setAiRationaleText(data.books[0]?.aiRationale || `I have aligned these strategic options perfectly matching your inquiry.`);
        setGoalPrompt('');
      }
    } catch (err) {
      console.error("Librarian pipeline communication failure:", err);
    } finally {
      setIsRecLoading(false);
    }
  };

  // Extract master genre filters out dynamically from collection array indices
  const staticGenres = ['All', ...new Set(books.map((b) => b.genre).filter(Boolean))];

  // ─── PIPELINE 3: MANUAL DISCOVERY ARCHIVE INDEX FILTERING ─────────────────
  const filteredGrandArchiveBooks = books.filter((book) => {
    return activeGenre === 'All' || book.genre === activeGenre;
  });

  const handleLocalFavoriteUpdate = (bookId, isNowFav) => {
    if (isNowFav) {
      setFavorites((prev) => [...prev, bookId]);
    } else {
      setFavorites((prev) => prev.filter((id) => id !== bookId));
    }
  };

  return (
    <div className="bg-[#F8F3EA] min-h-screen text-[#3E3024] font-sans antialiased pt-28 pb-16 px-6 selection:bg-[#A3B18A]/30">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* ─── 1. HERO SECTION (THE SANCTUARY CONVERSATIONAL FOYER) ────────── */}
        <div className="text-center space-y-4 border-b border-[#3E3024]/10 pb-6">
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#3E3024]">
            {user ? `Good Evening, ${user.name}.` : "Welcome to the Archive."}
          </h1>
          <p className="font-sans text-xs font-bold text-[#556B2F] tracking-widest uppercase">
            What are you looking for today?
          </p>

          {/* Conversational Intake Prompt Line */}
          <div className="relative max-w-xl mx-auto pt-2">
            <input
              type="text"
              placeholder="e.g., 'I want to become more disciplined' or describe a goal..."
              className="w-full bg-[#FFFDF8] border border-[#3E3024]/20 rounded-2xl px-6 py-4 text-base font-serif text-[#3E3024] focus:outline-hidden focus:border-[#B66A50] transition-all shadow-md placeholder-[#3E3024]/30"
              value={goalPrompt}
              onChange={(e) => setGoalPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLibrarianDiscovery(goalPrompt)}
            />
            {goalPrompt && (
              <button
                onClick={() => setGoalPrompt('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Quick Action Goal Interaction Chips */}
          <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto pt-2">
            {quickGoals.map(goal => (
              <button 
                key={goal}
                onClick={() => handleLibrarianDiscovery(goal)}
                className="px-4 py-2 bg-[#F3E6D0]/50 border border-[#3E3024]/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#3E3024]/70 hover:bg-[#B66A50] hover:text-[#FFFDF8] transition-all cursor-pointer active:scale-95"
              >
                • {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Global Structural Loading Ring Mask */}
        {isMainLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 border-4 border-[#556B2F]/20 border-t-[#556B2F] rounded-full animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#3E3024]/40 animate-pulse">Consulting library logs...</p>
          </div>
        ) : (
          <>
            {/* ─── 2. RECOMMENDED FOR YOU (THE DYNAMIC ALIVE ENGINE SHELF) ────── */}
            <div className="space-y-4">
              <div className="border-b border-[#3E3024]/5 pb-1">
                <h2 className="font-serif text-xl sm:text-2xl font-black text-[#3E3024] tracking-tight flex items-center gap-2">
                  Recommended For You <span className="text-sm opacity-50">⭐</span>
                </h2>
              </div>

              {isRecLoading ? (
                <div className="h-48 bg-[#FFFDF8] border border-[#3E3024]/5 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-[#B66A50]/20 border-t-[#B66A50] rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-6 bg-[#FFFDF8] border border-[#3E3024]/10 p-5 rounded-2xl shadow-sm relative">
                  {/* Soft Calligraphic Linen Rationale Box */}
                  <div className="bg-[#F3E6D0]/20 border-l-2 border-[#B66A50] p-4 rounded-r-xl text-xs sm:text-sm font-serif italic text-[#3E3024]/80 leading-relaxed">
                    "{aiRationaleText}"
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
                    {recommendedBooks.map((book) => (
                      <div key={`rec-${book.id}`} className="space-y-2">
                        <BookCard 
                          book={book} 
                          isFavorited={favorites.includes(book.id)} 
                          onFavoriteToggle={handleLocalFavoriteUpdate}
                        />
                        {book.influences && (
                          <div className="text-[9px] font-sans font-bold text-[#556B2F] uppercase tracking-wide opacity-80 pl-1">
                            ↳ Why? {book.influences[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="w-full h-1.5 bg-[#6F4E37]/10 rounded-sm mt-4" />
                </div>
              )}
            </div>

            {/* ─── 3. POPULAR THIS WEEK (TRENDING LEDGER ROW) ────────────────── */}
            <div className="space-y-4">
              <div className="border-b border-[#3E3024]/5 pb-1">
                <h2 className="font-serif text-xl sm:text-2xl font-black text-[#3E3024] tracking-tight flex items-center gap-2">
                  Popular This Week <span className="text-sm opacity-50">🔥</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {popularBooks.map((book) => (
                  <BookCard
                    key={`pop-${book.id}`}
                    book={book}
                    isFavorited={favorites.includes(book.id)}
                    onFavoriteToggle={handleLocalFavoriteUpdate}
                  />
                ))}
              </div>
            </div>

            {/* ─── 4. BROWSE BY GENRE (ISOLATED FILTER NAVIGATION) ───────────── */}
            <div className="space-y-3 pt-2">
              <div className="border-b border-[#3E3024]/5 pb-1">
                <h3 className="font-serif text-lg font-bold text-[#3E3024] tracking-tight">Browse by Genre</h3>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
                {staticGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setActiveGenre(genre)}
                    className={`px-4 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                      activeGenre === genre
                        ? 'bg-[#556B2F] border-[#556B2F] text-[#F8F3EA] shadow-xs'
                        : 'bg-[#FFFDF8] border-[#3E3024]/10 text-[#3E3024]/70 hover:bg-[#F3E6D0]'
                    }`}
                  >
                    {genre === 'All' ? 'All Shelves' : genre}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── 5. THE GRAND ARCHIVE (THE PERSISTENT INDEX LOG WINDOW) ─────── */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#3E3024]/40 font-sans">
                <span>The Grand Archive Register</span>
                <span>{filteredGrandArchiveBooks.length} Volumes Logged</span>
              </div>

              {filteredGrandArchiveBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredGrandArchiveBooks.map((book) => (
                    <BookCard
                      key={`archive-${book.id}`}
                      book={book}
                      isFavorited={favorites.includes(book.id)}
                      onFavoriteToggle={handleLocalFavoriteUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl p-12 text-center max-w-sm mx-auto shadow-2xs">
                  <span className="text-xl block mb-2">🪶</span>
                  <p className="font-serif text-sm font-bold text-[#3E3024]">No structural items found inside this case partition.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Home;