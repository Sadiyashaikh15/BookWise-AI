/**
 * Favorites.jsx — BookWise Personal Bookshelf Cabinet (Service Integrated)
 * Stack: React + Tailwind v4 + Soft CSS Shadows
 * Aesthetic: Your private premium mahogany book closet 
 */

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import BookCard from '../components/bookcard/BookCard';
import { getFavorites, removeFavorite } from '../services/bookService';

const SkeletonCard = () => (
  <div className="bg-[#FFFDF8] rounded-2xl border border-[#3E3024]/10 p-4 space-y-4 animate-pulse">
    <div className="w-full h-44 bg-[#F8F3EA] rounded-xl flex items-center justify-center">
      <div className="w-24 h-36 bg-[#3E3024]/5 rounded-r-md rounded-l-xs border border-dashed border-[#3E3024]/10" />
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-[#3E3024]/5 rounded w-1/3" />
      <div className="h-4 bg-[#3E3024]/5 rounded w-3/4" />
      <div className="h-3 bg-[#3E3024]/5 rounded w-1/2" />
    </div>
  </div>
);

const Favorites = () => {
  const { user } = useContext(UserContext);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── FETCH FAVORITES FROM SERVICE LAYER ───────────────────────────────────
  useEffect(() => {
    if (!user) return;
    
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load data cleanly using your new getFavorites service abstraction
        const data = await getFavorites(user.id);
        setBooks(data.favorites || data.books || d || []);
      } catch (err) {
        setError(err.message || 'Failed to load your personal shelf register.');
        console.error('Favorites load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  // ─── CONNECT HEART INTERACTION TO REMOVE FROM BACKEND SQLITE ─────────────
  const handleFavoriteToggle = async (bookId, isFav) => {
    if (!isFav) {
      // Optimistically remove from frontend shelf space for performance snappiness
      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== bookId));
      
      try {
        // Commit the deletion register operation cleanly to the SQLite instance
        await removeFavorite(user.id, bookId);
      } catch (err) {
        console.error('Failed to commit favorite removal register modification:', err);
        setError('Failed to update backend archive. Reloading configuration...');
        
        // Re-fetch state balances if database disconnect/errors occur to prevent desync
        const data = await getFavorites(user.id).catch(() => ({}));
        if (data) setBooks(data.favorites || data.books || []);
      }
    }
  };

  return (
    <div className="bg-[#F8F3EA] min-h-screen text-[#3E3024] font-sans antialiased pt-28 pb-16 px-6 selection:bg-[#A3B18A]/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Section Header Banner */}
        <div className="border-b border-[#3E3024]/10 pb-5">
          <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-[#3E3024]">
            Your Private Cabinet
            {!isLoading && books.length > 0 && (
              <span className="font-sans text-xs font-bold text-[#B66A50] tracking-widest uppercase ml-3 bg-[#B66A50]/10 px-3 py-1 rounded-full">
                {books.length} Volume{books.length !== 1 ? 's' : ''} Nested
              </span>
            )}
          </h1>
          <p className="font-sans text-xs font-bold text-[#556B2F] tracking-widest uppercase mt-2">
            ❤️ Treasured books tucked safely inside your quiet alcove
          </p>
        </div>

        {error && (
          <div className="p-4 bg-[#B66A50]/10 border border-[#B66A50]/20 text-[#B66A50] rounded-xl text-xs font-medium max-w-xl">
            ⚠️ {error}
          </div>
        )}

        {/* ─── LOADING ARCHITECTURE ────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : books.length > 0 ? (
          
          /* ─── PHYSICAL SHELF CABINET ARRANGEMENT ─────────────────────────── */
          <div className="relative pt-8 pb-4 px-4 sm:px-6 bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-radial from-transparent to-[#3E3024]/2 pointer-events-none rounded-2xl" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
              {books.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  isFavorited={true} 
                  onFavoriteToggle={handleFavoriteToggle} 
                />
              ))}
            </div>
            
            <div className="w-full h-3 bg-[#6F4E37] rounded-sm mt-8 opacity-80 shadow-md border border-black/5" />
          </div>
        ) : (
          
          /* ─── EMPTY CABINET STATE ────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-20 bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xs relative overflow-hidden">
            <div className="absolute top-2 right-3 opacity-20 font-serif text-lg">✿</div>
            <div className="w-12 h-12 bg-[#F8F3EA] rounded-full flex items-center justify-center border border-[#3E3024]/5 mb-4">
              <span className="text-xl opacity-50">💔</span>
            </div>
            
            <h2 className="font-serif text-xl font-black text-[#3E3024] mb-2">The Shelf is Bare</h2>
            <p className="font-sans text-xs text-[#3E3024]/60 font-medium leading-relaxed mb-6 max-w-xs">
              When you discover a story or concept that speaks to you, tap the heart icon on its ledger plate to anchor it securely on this shelf.
            </p>
            
            <Link
              to="/library"
              className="font-sans px-5 py-3 rounded-full bg-[#556B2F] text-[#F8F3EA] font-bold text-xs tracking-wider uppercase shadow-xs hover:bg-[#435524] transition-colors"
            >
              Explore Grand Archive
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700&display=swap');
        
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
      `}</style>
    </div>
  );
};

export default Favorites;