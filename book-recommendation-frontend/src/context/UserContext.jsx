/**
 * UserContext.jsx — Session Identity Control Matrix
 * Stores and monitors active cryptographic token footprints securely.
 */

import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // If a token string is present on initialization, trust the session context locally
    const savedUser = localStorage.getItem('bookwise_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Malformed state entry, resetting cache:", e);
        handleLogout();
      }
    }
    setAuthLoading(false);
  }, [token]);

  // Handle successful login or registration sequences
  const handleLogin = (userPayload, tokenPayload) => {
    localStorage.setItem('jwt_token', tokenPayload);
    localStorage.setItem('bookwise_user', JSON.stringify(userPayload));
    setToken(tokenPayload);
    setUser(userPayload);
  };

  // Completely wipe session signatures on exit
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('bookwise_user');
    setToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, token, authLoading, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};