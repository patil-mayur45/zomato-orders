<h1 align="center">🍽️ Zomato Orders — Pagination API</h1>

<p align="center">
  A clean, beginner-friendly <b>Node.js + Express + MySQL</b> REST API that serves restaurant orders with <b>limit / offset pagination</b> and safe input validation.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/API-REST-blue" alt="REST API" />
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [How Pagination Works](#-how-pagination-works)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Testing the API](#-testing-the-api)
- [Troubleshooting](#-troubleshooting)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 📖 Overview

Restaurant chains handle thousands of orders every day, so returning every row in one response is slow and wasteful. This project solves that with **pagination**: the client asks for a small slice of the data (`limit`) starting from a position (`offset`), and the server fetches only that slice from MySQL.

The server exposes **one endpoint**, `GET /api/orders`, backed by a real MySQL database.

---

## ✨ Features

- ✅ Single REST endpoint: `GET /api/orders`
- ✅ Optional `limit` and `offset` query parameters
- ✅ Strict validation: only **positive whole numbers** are accepted
- ✅ Invalid values (letters, decimals, negatives) **silently fall back to defaults**
- ✅ Defaults: `offset = 0`, `limit = 10`
- ✅ Always returns status `200` with a JSON array of orders
- ✅ Connection pooling for reliable database access
- ✅ One-command database setup with sample data

---

## 🛠 Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Runtime    | Node.js                   |
| Framework  | Express.js                |
| Database   | MySQL 8                   |
| DB Driver  | mysql2                    |
| Language   | JavaScript (with SQL)     |

---

## 🔢 How Pagination Works

- **`limit`** = how many records to return
- **`offset`** = how many records to skip first

The server runs this SQL query:

```sql
SELECT * FROM orders LIMIT <limit> OFFSET <offset>;
```

**Example:** with `limit=4&offset=1`, the server skips the 1st order and returns the next 4 (ids 2, 3, 4, 5).

**Want page numbers?** Use this formula:

```
offset = (page - 1) × limit
```

| Page | limit | offset | Records returned |
|------|-------|--------|------------------|
| 1    | 5     | 0      | 1 – 5            |
| 2    | 5     | 5      | 6 – 10           |
| 3    | 5     | 10     | 11 – 15          |

---

## 📂 Project Structure

```
zomato-orders/
├── connector.js        # MySQL connection settings (git-ignored, see setup)
├── createDatabase.js   # Creates database, table and sample data
├── server.js           # Express server and /api/orders endpoint
├── package.json        # Dependencies and scripts
├── .gitignore          # Hides node_modules and connector.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) installed (check with `node -v`)
- [MySQL Server](https://dev.mysql.com/downloads/installer/) installed and **running**

### 1. Clone and install

```bash
git clone https://github.com/patil-mayur45/zomato-orders.git
cd zomato-orders
npm install
```

### 2. Create `connector.js`

`connector.js` holds your database password, so it is **not uploaded to GitHub**. Create it yourself in the project folder:

```js
const mysql = require('mysql2');

const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'YOUR_MYSQL_PASSWORD', // use your own MySQL password
  database: 'zomato_orders'
};

const pool = mysql.createPool({
  ...DB_CONFIG,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = { pool, DB_CONFIG };
```

### 3. Set up the database (run once)

```bash
node createDatabase.js
```

Expected output:

```
Connected to MySQL server.
Database "zomato_orders" ready.
Table "orders" ready.
Inserted 15 sample orders.
Database setup complete! You can now run: node server.js
```

### 4. Start the server

```bash
node server.js
```

```
Server running at http://localhost:8080
```

> After the first setup, you only need `node server.js` each time.

---

## 📡 API Reference

### `GET /api/orders`

Returns a list of orders.

**Base URL:** `http://localhost:8080`

#### Query parameters

| Parameter | Type    | Required | Default | Description                  |
|-----------|---------|----------|---------|------------------------------|
| `limit`   | integer | No       | `10`    | Number of records to return  |
| `offset`  | integer | No       | `0`     | Number of records to skip    |

#### Validation rules

| Input                  | Valid? | Behaviour                |
|------------------------|--------|--------------------------|
| `limit=5`              | ✅ Yes | Uses 5                   |
| `limit=abc`            | ❌ No  | Falls back to default 10 |
| `limit=2.5`            | ❌ No  | Falls back to default 10 |
| `offset=-3`            | ❌ No  | Falls back to default 0  |
| *(parameter missing)*  | —      | Uses default             |

#### Responses

| Status | Meaning                                              |
|--------|------------------------------------------------------|
| `200`  | Success: JSON array of orders (can be `[]` if none)  |
| `500`  | Database error: `{ "error": "Something went wrong fetching orders." }` |

#### Example response

```json
[
  {
    "id": 2,
    "customer_name": "Priya Singh",
    "restaurant_name": "Burger Hub",
    "item_name": "Cheese Burger",
    "price": "149.00",
    "order_status": "delivered",
    "created_at": "2026-08-31T10:24:06.000Z"
  }
]
```

#### Order fields

| Field             | Type      | Description              |
|-------------------|-----------|--------------------------|
| `id`              | integer   | Unique order id          |
| `customer_name`   | string    | Name of the customer     |
| `restaurant_name` | string    | Restaurant name          |
| `item_name`       | string    | Item ordered             |
| `price`           | decimal   | Item price               |
| `order_status`    | string    | `placed`, `preparing` or `delivered` |
| `created_at`      | timestamp | When the order was made  |

---

## 🧪 Testing the API

Open these URLs in your browser (server must be running):

| URL | Expected result |
|-----|-----------------|
| `/api/orders` | First 10 orders (ids 1–10) |
| `/api/orders?limit=5` | First 5 orders |
| `/api/orders?offset=5` | Skips 5, returns ids 6–15 |
| `/api/orders?limit=4&offset=1` | Returns ids 2–5 |
| `/api/orders?limit=3&offset=10` | Returns ids 11–13 |
| `/api/orders?limit=abc` | Invalid, returns default 10 |
| `/api/orders?offset=-3` | Invalid, uses offset 0 |
| `/api/orders?limit=2.5` | Invalid, returns default 10 |
| `/api/orders?limit=100` | Returns all 15 orders |
| `/api/orders?offset=20` | Returns `[]` (past the last record) |

Or with **curl**:

```bash
curl "http://localhost:8080/api/orders?limit=4&offset=1"
```

> Note: opening `http://localhost:8080` alone shows `Cannot GET /`. This is expected, because the only route is `/api/orders`.

---

## 🩺 Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot find module 'mysql2'` | Run `npm install` |
| `Cannot find module './connector'` | Create `connector.js` (see Getting Started, step 2) |
| `ER_ACCESS_DENIED_ERROR` | Wrong MySQL username or password in `connector.js` |
| `ECONNREFUSED` | MySQL server is not running. Start the MySQL service |
| `Unknown database 'zomato_orders'` | Run `node createDatabase.js` first |
| `Cannot GET /` | Use the full URL: `/api/orders` |

---

## 🔮 Future Improvements

- Add total count and page metadata to responses
- Filter by restaurant or order status
- Add endpoints to create, update and delete orders
- Move database credentials to a `.env` file
- Add automated tests

---

## 👨‍💻 Author

**Mayur Patil**
GitHub: [@patil-mayur45](https://github.com/patil-mayur45)

---

<p align="center">⭐ If this project helped you, consider giving it a star!</p>
