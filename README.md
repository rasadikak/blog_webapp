# Quiet Corners — Personal Blog Platform

A full-stack personal blog built with an ASP.NET Core Web API backend and a React frontend. The blog owner can create, edit, and delete posts and categories through a JWT-protected admin dashboard, while visitors can read posts, filter by category, search, and leave comments without needing an account.

## Features

- Public blog with post listing, single-post view, category filtering, and keyword search
- Comment system — anyone can leave a comment using just a name, no account required
- JWT-based authentication protecting post/category management
- Admin dashboard for creating, editing, and deleting posts and categories
- SQLite database via Entity Framework Core, with a seeding script for sample data

## Tech Stack

**Backend:** ASP.NET Core Web API, Entity Framework Core, SQLite, JWT Bearer Authentication, Swagger
**Frontend:** React (Vite)

## Project Structure

```
blog_webapp/
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── PostController.cs
│   │   ├── CategoryController.cs
│   │   └── CommentController.cs
│   ├── Models/
│   │   ├── Post.cs
│   │   ├── Category.cs
│   │   ├── Comment.cs
│   │   └── User.cs
│   ├── AppDbContext.cs
│   ├── DbSeeder.cs
│   ├── Program.cs
│   └── .env               # holds JWT_KEY (not committed)
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.jsx
        │   ├── Post.jsx
        │   ├── Login.jsx
        │   └── Dashboard.jsx
        ├── styles/
        ├── Navbar.jsx
        ├── ProtectedRoute.jsx
        └── App.jsx
```

## Getting Started

### Backend

1. Navigate to the backend folder:
   ```
   cd backend
   ```
2. Restore dependencies:
   ```
   dotnet restore
   ```
3. Create a `.env` file in the `backend` folder with a JWT secret (32+ characters):
   ```
   JWT_KEY=your-long-random-secret-key-here
   ```
4. Apply migrations to create the database:
   ```
   dotnet ef database update
   ```
5. Run the API:
   ```
   dotnet run
   ```
   The API starts at `http://localhost:5017`, and sample data (categories, posts, comments) is seeded automatically on first run.
6. Explore the API via Swagger at `http://localhost:5017/swagger`.

### Frontend

1. Navigate to the frontend folder:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   The app runs at `http://localhost:5173`.

### Creating an admin account

Since there's no public registration page, register the one admin account directly through Swagger by calling the register endpoint with a username and password. Then log in from the frontend's `/login` page to access the dashboard.

## API Overview

Base URL: `http://localhost:5017`

- **Auth** — register, login (returns a JWT token), and delete a user
- **Posts** — get all, get by ID, get by category, search, plus create/update/delete (owner only)
- **Categories** — get all, plus create (owner only)
- **Comments** — get comments for a post, and add a new comment (open to anyone)

Reading endpoints are public. Creating, updating, or deleting posts, categories, or users requires being logged in as the admin.

## Notes

- `blog.db` and `.env` are excluded from version control (see `.gitignore`) — the database is recreated via migrations, and the JWT secret should never be committed.
- Sample data is seeded automatically on startup only if the database tables are empty.