const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');


const app = express();
const port = 3000;

const dbConfig = {
    user: 'volstadc',
    password: 'EHAdklPp0KSIA595qd87ffQC',
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
    const result = await connection.execute('select * from "ETHAN.STALKUP"."CRIME_DATA" where town = :town and town is not null', [capitalizedTown]);
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
    const result = await connection.execute('select * from "ETHAN.STALKUP"."INCOME_DATA" where town = :town and town is not null', [capitalizedTown]);
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
    const result = await connection.execute('select * from "ETHAN.STALKUP"."REAL_ESTATE_SALES" where town = :town and town is not null', [capitalizedTown]);
    await connection.close();
    res.json(result.rows);
  } catch(error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});