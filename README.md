# Zomato Orders — Pagination API (Beginner Setup Guide)

A simple Node.js + MySQL server with **one endpoint** that returns paginated restaurant orders.

## What's inside
| File | Purpose |
|---|---|
| `connector.js` | Your MySQL connection settings (edit this first!) |
| `createDatabase.js` | Creates the database, table, and sample data (run once) |
| `server.js` | The actual API server |
| `package.json` | Lists the packages needed to run this project |

## Step-by-step setup

### 1. Install Node.js
Download from https://nodejs.org if you don't have it. Check it's installed:
```
node -v
```

### 2. Install MySQL
Make sure MySQL Server is installed and running on your computer.
(If you're not sure, search "install MySQL on [your OS]".)

### 3. Install project dependencies
Open a terminal in this folder and run:
```
npm install
```
This downloads `express` (web server) and `mysql2` (MySQL client).

### 4. Edit `connector.js`
Open `connector.js` and update:
```js
user: 'root',
password: 'YOUR_PASSWORD_HERE',
```
Use your own MySQL username/password.

### 5. Create the database and sample data
```
node createDatabase.js
```
You should see: `Database setup complete!`

### 6. Start the server
```
node server.js
```
You should see: `Server running at http://localhost:8080`

### 7. Test it
Open your browser or Postman and visit:
- `http://localhost:8080/api/orders` → first 10 orders
- `http://localhost:8080/api/orders?limit=4&offset=1` → 4 orders, skipping the first 1
- `http://localhost:8080/api/orders?limit=abc` → invalid, falls back to default (10)

## How pagination works (in plain terms)
- **limit** = how many rows to return
- **offset** = how many rows to skip before starting
- Example: `limit=4&offset=1` skips the 1st row, then returns the next 4 rows.
- If `limit` or `offset` is missing or not a valid positive whole number, the server silently uses the defaults (`offset=0`, `limit=10`) instead of throwing an error.

## Common errors & fixes
| Error | Fix |
|---|---|
| `ECONNREFUSED` | MySQL isn't running. Start your MySQL service. |
| `ER_ACCESS_DENIED_ERROR` | Wrong username/password in `connector.js`. |
| `Cannot find module 'express'` | Run `npm install` again. |
