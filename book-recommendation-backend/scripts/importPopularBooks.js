/**
 * book-recommendation-backend/scripts/importPopularBooks.js
 * Optimized, production-ready dataset pipeline.
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');

// ─── CONFIGURATIONS & RESOLUTIONS ──────────────────────────────────────────
const DB_PATH = path.join(__dirname, '../database/bookwise.db');
const RATINGS_CSV_PATH = path.join(__dirname, '../../datasets/Ratings.csv');
const BOOKS_CSV_PATH = path.join(__dirname, '../../datasets/Books.csv');

// Track runtime performance metrics
const summary = {
  totalRatingsProcessed: 0,
  uniqueIsbnsFound: 0,
  booksMatched: 0,
  booksImported: 0,
  startTime: Date.now()
};

// ─── UTILITY: CLEAN VALUES SAFELY ───────────────────────────────────────────
const sanitizeValue = (val) => {
  if (val === undefined || val === null) return null;
  const cleaned = val.toString().trim().replace(/^["']|["']$/g, '');
  return cleaned === '' ? null : cleaned;
};

// ─── PIPELINE STEP 1: PARSE RATINGS & MAP HIGHEST COUNT VOLUMES ──────────────
const extractPopularIsbns = () => {
  return new Promise((resolve, reject) => {
    console.log('Reading Ratings.csv...');
    const frequencyMap = new Map();

    const readStream = fs.createReadStream(RATINGS_CSV_PATH);
    
    readStream.on('error', (err) => {
      reject(new Error(`Failed to read Ratings.csv file stream: ${err.message}`));
    });

    readStream
      .pipe(csv())
      .on('data', (row) => {
        summary.totalRatingsProcessed++;
        
        // Normalize checking across header naming conventions (ISBN, Book-ISBN, etc.)
        const rawIsbn = row.ISBN || row['Book-ISBN'] || row['book_isbn'];
        const isbn = sanitizeValue(rawIsbn);
        
        if (isbn) {
          frequencyMap.set(isbn, (frequencyMap.get(isbn) || 0) + 1);
        }

        if (summary.totalRatingsProcessed % 500000 === 0) {
          console.log(`Processed ${summary.totalRatingsProcessed} ratings...`);
        }
      })
      .on('end', () => {
        summary.uniqueIsbnsFound = frequencyMap.size;
        
        // Isolate top 2000 books based strictly on rating presence frequency
        const topIsbns = Array.from(frequencyMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2000)
          .map(([isbn]) => isbn);

        resolve(new Set(topIsbns));
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

// ─── PIPELINE STEP 2: STREAM AND INSERT MATCHED ENTRIES VIA TRANSACTIONS ───
const streamAndInsertMatchedBooks = (db, topIsbnsSet) => {
  return new Promise((resolve, reject) => {
    console.log('Reading Books.csv...');
    
    const insertQuery = `
      INSERT OR IGNORE INTO books (
        isbn, title, author, publisher, year, image_url,
        description, genre, pages, language, rating
      ) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL, NULL)
    `;

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      const stmt = db.prepare(insertQuery, (err) => {
        if (err) {
          db.run('ROLLBACK');
          return reject(new Error(`Failed to compile prepared insertion profile statement: ${err.message}`));
        }
      });

      const processedIsbns = new Set();
      const readStream = fs.createReadStream(BOOKS_CSV_PATH);

      readStream.on('error', (err) => {
        db.run('ROLLBACK');
        reject(new Error(`Failed to stream Books.csv files: ${err.message}`));
      });

      readStream
        .pipe(csv())
        .on('data', (row) => {
          const isbn = sanitizeValue(row.ISBN || row['Book-ISBN'] || row['book_isbn']);
          
          if (isbn && topIsbnsSet.has(isbn)) {
            summary.booksMatched++;

            if (!processedTabIsolator(isbn)) {
              processedIsbns.add(isbn);
              
              // Map incoming data safely, handling common standard naming formats
              const title = sanitizeValue(row.Title || row['Book-Title'] || row.title);
              const author = sanitizeValue(row.Author || row['Book-Author'] || row.author);
              const publisher = sanitizeValue(row.Publisher || row.publisher);
              
              const rawYear = row.Year || row['Year-Of-Publication'] || row.year;
              let year = parseInt(rawYear, 10);
              if (isNaN(year) || year <= 0) year = null;

              const imageUrl = sanitizeValue(row['Image-URL-L'] || row['Image-URL-M'] || row.image_url || row.cover_image);

              stmt.run([isbn, title, author, publisher, year, imageUrl], function(err) {
                if (err) {
                  console.error(`Skipping row issue on compiled registry identifier #${isbn}: ${err.message}`);
                } else if (this.changes > 0) {
                  summary.booksImported++;
                  if (summary.booksImported % 100 === 0) {
                    console.log(`Imported ${summary.booksImported} books...`);
                  }
                }
              });
            }
          }
        })
        .on('end', () => {
          stmt.finalize((err) => {
            if (err) {
              db.run('ROLLBACK');
              return reject(err);
            }
            
            db.run('COMMIT', (commitErr) => {
              if (commitErr) {
                db.run('ROLLBACK');
                return reject(commitErr);
              }
              console.log('Finished.');
              resolve();
            });
          });
        })
        .on('error', (err) => {
          stmt.finalize();
          db.run('ROLLBACK');
          reject(err);
        });

      function processedTabIsolator(isbn) {
        return processedIsbns.has(isbn);
      }
    });
  });
};

// ─── MAIN EXECUTION SCHEDULER CONTROLLER ────────────────────────────────────
const executeImportPipeline = async () => {
  let db;
  try {
    const topIsbnsSet = await extractPopularIsbns();

    db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        throw new Error(`Failed to bind targeted working bookwise.db catalog file: ${err.message}`);
      }
    });

    // Enforce high performance journal modes for quick operational writing updates
    db.run('PRAGMA synchronous = OFF');
    db.run('PRAGMA journal_mode = MEMORY');

    await streamAndInsertMatchedBooks(db, topIsbnsSet);

    const timeTaken = ((Date.now() - summary.startTime) / 1000).toFixed(2);

    console.log('\n--- Final Summary ---');
    console.log(`Total ratings processed: ${summary.totalRatingsProcessed}`);
    console.log(`Unique ISBNs:           ${summary.uniqueIsbnsFound}`);
    console.log(`Books matched:          ${summary.booksMatched}`);
    console.log(`Books imported:         ${summary.booksImported}`);
    console.log(`Time taken:             ${timeTaken} seconds`);

  } catch (error) {
    console.error('\nFatal runtime parsing abort exception:', error.message);
    process.exitCode = 1;
  } finally {
    if (db) {
      db.close((err) => {
        if (err) console.error('Error closing archival register instance database:', err.message);
      });
    }
  }
};

executeImportPipeline();