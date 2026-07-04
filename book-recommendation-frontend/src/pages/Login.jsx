/**
 * Login.jsx — BookWise Functional Auth Sanctuary (Full State & JWT Integration)
 * Stack: React + Tailwind v4 + Native CSS Keyframes
 * Integration: Live context management handling password hashing and JWT token storage
 */

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const DesignSystemTitle = ({ serifText, sansSub }) => (
  <div className="text-center mb-6">
    <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#3E3024] tracking-tight">
      {serifText}
    </h2>
    {sansSub && (
      <p className="font-sans text-xs font-bold text-[#556B2F] tracking-widest uppercase mt-2">
        {sansSub}
      </p>
    )}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(UserContext); // Updated hook identifier directly pointing to unified context execution
  
  // Tab Management state
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form Bindings supporting cohesive single-state tracking with password capabilities
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  // ─── AUTHENTICATED ACCESS API FORM EXECUTION (POST /api/auth/login) ───────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginData.email.trim() || !loginData.password) {
      setError('Please populate both email and password rows.');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: loginData.email.trim(),
          password: loginData.password
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'User not found. Please verify your credentials.');
        return;
      }

      // Pass user payload and token footprint cleanly up into state memory management
      handleLogin(data.user, data.token);
      
      // Route reader straight into the active analytical companion spaces
      navigate('/dashboard');
    } catch (err) {
      setError('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── NEW READER BOOKSHELF ARCHIVE CREATION (POST /api/auth/signup) ──────────────
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (!signupData.email.trim() || !signupData.name.trim() || !signupData.password) {
      setError('Please populate all ledger information rows.');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passcode rows do not align.');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: signupData.name.trim(),
          email: signupData.email.trim(),
          password: signupData.password
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to instantiate bookshelf registry account.');
        return;
      }

      // Log user session variables securely from registration responses
      handleLogin(data.user, data.token);
      
      // Route fresh readers straight into the affinity chamber onboarding matrix
      navigate('/onboarding');
    } catch (err) {
      setError('Could not contact archival backend servers.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F3EA] min-h-screen text-[#3E3024] font-sans antialiased flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#A3B18A]/30">
      
      {/* Decorative Grid Line Textures */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(rgba(62,48,36,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(62,48,36,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />
      
      {/* Background Floating Elements */}
      <div className="absolute top-12 left-12 text-3xl opacity-15 select-none animation-float">🌿</div>
      <div className="absolute bottom-16 right-16 text-3xl opacity-15 select-none animation-float-delayed">✨</div>
      <div className="absolute top-1/4 right-12 text-2xl opacity-10 select-none -rotate-12">🕯️</div>

      {/* Return Navigation Anchor Link */}
      <Link to="/" className="absolute top-6 left-6 inline-flex items-center gap-2 font-sans text-xs font-bold text-[#3E3024]/60 hover:text-[#3E3024] tracking-wider uppercase transition-colors group z-20">
        <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Return to Foyer
      </Link>

      {/* Main Parchment Workspace Card */}
      <div className="w-full max-w-md bg-[#FFFDF8] border border-[#3E3024]/10 rounded-2xl shadow-xl p-8 sm:p-10 relative mt-4">
        
        {/* Dual Tab Toggle System */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`px-5 py-2 font-serif text-sm font-bold rounded-t-lg border-b-2 transition-all duration-300 cursor-pointer ${
              activeTab === 'login' 
                ? 'border-[#B66A50] text-[#B66A50] bg-[#F3E6D0]/30' 
                : 'border-transparent text-[#3E3024]/40 hover:text-[#3E3024]'
            }`}
          >
            Returning Reader
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setError(''); }}
            className={`px-5 py-2 font-serif text-sm font-bold rounded-t-lg border-b-2 transition-all duration-300 cursor-pointer ${
              activeTab === 'signup' 
                ? 'border-[#B66A50] text-[#B66A50] bg-[#F3E6D0]/30' 
                : 'border-transparent text-[#3E3024]/40 hover:text-[#3E3024]'
            }`}
          >
            New Bookshelf Space
          </button>
        </div>

        {activeTab === 'login' ? (
          <DesignSystemTitle serifText="Welcome back, Reader" sansSub="Unlock Your Register" />
        ) : (
          <DesignSystemTitle serifText="Claim your shelf space" sansSub="Begin Your Reading Journey" />
        )}

        {/* Decorative Desk Doodles */}
        <div className="flex justify-center items-end gap-12 mb-6 opacity-90 border-b border-[#3E3024]/5 pb-5">
          <div className="relative flex items-end">
            <div className="absolute -top-5 left-1.5 flex flex-col gap-0.5 opacity-40 animate-pulse">
              <div className="w-0.5 h-1.5 bg-[#6F4E37] rounded-full blur-[1px] rotate-12" />
              <div className="w-0.5 h-1.5 bg-[#6F4E37] rounded-full blur-[1px] -rotate-12 ml-0.5" />
            </div>
            <div className="w-6 h-6 bg-[#FFFDF8] border-2 border-[#6F4E37] rounded-b-lg rounded-tr-xs relative flex items-center justify-center">
              <div className="absolute -right-1.5 top-1 w-2 h-3 border-2 border-[#6F4E37] rounded-r-full border-l-0" />
              <div className="w-3 h-3 bg-[#6F4E37] rounded-full scale-75" />
            </div>
          </div>

          <div className="flex gap-1 opacity-40 scale-90">
            <div className="w-4 h-4 rounded-full border border-[#3E3024] bg-transparent" />
            <div className="w-1.5 h-px bg-[#3E3024] self-center" />
            <div className="w-4 h-4 rounded-full border border-[#3E3024] bg-transparent" />
          </div>
        </div>

        {/* Live System Error Flags */}
        {error && (
          <div className="mb-6 p-3 bg-[#B66A50]/10 border border-[#B66A50]/20 rounded-xl text-center text-xs font-medium text-[#B66A50]">
            {error}
          </div>
        )}

        {/* ─── RENDERED ACCESS SHEETS: LOGIN VIEW ───────────────────────────────── */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block font-sans text-[10px] font-bold text-[#3E3024]/60 uppercase tracking-widest mb-1.5 pl-1">
                Library Email Address
              </label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                placeholder="sadiya@email.com"
                className="w-full bg-[#F8F3EA]/50 border border-[#3E3024]/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#3E3024] focus:outline-hidden focus:border-[#556B2F] focus:bg-[#FFFDF8] transition-all font-medium placeholder-[#3E3024]/30 shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] font-bold text-[#3E3024]/60 uppercase tracking-widest mb-1.5 pl-1">
                Secret Access Passcode
              </label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                placeholder="••••••••"
                className="w-full bg-[#F8F3EA]/50 border border-[#3E3024]/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#3E3024] focus:outline-hidden focus:border-[#556B2F] focus:bg-[#FFFDF8] transition-all font-medium placeholder-[#3E3024]/30 shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 font-sans py-3.5 rounded-full bg-[#556B2F] text-[#F8F3EA] font-bold text-xs tracking-wider uppercase shadow-md hover:bg-[#435524] disabled:bg-[#A3B18A] transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? 'Consulting Ledger...' : 'Open My Journal'}
            </button>
          </form>
        )}

        {/* ─── RENDERED ACCESS SHEETS: SIGNUP VIEW ──────────────────────────────── */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block font-sans text-[10px] font-bold text-[#3E3024]/60 uppercase tracking-widest mb-1.5 pl-1">
                Reader's Call Name
              </label>
              <input
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                required
                placeholder="Your name or pen name"
                className="w-full bg-[#F8F3EA]/50 border border-[#3E3024]/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#3E3024] focus:outline-hidden focus:border-[#556B2F] focus:bg-[#FFFDF8] transition-all font-medium placeholder-[#3E3024]/30 shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] font-bold text-[#3E3024]/60 uppercase tracking-widest mb-1.5 pl-1">
                Library Email Address
              </label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                required
                placeholder="reader@library.com"
                className="w-full bg-[#F8F3EA]/50 border border-[#3E3024]/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#3E3024] focus:outline-hidden focus:border-[#556B2F] focus:bg-[#FFFDF8] transition-all font-medium placeholder-[#3E3024]/30 shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] font-bold text-[#3E3024]/60 uppercase tracking-widest mb-1.5 pl-1">
                Choose Secure Password
              </label>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
                placeholder="Minimum 6 characters"
                className="w-full bg-[#F8F3EA]/50 border border-[#3E3024]/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#3E3024] focus:outline-hidden focus:border-[#556B2F] focus:bg-[#FFFDF8] transition-all font-medium placeholder-[#3E3024]/30 shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] font-bold text-[#3E3024]/60 uppercase tracking-widest mb-1.5 pl-1">
                Confirm Selected Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                required
                placeholder="Re-type your password"
                className="w-full bg-[#F8F3EA]/50 border border-[#3E3024]/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#3E3024] focus:outline-hidden focus:border-[#556B2F] focus:bg-[#FFFDF8] transition-all font-medium placeholder-[#3E3024]/30 shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 font-sans py-3.5 rounded-full bg-[#B66A50] text-[#FFFDF8] font-bold text-xs tracking-wider uppercase shadow-md hover:bg-[#A25B42] disabled:bg-[#A3B18A] transition-all duration-300 active:scale-98 cursor-pointer"
            >
              {isLoading ? 'Inscribing Log...' : 'Instantiate Bookshelf'}
            </button>
          </form>
        )}

        {/* Quick Access Ledger Box */}
        <div className="mt-6 p-4 bg-[#F3E6D0]/40 border border-[#3E3024]/10 rounded-xl text-center">
          <p className="text-[10px] font-bold text-[#556B2F] uppercase tracking-wider mb-1">
            ✦ Quick Access Ledger Spot
          </p>
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'login') setLoginData({ email: 'sadiya@email.com', password: 'Sadiya123' });
              else setSignupData({ name: 'Sadiya Shaikh', email: 'sadiya@email.com', password: 'Sadiya123', confirmPassword: 'Sadiya123' });
              setError('');
            }}
            className="text-xs text-[#B66A50] hover:text-[#A25B42] font-mono font-bold hover:underline transition-colors cursor-pointer"
          >
            sadiya@email.com (Pass: Sadiya123)
          </button>
        </div>

      </div>

      <p className="mt-8 font-serif text-xs italic text-[#3E3024]/40 max-w-xs text-center leading-relaxed">
        "A room without books is like a body without a soul." — Cicero
      </p>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700&display=swap');
        
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }

        @keyframes microFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animation-float { animation: microFloat 4.5s ease-in-out infinite; }
        .animation-float-delayed { animation: microFloat 4.5s ease-in-out infinite; animation-delay: 2.2s; }
      `}</style>
    </div>
  );
};

export default Login;