# HashMicro Take Home Test

Simple Express + TypeScript web app for the HashMicro technical assignment. This application uses EJS views, in-memory data storage, and a small MVC-style structure to manage products, customers, orders, and a character checker feature.

## Features

- Login/logout with a seeded admin user
- Product and customer management
- Customer discount rate by type: regular, member, and corporate
- Order creation with multiple products
- Order summary with subtotal, discount, taxable amount, tax, and grand total
- Character checker with case-sensitive and non-case-sensitive modes

## Requirements

- Node.js 22 or newer
- pnpm

## Setup

```bash
pnpm install
copy env_sample .env
pnpm dev
```

The server runs at `http://localhost:3000` by default.

## Environment Variables

```env
NODE_ENV=development
PORT=3000
```

## Default Login

- Username: `admin`
- Password: `admin123`

## Main Routes

- `GET /login` - login page
- `GET /` - redirects to products
- `GET /products` - product management page
- `GET /customers` - customer management page
- `GET /orders` - order management page
- `GET /character-checker` - character checker page

## Available Scripts

- `pnpm dev` - run in development mode with file watching
- `pnpm build` - compile TypeScript to `dist`
- `pnpm start` - run the compiled app
