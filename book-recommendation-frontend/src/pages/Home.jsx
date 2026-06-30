/**
 * Home.jsx — BookWise Virtual Library Index Redesign (API Bound via Service Layer)
 * Stack: React + Tailwind v4 + Soft CSS Micro-Interactions
 * Aesthetic: Walking down a cozy wooden bookstore aisle with live filter registers & curations
 */

import React, { useState, useEffect, useContext } from 'react';
import BookCard from '../components/bookcard/BookCard';
import { UserContext } from '../context/UserContext';
import { getAllBooks, getRecommendations } from '../services/bookService';

const Home = () => {
  const { user } = useContext(UserContext);
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecLoading, setIsRecLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [activeGenre, setActiveGenre] = useState('All');

  // ─── LIVE BACKEND DATA SYNC PIPELINE VIA SERVICES ──────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetching clean structured data registers using your new bookService engine
        const booksData = await getAllBooks();
        setBooks(booksData || []);

        if (user) {
          const response = await fetch(`http://localhost:5000/api/favorites/${user.id}`);
          if (response.ok) {
            const favData = await response.json();
            setFavorites((favData.favorites || []).map((f) => f.id));
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };

    fetchData();
  }, [user]);

  // ─── LIVE RECOMMENDATIONS PIPELINE VIA SERVICES ────────────────────────────
  useEffect(() => {
    if (!user) return;

    const fetchUserRecommendations = async () => {
      try {
        setIsRecLoading(true);
        // Fetch personalized books using user context via your core bookService
        const recData = await getRecommendations(user.id);
        const recList = recData.books || recData.recommendations || recData || [];
        setRecommendations(recList.slice(0, 4)); // Isolate top 4 targeted books
      } catch (err) {
        console.error('Quiet curations fetch notice:', err.message);
      } finally {
        setIsRecLoading(false);
      }
    };

    fetchUserRecommendations();
  }, [user, activeGenre]); // Triggers fresh query balances on preference shifts

  // Dynamic extract for available genres to generate the bookshelf tabs
  const genres = ['All', ...new Set(books.map((b) => b.genre).filter(Boolean))];

  // ─── STEP 3: LIVE CLIENT-SIDE FILTERING (TITLE, AUTHOR, PUBLISHER) ─────────
  // ─── STEP 4: GENRE MOUNT Shelving FILTER BALANCES ─────────────────────────
  const filteredBooks = books.filter((book) => {
    const searchStr = searchTerm.toLowerCase();
    
    const matchesSearch =
      (book.title || '').toLowerCase().includes(searchStr) ||
      (book.author || '').toLowerCase().includes(searchStr) ||
      (book.publisher || '').toLowerCase().includes(searchStr);
      
    const matchesGenre = activeGenre === 'All' || book.genre === activeGenre;
    
    return matchesSearch && matchesGenre;
  });

  // Instant favoriting pipeline tracking handler callback synchronization
  const handleLocalFavoriteUpdate = (bookId, isNowFav) => {
    if (isNowFav) {
      setFavorites((prev) => [...prev, bookId]);
    } else {
      setFavorites((prev) => prev.filter((id) => id !== bookId));
    }
  };

  return (
    <div className="bg-[#F8F3EA] min-h-screen text-[#3E3024] font-sans antialiased pt-28 pb-16 px-6 selection:bg-[#A3B18A]/30">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="border-b border-[#3E3024]/10 pb-5">
          <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-[#3E3024]">
            The Grand Archive
          </h1>
          <p className="font-sans text-xs font-bold text-[#556B2F] tracking-widest uppercase mt-2">
            🪵 Walk between the cases & discover your next volume
          </p>
        </div>

        {/* 🟢 BEAUTIFUL PERSONALIZED RECOMMENDATION SHELF (Hidden when searching or filtering) */}
        {user && !searchTerm && activeGenre === 'All' && (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#3E3024]/5 pb-2">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-black text-[#3E3024] tracking-tight">
                  Recommended For You
                </h2>
                <p className="font-sans text-[10px] text-[#B66A50] font-bold uppercase tracking-wider mt-0.5">
                  ✨ Tailored matches pulled for {user.name} based on affinity settings
                </p>
              </div>
            </div>

            {isRecLoading ? (
              <div className="h-48 bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#556B2F]/20 border-t-[#556B2F] rounded-full animate-spin" />
              </div>
            ) : recommendations.length > 0 ? (
              /* Soft Premium Wooden Background Backing Shadow Plate Box */
              <div className="relative pt-6 pb-4 px-4 bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {recommendations.map((book) => (
                    <BookCard
                      key={`rec-${book.id}`}
                      book={book}
                      isFavorited={favorites.includes(book.id)}
                      onFavoriteToggle={handleLocalFavoriteUpdate}
                    />
                  ))}
                </div>
                {/* Visual Shelf Line Strip Underneath Card Matrix Layout */}
                <div className="w-full h-2 bg-[#6F4E37]/10 rounded-sm mt-6 border border-black/5" />
              </div>
            ) : (
              <div className="p-6 bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl text-center text-xs text-[#3E3024]/50 font-medium italic">
                Add items to your favorites or diary logs to prompt proactive machine recommendations.
              </div>
            )}
          </div>
        )}

        {/* 🟢 STEP 3: HIGH-PERFORMANCE CLIENT-SIDE LIVE SEARCH ROW */}
        <div className="w-full max-w-xl pt-2">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-40 pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search by title, author, or publisher..."
              className="w-full bg-[#FFFDF8] border border-[#3E3024]/10 rounded-full pl-12 pr-10 py-3.5 text-xs sm:text-sm text-[#3E3024] focus:outline-hidden focus:border-[#556B2F] focus:bg-[#FFFDF8] transition-all font-medium placeholder-[#3E3024]/30 shadow-2xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3E3024]/40 hover:text-[#3E3024] transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Database Error Banner Panel */}
        {error && (
          <div className="flex items-start gap-3 bg-[#B66A50]/10 border border-[#B66A50]/20 text-[#B66A50] p-5 rounded-2xl max-w-xl">
            <span className="text-lg mt-0.5">⚠️</span>
            <div>
              <p className="font-serif font-bold text-sm">Sanctuary Register Warning</p>
              <p className="text-xs text-[#B66A50]/80 mt-0.5">{error}. Ensure backend registers are operational on port 5000.</p>
            </div>
          </div>
        )}

        {/* ─── LOADING STATE ────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-4 border-[#556B2F]/20 border-t-[#556B2F] rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#3E3024]/40 animate-pulse">
              Consulting library logs...
            </p>
          </div>
        ) : (
          <>
            {/* 🟢 STEP 4: GENRE FILTER AESTHETIC BOOKSHELF TABS */}
            {!searchTerm && genres.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-none">
                {genres.map((genre) => (
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
            )}

            {/* Results Count Line */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-[#3E3024]/50 font-bold uppercase tracking-wider font-sans">
                {searchTerm
                  ? `${filteredBooks.length} entry found for "${searchTerm}"`
                  : `${filteredBooks.length} volume available on active shelf`}
              </p>
            </div>

            {/* ─── MAIN DOCKING ARCHIVE GRID ──────────────────────────────────── */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.book_id || book.id}
                    book={book}
                    isFavorited={favorites.includes(book.id)}
                    onFavoriteToggle={handleLocalFavoriteUpdate}
                  />
                ))}
              </div>
            ) : (
              /* Handcrafted Empty Shelf Canvas View */
              <div className="bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl p-12 text-center max-w-md mx-auto shadow-2xs">
                <div className="w-12 h-12 bg-[#F8F3EA] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#3E3024]/5">
                  <span className="text-xl opacity-60">🪶</span>
                </div>
                <p className="font-serif text-lg font-bold text-[#3E3024] mb-1">
                  Silence in the aisles
                </p>
                <p className="font-sans text-xs text-[#3E3024]/60 font-medium mb-6">
                  {searchTerm ? `Nothing cataloged matches "${searchTerm}"` : `No records match shelf selection`}
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setActiveGenre('All'); }}
                  className="px-5 py-2.5 bg-[#B66A50] text-[#FFFDF8] rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#A25B42] transition-colors shadow-xs cursor-pointer"
                >
                  Clear Catalog Filters
                </button>
              </div>
            )}
          </>
        )}

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700&display=swap');
        
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
        
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;