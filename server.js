const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');


const app = express();
const port = 3000;

const dbConfig = {
  user: 'ethan.stalkup',
  password: 't4dWIMjgFyw37Md1XVciylgq',
  connectString: 'oracle.cise.ufl.edu/orcl'
};

app.use(cors());
// app.use(express.static('public'));

app.get('/api/crime-data/:town', async (req, res) => {
  try {
    const {town} = req.params;

    if (!town) {
      throw new Error('Town missing');
    }
    const capitalizedTown = town.charAt(0).toUpperCase() + town.slice(1);
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('select * from "CRIME_DATA" where town = :town and town is not null', [capitalizedTown]);
    await connection.close();
    res.json(result.rows);
  } catch(error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.get('/api/income-data/:town', async (req, res) => {
  try {
    const {town} = req.params;

    if (!town) {
      throw new Error('Town missing');
    }

    const capitalizedTown = town.charAt(0).toUpperCase() + town.slice(1);
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('select * from "INCOME_DATA" where town = :town and town is not null', [capitalizedTown]);
    await connection.close();
    res.json(result.rows);
  } catch(error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.get('/api/real-estate-sales/:town', async (req, res) => {
  try {
    const {town} = req.params;

    if (!town) {
      throw new Error('Town missing');
    }
    
    const capitalizedTown = town.charAt(0).toUpperCase() + town.slice(1);
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('select * from "REAL_ESTATE_SALES" where town = :town and town is not null', [capitalizedTown]);
    await connection.close();
    res.json(result.rows);
  } catch(error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// New endpoint for Query 1 with updated SQL query
app.get('/api/property-crime-vs-real-estate', async (req, res) => {
  try {
      const connection = await oracledb.getConnection(dbConfig);
      const query = `select * from "TREND1"`;

      const result = await connection.execute(query);
      await connection.close();
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New endpoint for Query 2
app.get('/api/housing-affordability', async (req, res) => {
  try {
      const connection = await oracledb.getConnection(dbConfig);
      const query = `select * from "TREND2"`;

      const result = await connection.execute(query);
      await connection.close();
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New endpoint for Query 3
app.get('/api/city-growth-sales-ratio', async (req, res) => {
  try {
      const connection = await oracledb.getConnection(dbConfig);
      const query = `select * from "TREND3"`;

      const result = await connection.execute(query);
      await connection.close();
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New endpoint for Query 4
app.get('/api/monthly-sale-price', async (req, res) => {
  try {
      const connection = await oracledb.getConnection(dbConfig);
      const query = `select * from "TREND4"`;

      const result = await connection.execute(query);
      await connection.close();
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
