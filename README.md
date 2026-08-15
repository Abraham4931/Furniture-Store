<<<<<<< HEAD
# Fernwood — Furniture E-Commerce (MERN Stack)

A full-stack furniture store: Node/Express/MongoDB API + React (Vite, Tailwind) storefront.

## Features

**Storefront**
- Product catalog with search, category filter, price sort, pagination
- Product detail pages with image gallery, stock status, and customer reviews
- Cart (persisted in localStorage) and multi-step checkout
- Order history and order detail pages
- JWT auth: register / login / profile

**Admin panel** (`/admin`, requires an admin account)
- Product CRUD
- Order list with status updates (Pending → Processing → Shipped → Delivered)

**Backend**
- REST API secured with JWT, role-based (`isAdmin`) route protection
- Mongoose models: User, Product, Category, Order, Review
- Server-side re-pricing on checkout (prevents client-side price tampering)
- Centralized error handling, seed script with sample furniture data

## Project structure

```
furniture-store/
├── server/                 # Express API
│   ├── config/db.js
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── seeder.js           # loads sample categories/products/users
│   └── server.js
└── client/                 # React app (Vite + Tailwind)
    └── src/
        ├── api/axios.js
        ├── context/        # Auth + Cart state
        ├── components/
        └── pages/
```

## Getting started

### 1. Backend

```bash
cd server
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET
npm install
npm run seed               # loads sample categories, products, and demo users
npm run dev                 # starts the API on http://localhost:5000
```

You'll need a MongoDB instance — either local (`mongodb://127.0.0.1:27017/furniture_store`)
or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (recommended if you don't
want to install MongoDB locally).

Demo accounts created by the seeder:
- Admin: `admin@furniture.com` / `admin1234`
- Shopper: `shopper@example.com` / `shopper1234`

### 2. Frontend

```bash
cd client
npm install
npm run dev                 # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so run both
servers side by side.

### 3. Try it out

- Visit `http://localhost:5173`, browse the catalog, add items to the cart, check out.
- Sign in as the admin account and visit `/admin` to add/edit products and manage orders.

## Notes on going to production

- Set a long, random `JWT_SECRET` and a real `MONGO_URI` in `server/.env`.
- Swap the comma-separated image URL field in the admin product form for real
  image uploads (e.g. Cloudinary or S3) if you need users to upload photos directly.
- Add a real payment provider (Stripe, etc.) in place of the `paymentMethod` field —
  currently orders are created as Cash on Delivery / Bank Transfer for demo purposes.
- Build the client (`npm run build` in `client/`) and serve the static output from
  Express, or deploy client and server separately (e.g. Vercel + Render/Railway).
=======
# Furniture-Store
An online marketplace for buying and selling furniture.
>>>>>>> 2784ae397796b194afa8a1a0a5faa6c68b3433c2
