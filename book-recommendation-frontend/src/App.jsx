import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';

// Redirects logged-in users away from /login and /signup
const GuestRoute = ({ children }) => {
  const { user, isLoading } = useContext(UserContext);
  if (isLoading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Redirects guests away from protected pages
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(UserContext);
  if (isLoading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/onboarding" element={<Onboarding />} />
        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/book/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
