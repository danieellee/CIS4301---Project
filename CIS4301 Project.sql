-- Query 1
-- How has property crime affected the average real estate sales price over time? How have other crime types affected it?

CREATE TABLE crime_affect_avg_rs AS
select *
from(
(
SELECT c. YEAR, sum(c.VALUE)
from CRIME_DATA c
where  c.crime_type = 'Total Property Crime' AND c.measure_type = 'Number'
group by c.year
)
UNION ALL
(
SELECT r.listyear, avg(r.saleamount)
FROM real_estate_sales r
GROUP BY r.listyear
)
)
where year > 2009 AND year < 2018
order by year asc;


-- Query 2
-- How has the average affordability of housing (sales amount/avg income) changed over time for large towns(towns that have over 1000 recorded sales in a year)?
CREATE TABLE afford_house AS
SELECT 
    i.year, 
    AVG(r.saleamount / i.value) AS Affordability
FROM 
    REAL_ESTATE_SALES r
JOIN 
    INCOME_DATA i ON i.town = r.town
WHERE 
    i.ETHNICITY = 'All' AND 
    i.MEASURE_TYPE = 'Number' AND 
    i.VARIABLE = 'Median Household Income' AND 
    r.listyear BETWEEN 
        CAST(SUBSTR(i.year, 1, INSTR(i.year, '-') - 1) AS INTEGER) AND 
        CAST(SUBSTR(i.year, INSTR(i.year, '-') + 1) AS INTEGER) AND
    r.town IN (
        SELECT r2.town
        FROM REAL_ESTATE_SALES r2
        GROUP BY r2.town
        HAVING COUNT(*) > 1000
    )
GROUP BY 
    i.year
ORDER BY 
    i.year ASC;



-- Query 3
-- With an increase in demand for housing and the growth in population in the top 10 biggest cities, how has the sales ratio been impacted over time as the cities grow?
CREATE TABLE sale_impact_city AS
WITH TopCities AS (
    SELECT 
        town,
        COUNT(*) as TotalSales
    FROM 
        real_estate_sales
    WHERE 
        propertytype = 'Residential'
    GROUP BY 
        town
    ORDER BY 
        TotalSales DESC
)
SELECT 
    rs.town,
    EXTRACT(YEAR FROM rs.daterecorded) as Year,
    AVG(
        CASE 
            WHEN rs.assessedvalue > 0 THEN rs.saleamount/rs.assessedvalue
            ELSE 0 -- You can choose to handle this differently, like NULL
        END
    ) as AverageSalesRatio
FROM 
    real_estate_sales rs
JOIN 
    (SELECT town FROM TopCities WHERE ROWNUM <= 10) tc ON rs.town = tc.town
GROUP BY 
    rs.town, EXTRACT(YEAR FROM rs.daterecorded)
ORDER BY 
    rs.town, Year;


-- Query 4
-- What months have shown to have the highest average sale price, and what months have shown to have the worst average sale price?
CREATE TABLE high_avgPrice_month AS
SELECT 
    EXTRACT(MONTH FROM r.daterecorded) AS SaleMonth,
    AVG(r.saleamount) AS AverageSalePrice
FROM 
    real_estate_sales r
GROUP BY 
    EXTRACT(MONTH FROM r.daterecorded)
ORDER BY 
    AverageSalePrice DESC;
    

-- Query 5
-- How does an increase of crime rate or economic growth overtime in an area have an effect on the amount of time that the property sits on the market waiting for a buyer?
CREATE TABLE crime_rate_econ_grow_affect_house AS
SELECT 
    res.town, 
    res.listyear,
    AVG(res.saleamount) AS AverageSaleAmount,
    AVG(id.value) AS AverageIncome,
    AVG(cd.value) AS AverageCrimeRate
FROM 
    real_estate_sales res
JOIN 
    income_data id ON res.town = id.town 
                   AND res.listyear BETWEEN 
                       CAST(SUBSTR(id.year, 1, INSTR(id.year, '-') - 1) AS INTEGER) 
                       AND CAST(SUBSTR(id.year, INSTR(id.year, '-') + 1) AS INTEGER)
JOIN 
    crime_data cd ON res.town = cd.town 
                   AND res.listyear = cd.year
WHERE 
    id.measure_type = 'Number' AND 
    id.variable = 'Median Household Income' AND 
    cd.measure_type = 'Number' 
GROUP BY 
    res.town, 
    res.listyear
ORDER BY 
    res.town, 
    res.listyear;


SELECT COUNT(*) AS Number_of_Tuples_in_Real_Estate_Sales FROM real_estate_sales;
SELECT COUNT(*) AS Number_of_Tuples_in_Crime_Data FROM crime_data;
SELECT COUNT(*) AS Number_of_Tuples_in_Income_Data FROM income_data;
