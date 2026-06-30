/**
 * src/services/bookService.js
 * BookWise API Client Service Wrapper
 * Handles database interaction registers via standard fetch cycles.
 */

const BASE_URL = 'http://localhost:5000/api';

/**
 * Helper utility to normalize and evaluate response structures cleanly
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API communication error: Status ${response.status}`);
  }
  return response.json();
};

export const getAllBooks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/books`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching all volumes from library logs:', error.message);
    throw error;
  }
};

export const getBook = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching detailed book record for volume #${id}:`, error.message);
    throw error;
  }
};

export const getRelatedBooks = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}/related`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching peripheral shelf items for volume #${id}:`, error.message);
    throw error;
  }
};

export const getRecommendations = async (userId) => {
  try {
    // Falls back to general catalog arrays if userId state isn't initialized yet
    const url = userId ? `${BASE_URL}/recommendations/${userId}` : `${BASE_URL}/books`;
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error compiling custom recommendations log for user #${userId}:`, error.message);
    throw error;
  }
};

export const getFavorites = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/favorites/${userId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error reading vaulted favorites list for user #${userId}:`, error.message);
    throw error;
  }
};

export const addFavorite = async (userId, bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, book_id: bookId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error anchoring volume #${bookId} into user #${userId}'s bookshelf cabinet:`, error.message);
    throw error;
  }
};

export const removeFavorite = async (userId, bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/favorites/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error dropping volume #${bookId} from user #${userId}'s active indices:`, error.message);
    throw error;
  }
};