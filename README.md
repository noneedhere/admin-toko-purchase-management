## Project Overview

This project was developed as a technical assessment to demonstrate:

- Backend development with Node.js and Express.js
- Server-side rendering using EJS
- SQL database design and management
- MVC architecture implementation
- Inventory and transaction management logic

# Admin Store Management System

A simple store administration system built with **Node.js**, **Express.js**, **EJS**, and **SQLite** to manage products, inventory, and purchase transactions.

## Features

- Product management
- Real-time stock monitoring
- Purchase transaction management
- Automatic stock updates
- Purchase cancellation with stock restoration
- Auto-generated invoices
- Transaction history
- Dashboard statistics

## Tech Stack

- Node.js
- Express.js
- EJS
- SQLite

## Project Structure

```text
admin-toko/
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── config/
├── app.js
├── package.json
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/admin-toko.git
cd admin-toko
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create the Database

```bash
sqlite3 database/admin_toko.db < database/schema.sql
sqlite3 database/admin_toko.db < database/seed.sql
```

### 4. Run the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

## Database

The project uses SQLite and includes:

- `schema.sql` → database schema
- `seed.sql` → sample data

Sample data includes:

- 10 products
- Initial stock records
- Example purchase transactions

## Core Business Logic

### Purchase Transaction

When a purchase is created:

- Product stock is validated
- Total price is calculated automatically
- Stock quantity is reduced
- Purchase record is stored

### Purchase Cancellation

When a purchase is cancelled:

- Transaction status is updated
- Product stock is automatically restored
- Cancelled transactions cannot be cancelled again

## Screenshots

Add application screenshots here if available.

## Requirements

- Node.js 18+
- npm 9+
- SQLite 3

## Author

Muhammad Zidane Fawwaz Rosyidi

Junior Fullstack Web Developer
