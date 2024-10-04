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
app.get('/api/departments', async (req, res, next) => {
  try {
    const SQL = `
      SELECT * from departments
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex)
  }
});

app.get('/api/employees', async (req, res, next) => {
  try {
    const SQL = `
      SELECT * from employees ORDER BY created_at DESC;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex)
  }
});

// Create 
  app.post('/api/employees', async (req, res, next) => {
    try {
      const SQL = `
        INSERT INTO employees(name, department_id)
        VALUES($1, $2)
        RETURNING *
      `;
      const response = await client.query(SQL, [req.body.name, req.body.department_id]);
      res.send(response.rows[0]);
    } catch (ex) {
      next(ex)
    }
  });

  // Update
    app.put('/api/employees/:id', async (req, res, next) => {
      try {
        const SQL = `
          UPDATE employees
          SET name=$1, department_is=$2, updated_at= now()
          WHERE id=$4 RETURNING *
        `;
        const response = await client.query(SQL, [
          req.body.name,
          req.body.department_id,
          req.params.id
        ]);
        res.send(response.rows[0]);
      } catch (ex) {
        next(ex)
      }
    });

    // Delete
      app.delete('/api/employees/:id', async (req, res, next) => {
        try {
          const SQL = `
            DELETE from employees
            WHERE id = $1
          `;
          const response = await client.query(SQ, [req.params.id]);
          res.sendStatus(204);
        } catch (ex) {
          next(ex)
        }
      });

// init fucntion
const init = async () => {
  await client.connect();
  console.log('connected to database');
  let SQL = `
    DROP TABLE IF EXISTS employees;
    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments(
      id SERIAL PRIMARY KEY,
      name VARCHAR(50)
    );
    CREATE TABLE employees(
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      department_id INTEGER REFERENCES departments(id) NOT NULL
    );
  `;
  await client.query(SQL);
  console.log('tables created');
  SQL = `
    INSERT INTO departments(name) VALUES('Management');
    INSERT INTO departments(name) VALUES('Designers');
    INSERT INTO departments(name) VALUES('Finance');
    INSERT INTO employees(name, department_id) VALUES('Simba', (SELECT id FROM departments WHERE name='Management'));
    INSERT INTO employees(name, department_id) VALUES('Nala', (SELECT id FROM departments WHERE name='Management'));
    INSERT INTO employees(name, department_id) VALUES('Ozan', (SELECT id FROM departments WHERE name='Designers'));
    INSERT INTO employees(name, department_id) VALUES('Rose', (SELECT id FROM departments WHERE name='Designers'));
    INSERT INTO employees(name, department_id) VALUES('Mariana', (SELECT id FROM departments WHERE name='Finance'));
    INSERT INTO employees(name, department_id) VALUES('Bobby', (SELECT id FROM departments WHERE name='Finance'));
  `;
  await client.query(SQL);
  console.log('data seeded');
  app.listen(port, () => console.log(`listening on port ${port}`));
}

// init invoke
init ();