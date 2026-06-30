/**
 * BookDetail.jsx — BookWise Hardcover Detail View Redesign (Enriched Metadata & Tracking)
 * Stack: React + Tailwind v4 + Soft CSS Shadows
 * Aesthetic: Opening a vintage collection log under a warm desk lamp
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BookCard from '../components/bookcard/BookCard';
import { getBook, getRelatedBooks } from '../services/bookService';
import { UserContext } from '../context/UserContext';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&h=600&auto=format&fit=crop';

  useEffect(() => {
    // Reset state parameters cleanly when id routing updates
    setIsLoading(true);
    setError(null);
    setImgError(false);
    setBook(null);
    setRelated([]);

    const fetchComprehensiveBookData = async () => {
      try {
        // Fetch book details and related recommendations concurrently via service layer
        const [bookData, relatedData] = await Promise.all([
          getBook(id),
          getRelatedBooks(id)
        ]);

        const currentBook = bookData?.book || bookData;

        if (currentBook) {
          setBook(currentBook);
          
          // 🟢 Issue 5: Track View History Event silently in the backend database
          if (user) {
            fetch('http://localhost:5000/api/track/view', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: user.id, book_id: currentBook.id })
            }).catch(trackErr => console.log("Quiet view tracking catch:", trackErr));
          }
        } else {
          throw new Error('This volume does not exist in our physical indexes.');
        }

        if (relatedData) {
          setRelated(relatedData.books || relatedData || []);
        }
      } catch (err) {
        setError(err.message);
        console.error('BookDetail fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComprehensiveBookData();
  }, [id, user]);

  // ─── LOADING STATE ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-[#556B2F]/20 border-t-[#556B2F] rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#3E3024]/40 animate-pulse">
          Opening volume registry...
        </p>
      </div>
    );
  }

  // ─── DATABASE FAILURE EMPTY BALANCES ───────────────────────────────────────
  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl p-10 max-w-sm shadow-xl relative">
          <span className="text-4xl block mb-4">📭</span>
          <h2 className="font-serif text-xl font-black text-[#3E3024] mb-2">Sanctuary Sync Error</h2>
          <p className="text-xs text-[#B66A50] font-medium mb-6">{error || 'Failed to resolve book profile information.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#B66A50] text-[#FFFDF8] rounded-full font-sans text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#A25B42] transition-colors cursor-pointer"
          >
            ← Step Backward
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F3EA] min-h-screen text-[#3E3024] font-sans antialiased selection:bg-[#A3B18A]/30">
      
      {/* Structural Horizon Breadcrumb Bar */}
      <div className="border-b border-[#3E3024]/5 bg-[#FFFDF8]/40 pt-24 pb-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3E3024]/50">
          <Link to="/dashboard" className="hover:text-[#556B2F] transition-colors">Sanctuary</Link>
          <span>/</span>
          <Link to="/library" className="hover:text-[#556B2F] transition-colors">Index</Link>
          <span>/</span>
          <span className="text-[#3E3024] font-serif tracking-normal normal-case italic font-medium truncate max-w-[200px]">{book.title}</span>
        </div>
      </div>

      {/* ─── MAIN HARDCOVER DESCRIPTION DISPLAY SHEET ──────────────────────── */}
      <div className="bg-[#FFFDF8] border-b border-[#3E3024]/10 shadow-xs relative">
        {/* Subtle lined notebook paper strip background overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#3E3024 1px, transparent 1px)', backgroundSize: '100% 28px' }} />
        
        <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">

            {/* Dimensional Book Spine Jacket Block */}
            <div className="w-48 sm:w-56 flex-shrink-0 relative group">
              <div className="absolute inset-0 bg-[#3E3024]/10 rounded-r-xl rounded-l-md blur-xl transform translate-y-4 scale-95 pointer-events-none" />
              <div className="rounded-r-xl rounded-l-md overflow-hidden border border-[#3E3024]/15 aspect-[2/3] bg-[#F8F3EA] shadow-xl relative">
                <img
                  src={imgError ? fallbackImage : (book.image_url || fallbackImage)}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
                {/* Book spine line overlay edge shading */}
                <div className="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-r from-black/20 via-black/5 to-transparent border-r border-white/5" />
              </div>
            </div>

            {/* Comprehensive Meta Ledger Details */}
            <div className="flex-1 flex flex-col items-center md:items-start space-y-4">
              <span className="px-3 py-1 bg-[#A3B18A]/20 text-[#556B2F] text-[10px] font-bold uppercase tracking-widest rounded-sm">
                {book.genre || 'General Narrative'}
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#3E3024] tracking-tight leading-tight">
                {book.title}
              </h1>

              <p className="font-sans text-sm sm:text-base text-[#3E3024]/50 font-medium italic">
                transcribed by{' '}
                <span className="text-[#3E3024] font-serif text-lg not-italic font-bold ml-1">
                  {book.author || 'Anonymous'}
                </span>
              </p>

              {book.rating && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center bg-[#FFFDF8] border border-[#3E3024]/10 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-[#C89B3C] shadow-2xs">
                    <span className="text-sm">★</span>
                    <span className="ml-1.5">{book.rating}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E3024]/40 font-sans">Archival Score</span>
                </div>
              )}

              {/* 🟢 Issue 7: Enriched Volume Description Text Summary */}
              {book.description && (
                <div className="pt-2 max-w-2xl text-left">
                  <p className="text-xs sm:text-sm text-[#3E3024]/70 font-medium leading-relaxed font-sans border-l-2 border-[#556B2F]/20 pl-4 italic">
                    {book.description}
                  </p>
                </div>
              )}

              {/* 🟢 Issue 7: Inlined Core Specifications Matrix (Enhanced with new data fields) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-4">
                {[
                  { label: 'Cluster Genre', val: book.genre || '—' },
                  { label: 'Volume Pages', val: book.pages ? `${book.pages} Pages` : '—' },
                  { label: 'Language Key', val: book.language || 'English' },
                  { label: 'Published Year', val: book.year || '—' },
                  { label: 'Publisher Registry', val: book.publisher || '—' },
                  { label: 'ISBN Identifier', val: book.isbn || '—' },
                ].map((spec, i) => (
                  <div key={i} className="bg-[#F8F3EA]/40 border border-[#3E3024]/5 rounded-xl p-4">
                    <p className="text-[9px] font-bold text-[#3E3024]/40 uppercase tracking-widest mb-0.5">{spec.label}</p>
                    <p className="font-serif text-sm font-black text-[#3E3024] truncate">{spec.val}</p>
                  </div>
                ))}
              </div>

              {/* 🟢 Issue 7: Comma-Separated Subjects Keyword Fingerprints Badges */}
              {book.subjects && (
                <div className="pt-2 w-full max-w-2xl text-left">
                  <p className="text-[9px] font-bold text-[#3E3024]/40 uppercase tracking-widest mb-2 font-sans">Subject Fingerprints</p>
                  <div className="flex flex-wrap gap-1.5">
                    {book.subjects.split(', ').slice(0, 6).map((sub, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#3E3024]/5 border border-[#3E3024]/10 rounded-sm text-[10px] font-medium font-sans text-[#3E3024]/70">
                        # {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Functional Dashboard Action Buttons Controls */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-6 w-full">
                <button
                  onClick={() => navigate(-1)}
                  className="px-5 py-3 rounded-full border border-[#3E3024]/10 bg-[#FFFDF8] text-[#3E3024]/70 hover:bg-[#F3E6D0] font-sans text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  ← Go Back
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── RELATED RECOMMENDATIONS SECTION (Similarity Scoring Bound) ─── */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#3E3024] tracking-tight">
            Readers Also Enjoyed
          </h2>
          <p className="font-sans text-xs text-[#3E3024]/50 font-bold uppercase tracking-wider mt-1">
            ✦ Core matches aligned by affinity matrix of genres, authors, and subject keywords
          </p>
        </div>

        {related.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        ) : (
          /* Empty Cluster Fallback box wrapper styling */
          <div className="text-center py-16 bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl max-w-md mx-auto shadow-2xs">
            <p className="font-serif text-base font-bold text-[#3E3024]/60 italic">
              No peripheral matching volumes found.
            </p>
            <Link
              to="/library"
              className="inline-block mt-4 px-5 py-2.5 bg-[#B66A50] text-[#FFFDF8] rounded-full font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#A25B42] transition-colors shadow-xs"
            >
              Browse General Catalog
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

export default BookDetail;