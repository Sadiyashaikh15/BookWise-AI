/**
 * src/services/bookService.js
 * BookWise API Client Service Wrapper
 * Handles database interaction registers via secure authenticated fetch cycles.
 */

const BASE_URL = 'http://localhost:5000/api';

/**
 * Helper utility to safely grab the current active token footprint from local registers
 * and cleanly format standard headers.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/**
 * Helper utility to normalize and evaluate response structures cleanly
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Access denied or network breakdown: Status ${response.status}`);
  }
  return response.json();
};

// ─── PUBLIC / PROTECTED CORE LEDGER ACTIONS ─────────────────────────────────

export const getAllBooks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/books`, {
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching all volumes from library logs:', error.message);
    throw error;
  }
};

export const getBook = async (id) => {
  try {
    // 🔒 Added getAuthHeaders() to clear security barriers smoothly
    const response = await fetch(`${BASE_URL}/books/${id}`, {
      method: 'GET',
      headers: getAuthHeaders() 
    });
    
    const data = await handleResponse(response);
    
    // 💡 Auto-normalization fallback: If the backend wraps it in { book }, unwrap it. 
    // Otherwise, return the flat raw object directly. Prevents 404 UI failures!
    return data && data.book ? data.book : data;
  } catch (error) {
    console.error(`Error fetching detailed book record for volume #${id}:`, error.message);
    throw error;
  }
};

export const getRelatedBooks = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}/related`, {
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching peripheral shelf items for volume #${id}:`, error.message);
    throw error;
  }
};

// ─── TOKEN GUARDED SECURE ACTIONS ───────────────────────────────────────────

export const getRecommendations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/recommendations`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error compiling custom recommendations engine data payload:', error.message);
    throw error;
  }
};

export const getFavorites = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/favorites/${userId || 1}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error reading vaulted favorites list logic block:`, error.message);
    throw error;
  }
};

export const addFavorite = async (userId, bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/vault/save`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ book_id: bookId, saved_reason: 'Self Growth' }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error anchoring volume #${bookId} into secure crypt parameters:`, error.message);
    throw error;
  }
};

export const removeFavorite = async (userId, bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/favorites/${bookId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error dropping volume #${bookId} from active session records:`, error.message);
    throw error;
  }
};