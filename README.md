# Ahmed Imported Gallery (MERN)

React 19 + Vite 8 + Tailwind CSS 4 frontend, Express 5 + Mongoose 9 backend, Node 24+ (Node 26 recommended, see `.nvmrc`).
Your original design is kept: Gulzar font, navy/gold palette, Font Awesome from the CDN.
All styling is Tailwind classes inside the React components (shared class strings live in `frontend/src/ui.js`).
`frontend/src/index.css` only imports Tailwind and defines the theme colours, light/dark variables and two animations.

## Folder structure
backend/  server.js, .env, src/{controllers,db,middleware,models,routes,services}, src/app.js
frontend/ src/{assets,Components,pages,pages/admin}, App.jsx, main.jsx, toast.js, ui.js, index.css

## Run locally
1. Put your photos in `frontend/public/`: `shop.jpeg` (hero + favicon), `gallery.jpeg` (about image).
2. Backend: `cd backend && npm install`, edit `.env` (set a real JWT_SECRET), then
   `npm run create-admin` (uses ADMIN_EMAIL / ADMIN_PASSWORD from .env), optional `npm run seed`, then `npm run dev`.
3. Frontend: `cd frontend && npm install && npm run dev` -> http://localhost:5173
4. Log in with the admin email/password -> the gauge icon in the header opens /admin.

## Deploy (one service, e.g. Render / Railway)
1. Create a free MongoDB Atlas cluster and copy its connection string.
2. Push the project to GitHub.
3. New Web Service from the repo:
   - Build command: `npm run build`
   - Start command: `npm start`
   - Environment: NODE_ENV=production, MONGO_URI=..., JWT_SECRET=(48+ random chars), CLIENT_URL=https://your-site-url
4. Open the Render shell once and run `npm run create-admin` (set ADMIN_* env vars first), then remove ADMIN_PASSWORD.
The Express server serves the built React app, so the site and API share one origin (secure same-site cookies).

## Security built in
- Passwords: bcrypt (cost 12). Login by httpOnly + Secure + SameSite=Strict cookie (JWT 7 days), not readable by JavaScript.
- Lockout after 5 wrong passwords (15 min), rate limits on login/register/contact/orders, generic login errors.
- Admins cannot be created through the API. Only `npm run create-admin` or another admin can promote a user.
- Every admin route checks login + admin role on the server; the React ProtectedRoute is only for UX.
- Blocking a user or changing a password signs them out everywhere (token version).
- Input validation (zod), NoSQL-operator stripping, Origin check on write requests, Helmet + CSP, 20kb JSON limit.
- Order prices are always recalculated from the database. Uploads: JPG/PNG/WebP only, 3MB, file signature checked, stored in MongoDB.

## What the admin panel controls
Dashboard, Products, Categories, Gallery, Orders (status), Messages, Users (block / make admin) and Site settings:
shop name, top bar, hero text and image, feature cards, stats, about text and image, videos, contact/social links, footer and creator page.
