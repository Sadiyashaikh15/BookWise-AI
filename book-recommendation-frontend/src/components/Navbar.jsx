/**
 * Navbar.jsx — BookWise Global Navigation Architecture (Context & Sign-out Sync Fixed)
 * Stack: React + Tailwind v4 + Native CSS Micro-Interactions
 */

import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Directly wiring to your real live application UserContext
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    console.log('Sealing registers and clearing secure tokens...');
    
    // 1. ब्राउज़र के स्टोरेज से टोकन और यूजर डेटा को पूरी तरह साफ़ करें
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('bookwise_user');
    
    // 2. कॉन्टेक्स्ट स्टेट को साफ़ करने के लिए logout() को कॉल करें
    if (logout) {
      logout();
    }
    
    // 3. मोबाइल मेनू खुला हो तो उसे बंद करें
    setIsMobileMenuOpen(false);

    // 4. यूजर को तुरंत वापस होम/लॉगिन थ्रेसहोल्ड पर भेजें
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F3EA]/90 backdrop-blur-md border-b border-[#3E3024]/5 py-4 px-6 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Main Logo Block */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <span className="text-xl transition-transform group-hover:rotate-12 duration-300">📜</span>
          <span className="font-serif font-black text-xl text-[#3E3024] tracking-tight">
            Book<span className="text-[#556B2F]">Wise</span>
          </span>
        </Link>

        {/* ─── DESKTOP NAVIGATION LINKS ────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-8">
          {!user ? (
            // Public Dynamic Menu Links
            <>
              {['Shelves', 'Method', 'Journal', 'FAQ'].map((link) => (
                <a
                  key={link}
                  href={`/#${link.toLowerCase().replace(/\s/g, '-')}`}
                  className="font-sans text-xs font-bold text-[#3E3024]/70 hover:text-[#3E3024] tracking-widest uppercase relative py-1 navbar-ink-underline transition-colors"
                >
                  {link}
                </a>
              ))}
            </>
          ) : (
            // Protected Logged In Links
            <>
              {[
                { name: 'Dashboard', path: '/dashboard', icon: '📖' },
                { name: 'Library', path: '/library', icon: '🪵' }, 
                { name: 'Favorites', path: '/favorites', icon: '❤️' },
                { name: 'Diary Profile', path: '/profile', icon: '🌸' },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-sans text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 py-1 relative navbar-ink-underline transition-colors ${
                    location.pathname === link.path ? 'text-[#B66A50]' : 'text-[#3E3024]/70 hover:text-[#3E3024]'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </>
          )}
        </div>

        {/* ─── ACTION ACCESS CORNER ────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-5">
          {!user ? (
            <>
              <Link to="/login" className="font-sans text-xs font-bold text-[#3E3024]/70 hover:text-[#3E3024] transition-colors">
                Sign In
              </Link>
              <Link to="/login" className="font-sans text-xs font-bold px-4 py-2.5 rounded-full bg-[#556B2F] text-[#F8F3EA] hover:bg-[#435524] transition-all shadow-sm active:scale-98">
                Enter Sanctuary
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4 border-l border-[#3E3024]/10 pl-4">
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-[#F3E6D0] border border-[#3E3024]/10 flex items-center justify-center font-serif text-xs font-bold text-[#3E3024] shadow-2xs group-hover:bg-[#A3B18A]/20 transition-colors">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
                </div>
                <span className="font-sans text-xs font-bold text-[#3E3024]/80 group-hover:text-[#3E3024] transition-colors max-w-[80px] truncate">
                  {user.name || 'Reader'}
                </span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="font-sans text-[10px] font-bold text-[#B66A50] hover:text-[#A25B42] uppercase tracking-wider bg-[#B66A50]/5 border border-[#B66A50]/10 px-2.5 py-1 rounded-md cursor-pointer transition-all active:scale-95"
              >
                Seal Journal
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg border border-[#3E3024]/10 text-[#3E3024]/80 hover:text-[#3E3024] cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Flyout mobile wrapper overlay sheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#3E3024]/5 space-y-3">
          {!user ? (
            <>
              {['Shelves', 'Method', 'Journal', 'FAQ'].map((link) => (
                <a
                  key={link}
                  href={`/#${link.toLowerCase().replace(/\s/g, '-')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-sans text-xs font-bold text-[#3E3024]/70 hover:text-[#3E3024] uppercase tracking-wider py-1.5"
                >
                  {link}
                </a>
              ))}
            </>
          ) : (
            <>
              {[
                { name: 'Dashboard', path: '/dashboard', icon: '📖' },
                { name: 'Library', path: '/library', icon: '🪵' }, // Fixed: Corrected path from '/home' to '/library'
                { name: 'Favorites', path: '/favorites', icon: '❤️' },
                { name: 'Diary Profile', path: '/profile', icon: '🌸' },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block font-sans text-xs font-bold uppercase tracking-wider py-1.5 flex items-center gap-2 ${
                    location.pathname === link.path ? 'text-[#B66A50]' : 'text-[#3E3024]/70'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left font-sans text-xs font-bold text-[#B66A50] uppercase tracking-wider py-1.5 flex items-center gap-2 cursor-pointer"
              >
                <span>🚪</span> Seal Journal (Logout)
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        .navbar-ink-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 1.5px;
          background-color: #B66A50;
          transition: width 0.3s ease, left 0.3s ease;
        }
        .navbar-ink-underline:hover::after {
          width: 80%;
          left: 10%;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;