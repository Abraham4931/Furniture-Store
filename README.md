# Fernwood — Furniture E-Commerce

A full-stack furniture marketplace for buying and selling furniture, built with a React storefront and a Node.js/Express backend.

## Features

### Storefront

* Product catalog with search, category filtering, price sorting, and pagination
* Product detail pages with image gallery, stock status, and customer reviews
* Cart persisted in `localStorage`
* Multi-step checkout
* Order history and order details
* JWT authentication: register, login, and profile

### Admin Panel

Available at `/admin` and requires an admin account.

* Product CRUD
* Order management
* Order status updates:

  * Pending
  * Processing
  * Shipped
  * Delivered

### Backend

* REST API built with Node.js and Express
* PostgreSQL database
* JWT authentication
* Role-based access control using `isAdmin`
* PostgreSQL data models for:

  * User
  * Product
  * Category
  * Order
  * Review
* Server-side product re-pricing during checkout to prevent client-side price tampering
* Centralized error handling
* Seed script for sample furniture data

## Project Structure

```text
Furniture-Store/

├── server/                  # Express API
│   ├── config/
│   │   └── db.js            # PostgreSQL connection
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── seeder.js             # Loads sample data
│   └── server.js

└── client/                  # React app (Vite + Tailwind)
    └── src/
        ├── api/
        │   └── axios.js
        ├── context/          # Auth + Cart state
        ├── components/
        └── pages/
```

## Getting Started

### 1. Backend

```bash
cd server
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Database

The backend uses PostgreSQL.

Create a `.env` file inside the `server` directory:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

The PostgreSQL database can be hosted using a service such as Neon or another PostgreSQL provider.

Make sure the required database tables have been created before starting the application.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The Vite development server runs on:

```text
http://localhost:5173
```

Run both the backend and frontend servers at the same time during development.

### 3. Try It Out

Visit:

```text
http://localhost:5173
```

You can:

* Browse furniture products
* Search and filter products
* Add products to the cart
* Create an account
* Sign in
* Complete checkout
* View your orders

Administrators can visit:

```text
http://localhost:5173/admin
```

to manage products and orders.

## Database

The project uses PostgreSQL with the following main tables:

* `users`
* `categories`
* `products`
* `reviews`
* `orders`
* `order_items`

The Express backend communicates with PostgreSQL using the `pg` package.

## Environment Variables

The backend requires the following environment variables:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

Do not commit your `.env` file to Git.

## Production Notes

Before deploying:

* Use a strong, random `JWT_SECRET`.
* Use a production PostgreSQL database.
* Keep database credentials in environment variables.
* Replace demo image URLs with a proper image storage service if necessary.
* Add a real payment provider if online payments are required.
* Build the React client with:

```bash
npm run build
```

* Deploy the frontend and backend separately or serve the frontend build through Express.