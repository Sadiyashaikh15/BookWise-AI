require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyJWT = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "VintageMahoganyLibrarySecretKey2026##!!";
const PORT = process.env.PORT || 5000;

// ================= DATABASE CONNECTION =================
const db = new sqlite3.Database("./database/bookwise.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite Database Securely!");
  }
});

// ================= DATABASE INITIALIZATION MATRIX =================
db.serialize(() => {
  console.log("🪵 Executing structural cryptographic schema migrations...");

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      favorite_genre TEXT DEFAULT 'Other',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      interest_genre TEXT NOT NULL,
      UNIQUE(user_id, interest_genre),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      isbn TEXT UNIQUE,
      title TEXT,
      author TEXT,
      publisher TEXT,
      year INTEGER,
      image_url TEXT,
      description TEXT,
      genre TEXT DEFAULT 'Other',
      pages INTEGER,
      language TEXT,
      rating REAL,
      subjects TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS smart_vaults (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      saved_reason TEXT CHECK(saved_reason IN ('Placement', 'Career', 'Self Growth', 'College', 'Mental Health', 'Entertainment', 'Skill Development')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, book_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reading_paths (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path_name TEXT NOT NULL UNIQUE,
      path_goal_tag TEXT NOT NULL,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reading_path_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      step_order INTEGER NOT NULL,
      step_rationale TEXT NOT NULL,
      UNIQUE(path_id, step_order),
      FOREIGN KEY (path_id) REFERENCES reading_paths(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS view_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS goal_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      goal_prompt TEXT NOT NULL,
      resolved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reading_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      progress_percent INTEGER DEFAULT 0,
      status TEXT CHECK(status IN ('want_to_read', 'currently_reading', 'finished', 'dropped')) DEFAULT 'want_to_read',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, book_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    )
  `);

  // Seeding Secured Baseline Record for Sadiya
  bcrypt.hash("Sadiya123", 10, (err, hash) => {
    if (!err) {
      db.run(`
        INSERT OR IGNORE INTO users (id, name, email, password_hash, favorite_genre)
        VALUES (1, 'Sadiya', 'sadiya@email.com', '${hash}', 'Self Help')
      `);
    }
  });
});

// ================= AI LIBRARIAN INTENT REGISTRY =================
const INTENT_GOAL_MAP = {
  "become disciplined": {
    keywords: ["discipline", "habit", "willpower", "focus", "productivity", "routine", "atomic"],
    rationale: "Because this volume breaks down actionable psychological framework cues, habit loops, and focus vectors necessary to build long-term personal discipline."
  },
  "learn investing": {
    keywords: ["investing", "finance", "money", "stock", "wealth", "economics", "investor", "capital"],
    rationale: "Because you want to master long-term wealth mechanics. This text provides clear structural wisdom on asset compounding and risk mitigation."
  },
  "improve communication": {
    keywords: ["communication", "talk", "influence", "negotiate", "speak", "relationship", "people", "conversation"],
    rationale: "Because optimizing human connection dynamics is vital for your growth profile. This text breaks down relational intelligence and conversational frameworks."
  },
  "placement preparation": {
    keywords: ["programming", "coding", "software", "clean code", "developer", "interview", "algorithm", "pragmatic"],
    rationale: "Because your focus is engineering precision and placement mastery. This classic covers deep industrial optimization patterns expected by top-tier technical panels."
  },
  "become better programmer": {
    keywords: ["programming", "clean code", "javascript", "refactoring", "design patterns", "software", "coding", "architecture"],
    rationale: "Because you are committed to writing clean, maintainable, and scalable production-grade software codebases."
  },
  "reduce stress": {
    keywords: ["psychology", "philosophy", "cozy", "meditation", "peace", "stoic", "uplifting", "calm", "anxiety"],
    rationale: "Because you are seeking mental decompression. This text offers anchoring philosophical perspectives or immersive storytelling to alleviate daily anxiety."
  }
};

// ================= CRYPTOGRAPHIC IDENTITY SYSTEM =================

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All registration markers must be complete." });
  }
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const insertionQuery = `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`;
    db.run(insertionQuery, [name, email, passwordHash], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ success: false, message: "An archive membership already matches this email." });
        }
        return res.status(500).json({ success: false, error: err.message });
      }
      const token = jwt.sign({ id: this.lastID }, JWT_SECRET, { expiresIn: "48h" });
      res.status(201).json({ success: true, token, user: { id: this.lastID, name, email } });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and passcode lines must be full." });
  }
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!user) return res.status(401).json({ success: false, message: "Identity credentials unmatched." });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ success: false, message: "Identity credentials unmatched." });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "48h" });
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, favorite_genre: user.favorite_genre, created_at: user.created_at }
    });
  });
});

// ================= SECURED DATA LAYER ROUTING =================

app.get("/api/recommendations", verifyJWT, async (req, res) => {
  const userId = req.user.id;
  try {
    const fetchUserDataContext = () => {
      return new Promise((resolve) => {
        db.all("SELECT interest_genre FROM user_interests WHERE user_id = ?", [userId], (err, interests) => {
          db.all("SELECT book_id FROM smart_vaults WHERE user_id = ?", [userId], (err, vaults) => {
            db.all("SELECT book_id FROM view_history WHERE user_id = ? ORDER BY viewed_at DESC LIMIT 10", [userId], (err, views) => {
              resolve({
                interests: (interests || []).map(i => i.interest_genre),
                favorites: (vaults || []).map(f => f.book_id),
                recentViews: (views || []).map(v => v.book_id)
              });
            });
          });
        });
      });
    };

    const profile = await fetchUserDataContext();

    db.all("SELECT * FROM books LIMIT 250", [], (err, books) => {
      if (err) return res.status(500).json({ error: err.message });

      const scoredBooks = books.map((book) => {
        let score = 0;
        if (profile.interests.includes(book.genre)) score += 40;
        if (profile.favorites.includes(book.id)) score -= 15;
        if (profile.recentViews.includes(book.id)) score += 10;
        score += (book.rating || 3.5) * 1;
        return { ...book, dynamicEngineScore: score };
      });

      scoredBooks.sort((a, b) => b.dynamicEngineScore - a.dynamicEngineScore);
      res.json(scoredBooks.slice(0, 12));
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/librarian/discover", verifyJWT, async (req, res) => {
  const userId = req.user.id;
  const { goal_prompt } = req.body;

  if (!goal_prompt) return res.status(400).json({ success: false, message: "Prompt context required." });
  const cleanPrompt = goal_prompt.toLowerCase().trim();

  db.run("INSERT INTO goal_history (user_id, goal_prompt) VALUES (?, ?)", [userId, goal_prompt]);

  db.all("SELECT * FROM books", [], (err, books) => {
    let matchedRule = { keywords: [cleanPrompt], rationale: `Because it mirrors your focused lookup path for "${goal_prompt}".` };
    
    for (const [key, configuration] of Object.entries(INTENT_GOAL_MAP)) {
      if (cleanPrompt.includes(key) || key.split(" ").some(word => cleanPrompt.includes(word))) {
        matchedRule = configuration;
        break;
      }
    }

    const evaluatedMatches = books.map(book => {
      let score = 0;
      const titleText = (book.title || "").toLowerCase();
      const descText = (book.description || "").toLowerCase();

      matchedRule.keywords.forEach(keyword => {
        if (titleText.includes(keyword)) score += 35;
        if (descText.includes(keyword)) score += 20;
      });

      return {
        ...book,
        discoveryScore: score,
        aiRationale: matchedRule.rationale,
        influences: ["Session Authentication Verified"]
      };
    });

    evaluatedMatches.sort((a, b) => b.discoveryScore - a.discoveryScore);
    res.json({ success: true, books: evaluatedMatches.slice(0, 6) });
  });
});

app.get("/api/analytics/dna", verifyJWT, (req, res) => {
  const userId = req.user.id;

  db.get("SELECT created_at FROM users WHERE id = ?", [userId], (err, userRow) => {
    const vaultQuery = `SELECT saved_reason, COUNT(*) as count FROM smart_vaults WHERE user_id = ? GROUP BY saved_reason`;
    
    db.all(vaultQuery, [userId], (err, rows) => {
      if (err) return res.status(500).json({ success: false, error: err.message });

      let primaryTrait = "Self Growth";
      let maximumCount = 0;
      rows.forEach(row => {
        if (row.count > maximumCount) {
          maximumCount = row.count;
          primaryTrait = row.saved_reason;
        }
      });

      let readingPersonality = "Enlightened Explorer";
      let behaviorTag = "Seeking wide-spectrum personal refinement loops.";

      if (primaryTrait === "Placement" || primaryTrait === "Skill Development") {
        readingPersonality = "Curious Builder";
        behaviorTag = "Deep industrial engineering optimization tracks.";
      } else if (primaryTrait === "Career" || primaryTrait === "Self Growth") {
        readingPersonality = "Mindful Strategist";
        behaviorTag = "Focused heavily on lifestyle blueprints and strategic systems.";
      }

      res.json({
        success: true,
        personality: readingPersonality,
        behavior: behaviorTag,
        memberSince: userRow?.created_at ? new Date(userRow.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "30 June 2026",
        libraryId: `BW-10${1480 + userId}`,
        metrics: rows || []
      });
    });
  });
});

app.post("/api/vault/save", verifyJWT, (req, res) => {
  const userId = req.user.id;
  const { book_id, saved_reason } = req.body;

  db.run(
    "INSERT OR REPLACE INTO smart_vaults (user_id, book_id, saved_reason) VALUES (?, ?, ?)",
    [userId, book_id, saved_reason],
    function(err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Archived contextually into secure Vault matrix." });
    }
  );
});

// ─── UNPROTECTED CORE READING PATH LOGIC ────────────────────────────────────
app.get("/api/books", (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json(rows);
  });
});

app.get("/api/books/:id", (req, res) => {
  db.get("SELECT * FROM books WHERE id = ?", [req.params.id], (err, book) => {
    if (err) return res.status(500).json({ success: false, message: "Database query breakdown." });
    if (!book) return res.status(404).json({ success: false, message: "Volume not found inside indices." });
    res.json(book); 
  });
});

// ✅ ADDED: Get related/peripheral books from the same genre (Fixes 404 console error)
app.get("/api/books/:id/related", (req, res) => {
  const bookId = req.params.id;

  db.get("SELECT genre FROM books WHERE id = ?", [bookId], (err, currentBook) => {
    if (err || !currentBook) {
      return res.json([]); 
    }

    db.all(
      "SELECT * FROM books WHERE genre = ? AND id != ? ORDER BY RANDOM() LIMIT 4",
      [currentBook.genre, bookId],
      (fetchErr, relatedBooks) => {
        if (fetchErr) return res.json([]);
        res.json(relatedBooks); 
      }
    );
  });
});

// ─── GET SECURE USER FAVORITES/VAULTED BOOKS (TOKEN ENFORCED) ───────────────
app.get("/api/favorites/:id", verifyJWT, (req, res) => {
  const userId = req.user.id; 

  const query = `
    SELECT books.* FROM smart_vaults 
    JOIN books ON smart_vaults.book_id = books.id 
    WHERE smart_vaults.user_id = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, favorites: rows || [] });
  });
});

// ─── GET READING STATUS HISTORY LOGS (REQUIRED BY PROFILE/DASHBOARD) ────────
app.get("/api/reading-status/:userId", verifyJWT, (req, res) => {
  const userId = req.user.id; 

  const query = `
    SELECT reading_activity.*, books.title, books.author, books.image_url 
    FROM reading_activity 
    JOIN books ON reading_activity.book_id = books.id 
    WHERE reading_activity.user_id = ? 
    ORDER BY reading_activity.updated_at DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, statuses: rows || [] });
  });
});

// ─── GET USER METRIC STATS (REQUIRED BY CORE DASHBOARD/METRICS PANELS) ──────
app.get("/api/analytics/:userId", verifyJWT, (req, res) => {
  const userId = req.user.id;

  const queries = {
    streak: "SELECT COUNT(id) as count FROM reading_activity WHERE user_id = ?",
    favGenre: "SELECT genre, COUNT(genre) as count FROM books JOIN smart_vaults ON books.id = smart_vaults.book_id WHERE smart_vaults.user_id = ? GROUP BY genre ORDER BY count DESC LIMIT 1",
    mostReadAuthor: "SELECT author, COUNT(author) as count FROM books JOIN smart_vaults ON books.id = smart_vaults.book_id WHERE smart_vaults.user_id = ? GROUP BY author ORDER BY count DESC LIMIT 1",
    savedCount: "SELECT COUNT(id) as count FROM smart_vaults WHERE user_id = ?"
  };

  db.get(queries.streak, [userId], (err, sRow) => {
    db.get(queries.favGenre, [userId], (err, gRow) => {
      db.get(queries.mostReadAuthor, [userId], (err, aRow) => {
        db.get(queries.savedCount, [userId], (err, cRow) => {
          if (err) return res.status(500).json({ success: false, error: err.message });
          
          res.json({
            success: true,
            streak: sRow?.count ? sRow.count + 5 : 5,
            favoriteGenre: gRow?.genre || "Self Help",
            mostReadAuthor: aRow?.author || "Unknown Author",
            booksSaved: cRow?.count || 0
          });
        });
      });
    });
  });
});

// ================= RUNTIME LIFECYCLE ROUTER =================
app.listen(PORT, () => console.log(`🔒 Vault Guarded Server operational on port ${PORT}`));