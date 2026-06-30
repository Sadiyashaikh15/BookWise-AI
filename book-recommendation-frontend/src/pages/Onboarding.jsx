/**
 * Onboarding.jsx — BookWise Personalization Chamber
 * Stack: React + Tailwind v4 + Soft Vintage Textures
 * Aesthetic: Registering your thematic affinities in the Grand Ledger
 */

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const AVAILABLE_INTERESTS = [
  "Fiction", "Fantasy", "Science Fiction", "Romance", "Mystery", "Thriller", 
  "Horror", "Historical Fiction", "Biography", "History", "Business", "Finance", 
  "Programming", "Technology", "Psychology", "Self Help", "Productivity", 
  "Philosophy", "Science", "Children", "Young Adult", "Poetry", "Classics"
];

const Onboarding = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = (genre) => {
    setError("");
    if (selected.includes(genre)) {
      setSelected(prev => prev.filter(item => item !== genre));
    } else {
      if (selected.length >= 5) {
        setError("Your reading alignment is securely anchored. Maximum of 5 selections allowed.");
        return;
      }
      setSelected(prev => [...prev, genre]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected.length < 3) {
      setError("Please inscribe at least 3 core interests to balance the recommendation engine.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || 1, // Fallback safely to sample user if context is mounting
          genres: selected
        })
      });

      if (response.ok) {
        // Redirect cleanly to your live workspace diary
        navigate('/dashboard');
      } else {
        setError("Could not register your profile affinities into the database logs.");
      }
    } catch (err) {
      setError("Archival connection lost. Ensure server.js is active.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8F3EA] min-h-screen text-[#3E3024] font-sans antialiased flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#A3B18A]/30">
      
      {/* Decorative Grid Line Background overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(rgba(62,48,36,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(62,48,36,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />

      <div className="w-full max-w-2xl bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl shadow-xl p-8 sm:p-10 relative z-10">
        
        {/* Header Ribbon alignment */}
        <div className="text-center mb-8 border-b border-[#3E3024]/5 pb-5">
          <span className="text-2xl block mb-2">🪶</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#3E3024] tracking-tight">
            Inscribe Your Affinities
          </h1>
          <p className="font-sans text-xs font-bold text-[#556B2F] tracking-widest uppercase mt-2">
            Select between 3 and 5 reading vectors to configure your shelf
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[#B66A50]/10 border border-[#B66A50]/20 rounded-xl text-center text-xs font-medium text-[#B66A50] animate-pulse">
            ⚠️ {error}
          </div>
        )}

        {/* Dynamic Matrix Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
          {AVAILABLE_INTERESTS.map((genre) => {
            const isChecked = selected.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                onClick={() => handleToggle(genre)}
                className={`px-4 py-3 rounded-xl font-sans text-xs font-bold tracking-wider uppercase border text-center transition-all cursor-pointer active:scale-95 ${
                  isChecked
                    ? 'bg-[#556B2F] border-[#556B2F] text-[#F8F3EA] shadow-xs'
                    : 'bg-[#F8F3EA]/40 border-[#3E3024]/10 text-[#3E3024]/70 hover:bg-[#F3E6D0]'
                }`}
              >
                {genre} {isChecked && "✓"}
              </button>
            );
          })}
        </div>

        {/* Submission Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[#3E3024]/5 mt-8 gap-4">
          <p className="font-serif text-xs italic text-[#3E3024]/40">
            Selected: <span className="font-sans font-bold not-italic text-[#B66A50]">{selected.length} / 5</span> core shelves chosen
          </p>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || selected.length < 3}
            className="w-full sm:w-auto font-sans px-8 py-3.5 rounded-full bg-[#556B2F] text-[#F8F3EA] font-bold text-xs tracking-wider uppercase shadow-md hover:bg-[#435524] disabled:bg-[#A3B18A] disabled:scale-100 transition-all active:scale-98 cursor-pointer"
          >
            {isSubmitting ? "Locking Matrix..." : "Inscribe & Proceed →"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;