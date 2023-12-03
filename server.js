const oracledb = require('oracledb');
const fs = require('fs');
const fastcsv = require('fast-csv');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function crime_affect_avg_rs() {
    let con;

    try {
        con = await oracledb.getConnection( {
            user: "daniellee",
            password: "3OBQ9O8GEqlentTtlt2qiarC",
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const query = `
            SELECT * FROM crime_affect_avg_rs
        `;

        const result = await con.execute(query);

        const rows = result.rows;

        // Convert fetched data to CSV
        const ws = fs.createWriteStream("crime_affect_avg_rs.csv");
        fastcsv
            .write(rows, { headers: true })
            .on("finish", function() {
                console.log("Write to crime_affect_avg_rs.csv successfully!");
            })
            .pipe(ws);

    } catch (err) {
        console.error(err);
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function afford_house() {
    let con;

    try {
        con = await oracledb.getConnection( {
            user: "daniellee",
            password: "3OBQ9O8GEqlentTtlt2qiarC",
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const query = `
            SELECT * FROM afford_house
        `;

        const result = await con.execute(query);

        const rows = result.rows;

        // Convert fetched data to CSV
        const ws = fs.createWriteStream("afford_house.csv");
        fastcsv
            .write(rows, { headers: true })
            .on("finish", function() {
                console.log("Write to afford_house.csv successfully!");
            })
            .pipe(ws);

    } catch (err) {
        console.error(err);
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function sale_impact_city() {
    let con;

    try {
        con = await oracledb.getConnection( {
            user: "daniellee",
            password: "3OBQ9O8GEqlentTtlt2qiarC",
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const query = `
            SELECT * FROM sale_impact_city
        `;

        const result = await con.execute(query);

        const rows = result.rows;

        // Convert fetched data to CSV
        const ws = fs.createWriteStream("sale_impact_city.csv");
        fastcsv
            .write(rows, { headers: true })
            .on("finish", function() {
                console.log("Write to sale_impact_city.csv successfully!");
            })
            .pipe(ws);

    } catch (err) {
        console.error(err);
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function high_avgPrice_month() {
    let con;

    try {
        con = await oracledb.getConnection( {
            user: "daniellee",
            password: "3OBQ9O8GEqlentTtlt2qiarC",
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const query = `
            SELECT * FROM high_avgPrice_month
        `;

        const result = await con.execute(query);

        const rows = result.rows;

        // Convert fetched data to CSV
        const ws = fs.createWriteStream("high_avgPrice_month.csv");
        fastcsv
            .write(rows, { headers: true })
            .on("finish", function() {
                console.log("Write to high_avgPrice_month.csv successfully!");
            })
            .pipe(ws);

    } catch (err) {
        console.error(err);
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function crime_rate_econ_grow_affect_house() {
    let con;

    try {
        con = await oracledb.getConnection( {
            user: "daniellee",
            password: "3OBQ9O8GEqlentTtlt2qiarC",
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const query = `
            SELECT * FROM crime_rate_econ_grow_affect_house
        `;

        const result = await con.execute(query);

        const rows = result.rows;

        // Convert fetched data to CSV
        const ws = fs.createWriteStream("crime_rate_econ_grow_affect_house.csv");
        fastcsv
            .write(rows, { headers: true })
            .on("finish", function() {
                console.log("Write to crime_rate_econ_grow_affect_house.csv successfully!");
            })
            .pipe(ws);

    } catch (err) {
        console.error(err);
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function Real_Estate_Sales_Num_Tuples() {
    let con;

    try {
        con = await oracledb.getConnection( {
            user: "daniellee",
            password: "3OBQ9O8GEqlentTtlt2qiarC",
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const query = `
            SELECT COUNT(*) AS Number_of_Tuples_in_Real_Estate_Sales FROM real_estate_sales
        `;

        const result = await con.execute(query);

        const rows = result.rows;

        // Convert fetched data to CSV
        const ws = fs.createWriteStream("Real_Estate_Sales_Num_Tuples.csv");
        fastcsv
            .write(rows, { headers: true })
            .on("finish", function() {
                console.log("Write to Real_Estate_Sales_Num_Tuples.csv successfully!");
            })
            .pipe(ws);

    } catch (err) {
        console.error(err);
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function Crime_Data_Num_Tuples() {
    let con;

    try {
        con = await oracledb.getConnection( {
            user: "daniellee",
            password: "3OBQ9O8GEqlentTtlt2qiarC",
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const query = `
            SELECT COUNT(*) AS Number_of_Tuples_in_Crime_Data FROM crime_data
        `;

        const result = await con.execute(query);

        const rows = result.rows;

        // Convert fetched data to CSV
        const ws = fs.createWriteStream("Crime_Data_Num_Tuples.csv");
        fastcsv
            .write(rows, { headers: true })
            .on("finish", function() {
                console.log("Write to Crime_Data_Num_Tuples.csv successfully!");
            })
            .pipe(ws);

    } catch (err) {
        console.error(err);
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function Income_Data_Num_Tuples() {
    let con;

    try {
        con = await oracledb.getConnection( {
            user: "daniellee",
            password: "3OBQ9O8GEqlentTtlt2qiarC",
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const query = `
            SELECT COUNT(*) AS Number_of_Tuples_in_Income_Data FROM income_data
        `;

        const result = await con.execute(query);

        const rows = result.rows;

        // Convert fetched data to CSV
        const ws = fs.createWriteStream("Income_Data_Num_Tuples.csv");
        fastcsv
            .write(rows, { headers: true })
            .on("finish", function() {
                console.log("Write to Income_Data_Num_Tuples.csv successfully!");
            })
            .pipe(ws);

    } catch (err) {
        console.error(err);
    } finally {
        if (con) {
            try {
                await con.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

crime_affect_avg_rs();
afford_house();
sale_impact_city();
high_avgPrice_month();
crime_rate_econ_grow_affect_house();

Income_Data_Num_Tuples();
Crime_Data_Num_Tuples();
Real_Estate_Sales_Num_Tuples();
