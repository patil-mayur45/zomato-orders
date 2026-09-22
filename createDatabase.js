// createDatabase.js
// Run this ONCE to set up your local database:  node createDatabase.js
// It will:
//   1. Create the database (if it doesn't exist)
//   2. Create the "orders" table
//   3. Insert some sample rows so /api/orders returns real data

const mysql = require('mysql2');
const { DB_CONFIG } = require('./connector');

// First connect WITHOUT selecting a database, since the database
// might not exist yet.
const rootConnection = mysql.createConnection({
  host: DB_CONFIG.host,
  user: DB_CONFIG.user,
  password: DB_CONFIG.password
});

rootConnection.connect((err) => {
  if (err) {
    console.error('Could not connect to MySQL. Check host/user/password in connector.js');
    console.error(err.message);
    process.exit(1);
  }

  console.log('Connected to MySQL server.');

  const createDbSQL = `CREATE DATABASE IF NOT EXISTS ${DB_CONFIG.database}`;
  rootConnection.query(createDbSQL, (err) => {
    if (err) {
      console.error('Error creating database:', err.message);
      process.exit(1);
    }
    console.log(`Database "${DB_CONFIG.database}" ready.`);

    rootConnection.changeUser({ database: DB_CONFIG.database }, (err) => {
      if (err) {
        console.error('Error switching to database:', err.message);
        process.exit(1);
      }

      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          customer_name VARCHAR(100) NOT NULL,
          restaurant_name VARCHAR(100) NOT NULL,
          item_name VARCHAR(100) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          order_status VARCHAR(30) DEFAULT 'placed',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      rootConnection.query(createTableSQL, (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
          process.exit(1);
        }
        console.log('Table "orders" ready.');

        // Check if table already has data, to avoid duplicate seeding
        rootConnection.query('SELECT COUNT(*) AS count FROM orders', (err, results) => {
          if (err) {
            console.error('Error checking existing data:', err.message);
            process.exit(1);
          }

          if (results[0].count > 0) {
            console.log(`Table already has ${results[0].count} rows. Skipping seed.`);
            rootConnection.end();
            return;
          }

          const sampleOrders = [
            ['Aarav Sharma', 'Pizza Palace', 'Margherita Pizza', 299.00, 'delivered'],
            ['Priya Singh', 'Burger Hub', 'Cheese Burger', 149.00, 'delivered'],
            ['Rohan Mehta', 'Sushi World', 'California Roll', 399.00, 'placed'],
            ['Sneha Iyer', 'Pizza Palace', 'Pepperoni Pizza', 349.00, 'preparing'],
            ['Kabir Khan', 'Curry House', 'Butter Chicken', 279.00, 'delivered'],
            ['Ananya Rao', 'Burger Hub', 'Veg Burger', 129.00, 'placed'],
            ['Vivaan Gupta', 'Sushi World', 'Salmon Nigiri', 449.00, 'delivered'],
            ['Ishita Nair', 'Curry House', 'Paneer Tikka', 249.00, 'preparing'],
            ['Aditya Verma', 'Pizza Palace', 'Farmhouse Pizza', 379.00, 'delivered'],
            ['Meera Joshi', 'Burger Hub', 'Chicken Burger', 179.00, 'placed'],
            ['Dev Patel', 'Sushi World', 'Dragon Roll', 429.00, 'delivered'],
            ['Riya Kapoor', 'Curry House', 'Dal Makhani', 199.00, 'delivered'],
            ['Arjun Malhotra', 'Pizza Palace', 'Veggie Supreme', 329.00, 'placed'],
            ['Tanvi Desai', 'Burger Hub', 'Double Patty Burger', 219.00, 'preparing'],
            ['Karan Bose', 'Sushi World', 'Tempura Roll', 389.00, 'delivered']
          ];

          const insertSQL = `
            INSERT INTO orders (customer_name, restaurant_name, item_name, price, order_status)
            VALUES ?
          `;

          rootConnection.query(insertSQL, [sampleOrders], (err, result) => {
            if (err) {
              console.error('Error inserting sample data:', err.message);
              process.exit(1);
            }
            console.log(`Inserted ${result.affectedRows} sample orders.`);
            console.log('Database setup complete! You can now run: node server.js');
            rootConnection.end();
          });
        });
      });
    });
  });
});
