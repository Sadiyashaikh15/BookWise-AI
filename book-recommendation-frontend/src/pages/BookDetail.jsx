/**
 * BookDetail.jsx — BookWise Hardcover Detail View (Smart Vault & Auth Corrected)
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

  // 🟢 Phase 4 Smart Vault UI States
  const [showVaultOptions, setShowVaultOptions] = useState(false);
  const [savedReason, setSavedReason] = useState('Self Growth');
  const [isVaultSaving, setIsVaultSaving] = useState(false);
  const [vaultSuccessMessage, setVaultSuccessMessage] = useState('');

  const fallbackImage =
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&h=600&auto=format&fit=crop';

  const vaultCategories = [
    'Placement', 
    'Career', 
    'Self Growth', 
    'College', 
    'Mental Health', 
    'Entertainment', 
    'Skill Development'
  ];

  useEffect(() => {
    // Reset state parameters cleanly when id routing updates
    setIsLoading(true);
    setError(null);
    setImgError(false);
    setBook(null);
    setRelated([]);
    setShowVaultOptions(false);
    setVaultSuccessMessage('');

    const fetchComprehensiveBookData = async () => {
      try {
        const activeToken = localStorage.getItem('jwt_token');

        // 1. Safe Individual Loading Block for Primary Book Document
        const bookData = await getBook(id);
        const currentBook = bookData?.book || bookData;

        if (currentBook) {
          setBook(currentBook);
          
          // Issue 5: Track View History Event silently in the backend database
          if (user) {
            fetch('http://localhost:5000/api/track/view', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${activeToken}`
              },
              body: JSON.stringify({ user_id: user.id, book_id: currentBook.id })
            }).catch(trackErr => console.log("Quiet view tracking catch:", trackErr));
          }
        } else {
          throw new Error('This volume does not exist in our physical indexes.');
        }

        // 2. Isolated Secondary Fetch Block for Related Suggestions Panel (Prevents 404 UI Crash)
        try {
          const relatedData = await getRelatedBooks(id);
          if (relatedData) {
            setRelated(relatedData.books || relatedData || []);
          }
        } catch (relatedErr) {
          console.warn("Non-fatal peripheral shelf load failure:", relatedErr.message);
          setRelated([]); // Safe empty fallback matrix
        }

      } catch (err) {
        setError(err.message || 'Failed to resolve book profile information.');
        console.error('BookDetail fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchComprehensiveBookData();
    }
  }, [id, user]);

  // ─── PHASE 4: SMART VAULT CONTEXTUAL SUBMISSION CONTROL ────────────────────
  const handleSmartVaultSave = async () => {
    if (!user) {
      alert("Please cross the sanctuary gate and log in to commit logs.");
      return;
    }

    try {
      setIsVaultSaving(true);
      const activeToken = localStorage.getItem('jwt_token');

      // 🔒 Fixed: Passing full Bearer Authorization Token headers to pass backend checks
      const response = await fetch('http://localhost:5000/api/vault/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          user_id: user.id,
          book_id: book.id,
          saved_reason: savedReason
        })
      });

      const data = await response.json();
      if (data.success) {
        setVaultSuccessMessage(`Archived to your ${savedReason} Ledger!`);
        setTimeout(() => {
          setShowVaultOptions(false);
          setVaultSuccessMessage('');
        }, 2000);
      } else {
        alert(data.message || "Failed to commit log parameters into vault schema.");
      }
    } catch (err) {
      console.error("Smart Vault serialization failure:", err);
    } finally {
      setIsVaultSaving(false);
    }
  };

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
        <div className="w-full max-w-sm bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl p-10 shadow-xl relative">
          <span className="text-4xl block mb-4">📭</span>
          <h2 className="font-serif text-xl font-black text-[#3E3024] mb-2">Sanctuary Sync Error</h2>
          <p className="text-xs text-[#B66A50] font-medium mb-6">{error || 'Access denied or network breakdown: Status 404'}</p>
          <button
            onClick={() => navigate('/dashboard')}
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

              {book.description && (
                <div className="pt-2 max-w-2xl text-left">
                  <p className="text-xs sm:text-sm text-[#3E3024]/70 font-medium leading-relaxed font-sans border-l-2 border-[#556B2F]/20 pl-4 italic">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Inlined Core Specifications Matrix */}
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

              {/* Subject Keyword Badges */}
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

              {/* Functional Button Controls Container */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-6 w-full">
                <button
                  onClick={() => navigate(-1)}
                  className="px-5 py-3 rounded-full border border-[#3E3024]/10 bg-[#FFFDF8] text-[#3E3024]/70 hover:bg-[#F3E6D0] font-sans text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  ← Go Back
                </button>

                {/* 🟢 Contextual Vault Saving Ribbon */}
                <div className="relative inline-block text-left">
                  {showVaultOptions ? (
                    <div className="flex flex-col sm:flex-row items-center gap-2 bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl sm:rounded-full p-2 animate-fadeIn shadow-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E3024]/50 pl-2">Why are you saving this?</span>
                      <select
                        value={savedReason}
                        onChange={(e) => setSavedReason(e.target.value)}
                        disabled={isVaultSaving}
                        className="bg-[#F8F3EA] border border-[#3E3024]/10 rounded-full px-3 py-1.5 text-xs font-medium text-[#3E3024] focus:outline-none"
                      >
                        {vaultCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      
                      <div className="flex gap-1.5">
                        <button
                          onClick={handleSmartVaultSave}
                          disabled={isVaultSaving}
                          className="px-4 py-1.5 bg-[#556B2F] text-[#FFFDF8] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#435524] transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isVaultSaving ? 'Archiving...' : 'Commit'}
                        </button>
                        <button
                          onClick={() => setShowVaultOptions(false)}
                          className="px-3 py-1.5 border border-[#3E3024]/10 rounded-full text-xs font-bold text-[#3E3024]/60 hover:bg-[#3E3024]/5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowVaultOptions(true)}
                      className="px-6 py-3 rounded-full bg-[#556B2F] text-[#F8F3EA] font-sans text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#435524] transition-all cursor-pointer active:scale-98"
                    >
                      + Add to Vault
                    </button>
                  )}

                  {vaultSuccessMessage && (
                    <div className="absolute top-full left-0 mt-2 text-xs font-bold text-[#556B2F] animate-pulse">
                      ✦ {vaultSuccessMessage}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ─── RELATED RECOMMENDATIONS SECTION ─── */}
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

        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BookDetail;