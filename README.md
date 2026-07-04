# 📚 BookWise – AI-Powered Personal Librarian

<p align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

</p>

<h3 align="center">
✨ Don't Search for Books. Discover the Right One.
</h3>

---

# 📖 About BookWise

BookWise is an **AI-powered book discovery platform** designed to help readers discover books based on their interests, goals, and reading preferences.

Unlike traditional online libraries that simply list books, BookWise focuses on **personalized discovery**. It combines a modern recommendation engine, secure authentication, behavioral tracking, and an elegant **Dark Academia-inspired reading experience** to create a digital companion for readers.

The long-term vision is to evolve BookWise into an **AI Personal Librarian** capable of understanding natural language queries and recommending books with human-like explanations.

---

# ✨ Key Features

## 📚 Intelligent Book Discovery

- Browse a curated collection of **1900+ popular books**
- Search books by title, author, or publisher
- Genre-based filtering
- Fast client-side search
- Responsive browsing experience

---

## 📄 Detailed Book Information

Each book includes:

- Cover Image
- Title
- Author
- Publisher
- Language
- Rating
- Description
- Related Book Recommendations

---

## ❤️ Personal Library

Users can

- Save favorite books
- Manage personal reading collection
- View personalized profile
- Access reading dashboard

---

## 🔐 Secure Authentication

BookWise includes

- JWT Authentication
- Protected Routes
- Password Hashing using bcrypt
- Secure Login System

---

## 🤖 AI Librarian (Foundation)

BookWise introduces a conversational recommendation experience.

Users can search naturally:

> "I want to become more disciplined."

> "Suggest books for placement preparation."

> "Recommend books similar to Atomic Habits."

The recommendation engine is designed to explain **why** each book is recommended rather than simply displaying search results.

---

## 📊 Personalized Dashboard

The dashboard provides

- User Profile
- Favorite Books
- Reading Statistics
- Personalized Recommendations
- Reading Activity Overview

---

# 🚀 Current Highlights

✅ Imported and processed **1.1 Million+ Book Ratings**

✅ Curated **1900+ Popular Books**

✅ Secure JWT Authentication

✅ Personalized Favorites System

✅ Genre Filtering

✅ Related Book Recommendation API

✅ Responsive UI

✅ Express REST API

---

# 🏗️ System Architecture

```
                React (Vite)
                      │
                      ▼
           Express REST API Server
                      │
                      ▼
              SQLite Database
                      │
        ┌─────────────┼──────────────┐
        │             │              │
      Users         Books       Favorites
```

---

# 🛠 Tech Stack

## Frontend

- React.js (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- Responsive UI

---

## Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt

---

## Database

- SQLite

---

## Dataset

- Kaggle Book Recommendation Dataset
- Open Library Metadata

---

# 📂 Project Structure

```
BookWise
│
├── book-recommendation-frontend
│   ├── src
│   ├── pages
│   ├── components
│   ├── services
│   └── context
│
├── book-recommendation-backend
│   ├── middleware
│   ├── database
│   ├── scripts
│   ├── server.js
│   └── package.json
│
└── datasets
```

---

# 🔄 Application Workflow

```
User Login
      │
      ▼
Browse Library
      │
      ▼
Search / Filter Books
      │
      ▼
View Book Details
      │
      ▼
Save to Favorites
      │
      ▼
Dashboard
```

---

# 🗄 Database Schema

### Current Tables

- Users
- Books
- Favorites

These tables manage authentication, book metadata, and personalized user collections.

---

# 🧠 Recommendation Engine

The current recommendation system uses

- Genre Matching
- Favorite Books
- Related Books
- Book Metadata

The architecture is designed to support future behavioral signals such as

- User Interests
- Reading History
- Search History
- Recently Viewed Books
- Trending Books

---

# 📸 Screenshots

- 🏠 Dashboard
- 📚 Library
- 📖 Book Details
- ❤️ Favorites
- 👤 Profile

*(Screenshots will be added after deployment.)*

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Sadiyashaikh15/bookwise-ai.git
```

## Backend

```bash
cd book-recommendation-backend
npm install
npm start
```

Runs at

```
http://localhost:5000
```

---

## Frontend

```bash
cd book-recommendation-frontend
npm install
npm run dev
```

Runs at

```
http://localhost:5173
```

---

# 🔮 Future Roadmap

## 🤖 AI Personal Librarian

Understand natural language requests such as

> "I only have 5 hours this weekend."

> "Recommend books for placements."

> "I loved Atomic Habits."

The AI will recommend books and explain **why** each recommendation matches the user's goals.

---

## 🎯 Goal-Based Onboarding

New users will choose interests like

- Programming
- AI
- Business
- Psychology
- Finance
- Self Help
- History

Recommendations will be personalized from the first login.

---

## 🧬 Shelf DNA

Generate a personalized reading personality such as

- 🧠 Curious Builder
- 📈 Mindful Strategist
- 📖 Reflective Thinker

based on user reading behavior.

---

## 📚 Reading Paths

Instead of recommending a single book, BookWise will generate structured learning journeys.

Example:

### Placement Path

1. Atomic Habits
2. Deep Work
3. Essentialism
4. Clean Code
5. System Design Interview

---

## 📈 Smarter Recommendation Engine

Future recommendation scoring will include

- Interests
- Favorites
- Recently Viewed
- Search History
- Trending Books

to generate more accurate recommendations.

---

# 💡 Challenges Solved

- Processed over **1.1 Million Ratings**
- Built a secure JWT Authentication system
- Implemented book cover fallback handling
- Created related-book recommendation endpoints
- Designed responsive layouts for desktop and mobile
- Structured a scalable backend architecture for future AI integration

---

# 🎯 Project Vision

Most book platforms help users **find books they already know**.

BookWise aims to help users **discover books they didn't know they needed**.

Instead of asking

> **"Which book are you looking for?"**

BookWise asks

> **"What are you trying to achieve?"**

and recommends books that match the user's goals with personalized explanations.

---

# 👩‍💻 Author

## Sadiya Shaikh

🎓 B.Tech Computer Science Engineering Student

💻 Full Stack Developer

### GitHub

https://github.com/Sadiyashaikh15

### LinkedIn

http://www.linkedin.com/in/sadiyashaikh15


# 🌟 Support

If you found this project useful or interesting, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.

---

# 📄 License

This project is licensed under the **MIT License**.
