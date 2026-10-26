# Quiet Corners — Personal Blog Platform

A full-stack personal blog built with an ASP.NET Core Web API backend and a React frontend. The blog owner can create, edit, and delete posts and categories through a JWT-protected admin dashboard, while visitors can read posts, filter by category, search, and leave comments without needing an account.

**Live demo:** http://13.60.190.172 (hosted on AWS EC2; the address may change if the server is restarted from the AWS console)

## Features

- Public blog with post listing, single-post view, category filtering, and keyword search
- Comment system — anyone can leave a comment using just a name, no account required
- JWT-based authentication protecting post/category management
- Admin dashboard for creating, editing, and deleting posts and categories
- SQLite database via Entity Framework Core, with a seeding script for sample data
- Deployed on an AWS EC2 Ubuntu server with Nginx and systemd

## Tech Stack

**Backend:** ASP.NET Core Web API (.NET 10), Entity Framework Core, SQLite, JWT Bearer Authentication, Swagger
**Frontend:** React (Vite)
**Deployment:** AWS EC2 (Ubuntu), Nginx (web server + reverse proxy), systemd

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
│   ├── Seed.cs
│   ├── Program.cs
│   └── .env               # holds JWT_KEY (not committed)
└── frontend/
    ├── vite.config.js     # dev proxy: forwards /api to the backend
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

## Getting Started (Local Development)

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
   (The app also applies pending migrations on startup, so this step is optional.)
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

The frontend calls the API with relative paths such as `/api/Post`. During development, the proxy in `vite.config.js` forwards every `/api` request to `http://localhost:5017`, so start the backend first. In production, Nginx does this job (see Deployment).

### Creating an admin account

Since there's no public registration page, register the one admin account directly through Swagger by calling the register endpoint with a username and password. Then log in from the frontend's `/login` page to access the dashboard.

## Deployment (AWS EC2)

The app runs on a single AWS EC2 Ubuntu server.

### How it works

```
Browser
   │  http://<server-ip>  (port 80)
   ▼
Nginx
   ├── /        → React build files (/var/www/blog)
   └── /api/*   → ASP.NET Core API (localhost:5017, managed by systemd)
                        │
                        ▼
                     SQLite (blog.db)
```

- **Nginx** serves the built React files and acts as a reverse proxy: any request starting with `/api/` is forwarded to the .NET app. Because the page and the API share one address, no CORS setup is needed.
- **systemd** runs the .NET API as a background service. It starts on boot and restarts automatically if the app crashes.
- The API listens only on `localhost:5017`, so it is not exposed to the internet directly.
- The AWS **security group** allows inbound SSH (22) and HTTP (80).

### Server setup

1. **Install .NET 10 SDK, Node.js, and Nginx** on the server.
2. **Get the code:**
   ```
   git clone https://github.com/rasadikak/blog_webapp.git
   ```
3. **Create the backend `.env`** with `JWT_KEY` (it is not in Git).
4. **Publish the backend** and copy the secret file next to it:
   ```
   cd blog_webapp/backend
   dotnet publish -c Release -o ~/blog_publish
   cp .env ~/blog_publish/.env
   ```
5. **Create a systemd service** at `/etc/systemd/system/blog-api.service`:
   ```
   [Unit]
   Description=Blog API
   After=network.target

   [Service]
   WorkingDirectory=/home/ubuntu/blog_publish
   ExecStart=/usr/bin/dotnet /home/ubuntu/blog_publish/backend.dll
   Restart=always
   RestartSec=5
   User=ubuntu
   Environment=ASPNETCORE_URLS=http://localhost:5017
   Environment=ASPNETCORE_ENVIRONMENT=Production

   [Install]
   WantedBy=multi-user.target
   ```
   Then start it:
   ```
   sudo systemctl daemon-reload
   sudo systemctl enable --now blog-api
   ```
6. **Build the frontend** and copy it to the web folder:
   ```
   cd ../frontend
   npm install
   npm run build
   sudo mkdir -p /var/www/blog
   sudo cp -r dist/* /var/www/blog/
   ```
7. **Configure Nginx** at `/etc/nginx/sites-available/blog`:
   ```
   server {
       listen 80 default_server;
       server_name _;

       root /var/www/blog;
       index index.html;

       location / {
           try_files $uri /index.html;
       }

       location /api/ {
           proxy_pass http://localhost:5017;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   Enable it:
   ```
   sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl reload nginx
   ```
8. **Open port 80** (HTTP) in the EC2 security group.

### Updating the live site

After pushing changes to GitHub, run these on the server:

```
cd ~/blog_webapp && git pull
```

- Backend changes:
  ```
  cd backend
  dotnet publish -c Release -o ~/blog_publish
  sudo systemctl restart blog-api
  ```
- Frontend changes:
  ```
  cd frontend
  npm run build
  sudo cp -r dist/* /var/www/blog/
  ```

### Creating the admin account on the server

Swagger is only enabled in development, so register the admin from the server's terminal:

```
curl -X POST http://localhost/api/Auth/register -H "Content-Type: application/json" -d '{"username":"your-username","passwordHash":"your-password"}'
```

(The `passwordHash` field takes the plain password; the API hashes it before saving.)

## API Overview

Base URL (local development): `http://localhost:5017`. On the live site, every endpoint is under `/api/` on the same address.

- **Auth** — register, login (returns a JWT token), and delete a user
- **Posts** — get all, get by ID, get by category, search, plus create/update/delete (owner only)
- **Categories** — get all, plus create (owner only)
- **Comments** — get comments for a post, and add a new comment (open to anyone)

Reading endpoints are public. Creating, updating, or deleting posts, categories, or users requires being logged in as the admin.

## Notes

- `blog.db` and `.env` are excluded from version control (see `.gitignore`) — the database is recreated via migrations, and the JWT secret should never be committed.
- Sample data is seeded automatically on startup only if the database tables are empty.
- The live server keeps its own `blog.db` inside the published folder. Publishing a new build does not remove it.

<img width="1863" height="974" alt="home page" src="https://github.com/user-attachments/assets/ae796632-44ba-40a1-85d6-3018fd0f11e7" />

<img width="1861" height="976" alt="homepage 2" src="https://github.com/user-attachments/assets/96ab711d-5925-41ca-8dfb-f954e13c44ee" />

<img width="1864" height="967" alt="dashboard page" src="https://github.com/user-attachments/assets/461eafe3-680d-40ab-b736-1371ef0da07a" />
