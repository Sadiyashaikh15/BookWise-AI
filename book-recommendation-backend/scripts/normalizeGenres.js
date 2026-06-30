/**
 * scripts/normalizeGenres.js
 * Automated lookup mapping translation matrix to fix Issue 2
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/bookwise.db');

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
});

const PREDEFINED_GENRES = [
  "Fiction", "Fantasy", "Science Fiction", "Romance", "Mystery", "Thriller", 
  "Horror", "Historical Fiction", "Biography", "History", "Business", "Finance", 
  "Programming", "Technology", "Psychology", "Self Help", "Productivity", 
  "Philosophy", "Science", "Children", "Young Adult", "Poetry", "Classics"
];

const matchNormalizedGenre = (rawSubjectsString, currentGenre) => {
  // Combine subjects and existing messy genre for a broader search haystack
  const searchHaystack = `${rawSubjectsString || ''} ${currentGenre || ''}`.toLowerCase();

  if (searchHaystack.includes("computer") || searchHaystack.includes("programming") || searchHaystack.includes("software") || searchHaystack.includes("coding") || searchHaystack.includes("javascript")) return "Programming";
  if (searchHaystack.includes("finance") || searchHaystack.includes("investing") || searchHaystack.includes("money") || searchHaystack.includes("economics")) return "Finance";
  if (searchHaystack.includes("business") || searchHaystack.includes("management") || searchHaystack.includes("marketing") || searchHaystack.includes("leadership")) return "Business";
  if (searchHaystack.includes("historical") || searchHaystack.includes("biography") || searchHaystack.includes("memoir") || searchHaystack.includes("autobiography")) return "Biography";
  if (searchHaystack.includes("history") || searchHaystack.includes("civilization") || searchHaystack.includes("war")) return "History";
  if (searchHaystack.includes("psychology") || searchHaystack.includes("mental") || searchHaystack.includes("brain")) return "Psychology";
  if (searchHaystack.includes("self-help") || searchHaystack.includes("habits") || searchHaystack.includes("motivation")) return "Self Help";
  if (searchHaystack.includes("productivity") || searchHaystack.includes("time management") || searchHaystack.includes("focus")) return "Productivity";
  if (searchHaystack.includes("philosophy") || searchHaystack.includes("ethics") || searchHaystack.includes("philosophers")) return "Philosophy";
  if (searchHaystack.includes("young adult") || searchHaystack.includes("juvenile") || searchHaystack.includes("teenager") || searchHaystack.includes("teenage")) return "Young Adult";
  if (searchHaystack.includes("children") || searchHaystack.includes("kids") || searchHaystack.includes("fairy tales")) return "Children";
  if (searchHaystack.includes("poetry") || searchHaystack.includes("poems") || searchHaystack.includes("ballads")) return "Poetry";
  if (searchHaystack.includes("classics") || searchHaystack.includes("classical")) return "Classics";
  if (searchHaystack.includes("fantasy") || searchHaystack.includes("magic") || searchHaystack.includes("wizards")) return "Fantasy";
  if (searchHaystack.includes("science fiction") || searchHaystack.includes("futuristic") || searchHaystack.includes("space travel") || searchHaystack.includes("aliens")) return "Science Fiction";
  if (searchHaystack.includes("thriller") || searchHaystack.includes("suspense") || searchHaystack.includes("action")) return "Thriller";
  if (searchHaystack.includes("mystery") || searchHaystack.includes("detective") || searchHaystack.includes("crime") || searchHaystack.includes("police")) return "Mystery";
  if (searchHaystack.includes("horror") || searchHaystack.includes("ghost") || searchHaystack.includes("scary")) return "Horror";
  if (searchHaystack.includes("romance") || searchHaystack.includes("love") || searchHaystack.includes("romantic")) return "Romance";
  if (searchHaystack.includes("fiction") || searchHaystack.includes("literature") || searchHaystack.includes("stories") || searchHaystack.includes("novel")) return "Fiction";
  if (searchHaystack.includes("science") || searchHaystack.includes("physics") || searchHaystack.includes("chemistry") || searchHaystack.includes("biology") || searchHaystack.includes("nature")) return "Science";

  return "Other";
};

const normalizeDatabaseGenres = () => {
  db.all("SELECT id, genre, subjects FROM books", [], async (err, rows) => {
    if (err) {
      console.error("Error reading database:", err.message);
      db.close();
      return;
    }

    console.log(`🧹 Processing normalization for ${rows.length} volumes...`);
    
    db.serialize(() => {
      const stmt = db.prepare("UPDATE books SET genre = ? WHERE id = ?");
      
      let counts = {};
      
      rows.forEach((row) => {
        const cleanGenre = matchNormalizedGenre(row.subjects, row.genre);
        stmt.run(cleanGenre, row.id);
        counts[cleanGenre] = (counts[cleanGenre] || 0) + 1;
      });

      stmt.finalize();
      console.log("✅ Genre normalization complete! Distribution checklist:", counts);
      db.close();
    });
  });
};

normalizeDatabaseGenres();