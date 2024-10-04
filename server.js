const express = require('express');
const app = express();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_departments_employees_db');
const port = process.env.PORT || 3000;

app.use(express.json())