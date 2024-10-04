// import for express and pg
const express = require('express');
const app = express();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_departments_employees_db');
const port = process.env.PORT || 3000;

// APP ROUTES
// parse body into JS objects
app.use(express.json())
// log requests as they come in

// Read 
// Create 
// Update
// Delete

// init fucntion
const init = async () => {
  await client.connect();
  console.log('connected to database');
  let SQL = `
  
  `;
  await client.query(SQL);
  console.log('tables created');
  SQL = `
  
  `;
  await client.query(SQL);
  console.log('data seeded');
  app.listen(port, () => console.log(`listening on port ${port}`));
}

// init invoke
init ();