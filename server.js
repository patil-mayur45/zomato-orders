// server.js
// Starts an Express server exposing GET /api/orders with pagination.
//
// Run with:  node server.js
// Then visit: http://localhost:8080/api/orders
//        or:  http://localhost:8080/api/orders?limit=4&offset=1

const express = require('express');
const { pool } = require('./connector');

const app = express();
const PORT = 8080;

// Checks that a value is a "positive integer" as plain text.
// Anything else (letters, decimals, negative numbers, empty) is invalid.
function isPositiveInteger(value) {
  return /^\d+$/.test(value);
}

app.get('/api/orders', (req, res) => {
  const DEFAULT_OFFSET = 0;
  const DEFAULT_LIMIT = 10;

  let { offset, limit } = req.query;

  // Validate offset — fall back to default if missing/invalid
  if (offset === undefined || !isPositiveInteger(offset)) {
    offset = DEFAULT_OFFSET;
  } else {
    offset = parseInt(offset, 10);
  }

  // Validate limit — fall back to default if missing/invalid
  if (limit === undefined || !isPositiveInteger(limit)) {
    limit = DEFAULT_LIMIT;
  } else {
    limit = parseInt(limit, 10);
  }

  // LIMIT/OFFSET can't be safely parameterized with "?" in all mysql2 modes,
  // but since we've already validated both are plain positive integers,
  // it's safe to insert them directly into the query string.
  const query = `SELECT * FROM orders LIMIT ${limit} OFFSET ${offset}`;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).json({ error: 'Something went wrong fetching orders.' });
    }
    return res.status(200).json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/orders?limit=4&offset=1`);
});
