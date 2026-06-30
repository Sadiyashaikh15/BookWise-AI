/**
 * scripts/enrichBooks.js
 * Full Production Script: Loops through all books and enriches them
 * includes 500ms rate-limiting delay and progress indicators.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const axios = require('axios');

const DB_PATH = path.join(__dirname, '../database/bookwise.db');

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
});

// Helper utilities for normalization
const parseLanguage = (languages) => {
  if (!languages || !Array.isArray(languages) || languages.length === 0) return null;
  const rawUrl = languages[0].key || '';
  return rawUrl.split('/').pop().toUpperCase();
};

const parseSubjects = (subjects) => {
  if (!subjects || !Array.isArray(subjects)) return null;
  return subjects.slice(0, 6).map(s => s.name || s).join(', ');
};

// Promisified timeout helper for Step 8 (Delay)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const enrichAllBooks = async () => {
  // 1. Fetch all books that need enrichment (where subjects column is still null)
  db.all('SELECT id, isbn, title FROM books WHERE subjects IS NULL', [], async (err, rows) => {
    if (err) {
      console.error('Error fetching catalog rows:', err.message);
      db.close();
      return;
    }

    const totalBooks = rows.length;
    if (totalBooks === 0) {
      console.log('✨ All volumes inside the active database are already enriched!');
      db.close();
      return;
    }

    console.log(`📚 Found ${totalBooks} books requiring metadata enrichment. Starting batch process...`);

    // 2. Loop through every book one by one (Step 5)
    for (let i = 0; i < totalBooks; i++) {
      const { id, isbn, title } = rows[i];
      const currentProgress = i + 1;

      // Step 9: Progress printing inside terminal console
      console.log(`\n============== Processing [${currentProgress}/${totalBooks}] ==============`);
      console.log(`Volume: "${title}" (ID: ${id}, ISBN: ${isbn})`);

      if (!isbn) {
        console.log('⚠️ Missing ISBN signature. Marking as evaluated.');
        db.run('UPDATE books SET subjects = "" WHERE id = ?', [id]);
        continue;
      }

      const cleanIsbn = isbn.trim();
      const apiUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`;

      try {
        // Step 6: Call Open Library API
        const response = await axios.get(apiUrl, { timeout: 6000 });
        const dataKey = `ISBN:${cleanIsbn}`;
        const bookMetadata = response.data[dataKey];

        if (!bookMetadata) {
          console.log(`❌ No records found on Open Library API matching registry.`);
          // Set to empty string so it doesn't get picked up again next time
          db.run('UPDATE books SET subjects = "" WHERE id = ?', [id]);
          
          // Step 8: Still wait to prevent spamming
          await sleep(500);
          continue;
        }

        // Parse metrics cleanly
        const pages = bookMetadata.number_of_pages || bookMetadata.pagination || null;
        const subjectsStr = parseSubjects(bookMetadata.subjects);
        const languageStr = parseLanguage(bookMetadata.languages);
        const primaryGenre = bookMetadata.subjects && bookMetadata.subjects.length > 0 
          ? bookMetadata.subjects[0].name || bookMetadata.subjects[0] 
          : null;
        const descriptionText = bookMetadata.notes || null;

        // Step 7: Update records back into SQLite
        const updateQuery = `
          UPDATE books 
          SET genre = COALESCE(genre, ?), 
              subjects = ?, 
              pages = ?, 
              language = ?, 
              description = COALESCE(description, ?)
          WHERE id = ?
        `;

        await new Promise((resolve) => {
          db.run(updateQuery, [primaryGenre, subjectsStr, pages, languageStr, descriptionText, id], function(updateErr) {
            if (updateErr) console.error(`Failed to update book ID ${id}:`, updateErr.message);
            else console.log(`✅ Database row updated successfully.`);
            resolve();
          });
        });

      } catch (apiErr) {
        console.error(`⚠️ Network/API issue on item ID ${id}:`, apiErr.message);
      }

      // Step 8: Wait 500ms between requests to be gentle on Open Library servers
      console.log(`⏱️ Waiting 500ms before next volume...`);
      await sleep(500);
    }

    console.log('\n🏁 Batch processing cycle completed configuration registries!');
    db.close();
  });
};

// Start execution
enrichAllBooks();