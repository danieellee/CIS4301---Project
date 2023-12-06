document.getElementById('search-button').addEventListener('click', async () => {
  const townInput = document.getElementById('search-box').value.trim();

  if (!townInput) {
    displayError('Please enter a town name.');
    return;
  }

  // Fetch all data concurrently
  try {
    const [crimeData, incomeData, realEstateData] = await Promise.all([
      fetchData(`http://localhost:3000/api/crime-data/${encodeURIComponent(townInput)}`),
      fetchData(`http://localhost:3000/api/income-data/${encodeURIComponent(townInput)}`),
      fetchData(`http://localhost:3000/api/real-estate-sales/${encodeURIComponent(townInput)}`)
    ]);

    plotCrimeData(crimeData);
    
    displayData(crimeData, 'crime-data-display');
    displayData(incomeData, 'income-data-display');
    displayData(realEstateData, 'real-estate-data-display');
  } catch (error) {
    displayError('Error fetching data: ' + error.message);
  }
});

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

function displayData(data, elementId) {
  const display = document.getElementById(elementId);
  // Clear previous data
  display.textContent = '';

  // Check if data is empty
  if (!data || data.length === 0) {
    display.textContent = 'No data found for the specified town.';
    return;
  }

  // Create a JSON string with indentation for displaying
  const formattedData = JSON.stringify(data, null, 2);
  display.textContent = formattedData;
}

document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayQueryData();
});

async function fetchAndDisplayQueryData() {
  try {
    const propertyCrimeVsRealEstateData = await fetchData('http://localhost:3000/api/property-crime-vs-real-estate');
    plotPropertyCrimeVsRealEstate(propertyCrimeVsRealEstateData, 'property-crime-vs-real-estate-chart-container', 'property-crime-vs-real-estate-data-display');

    const housingAffordabilityData = await fetchData('http://localhost:3000/api/housing-affordability');
    plotHousingAffordability(housingAffordabilityData, 'housing-affordability-chart-container', 'housing-affordability-data-display');

    const cityGrowthSalesRatioData = await fetchData('http://localhost:3000/api/city-growth-sales-ratio');
    plotCityGrowthSalesRatio(cityGrowthSalesRatioData, 'city-growth-sales-ratio-chart-container', 'city-growth-sales-ratio-data-display');

    const monthlyAverageSalePriceData = await fetchData('http://localhost:3000/api/monthly-sale-price');
    plotMonthlyAverageSalePrice(monthlyAverageSalePriceData, 'monthly-average-sale-price-chart-container', 'monthly-average-sale-price-data-display');
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}


function displayError(message) {
  // Clear all data displays
  document.querySelectorAll('.data-display').forEach(display => {
    display.textContent = '';
  });

  // Display error message in the first data display
  const display = document.getElementById('crime-data-display');
  display.innerHTML = `<p class="error-message">${message}</p>`;
}

// Assuming Chart.js is included in your project
async function plotCrimeData(crimeData) {
  // Get the chart container and clear any existing content
  const chartContainer = document.getElementById('chart-container');
  chartContainer.innerHTML = '';

  // Filter out and process data for 'Rate (per 100,000)'
  const rateData = crimeData.filter(item => item[4] === 'Rate (per 100,000)');

  // Group data by crime type
  const dataByCrime = rateData.reduce((acc, item) => {
    const crimeType = item[3].trim(); // Trim the whitespace
    const year = item[2].trim();
    const rate = item[6];

    if (!acc[crimeType]) {
      acc[crimeType] = [];
    }

    acc[crimeType].push({ year, rate });
    return acc;
  }, {});

  // Create a chart for each crime type
  Object.keys(dataByCrime).forEach(crimeType => {
    const chartDiv = document.createElement('div');
    chartDiv.classList.add('chart');

    const header = document.createElement('h3');
    header.textContent = `${crimeType} (Rate per 100,000)`;
    chartDiv.appendChild(header);

    const canvas = document.createElement('canvas');
    canvas.id = `chart-${crimeType.replace(/\s+/g, '-')}`; // Replace spaces with hyphens
    chartDiv.appendChild(canvas);

    chartContainer.appendChild(chartDiv);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataByCrime[crimeType].map(data => data.year), // X-axis labels (years)
        datasets: [{
          label: `${crimeType}`,
          data: dataByCrime[crimeType].map(data => data.rate), // Y-axis data (crime rates)
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        title: {
          display: true,
          text: `${crimeType} Over Time`
        }
      }
    });
  });
}

function plotPropertyCrimeVsRealEstate(data, chartContainerId, dataDisplayId) {
  const chartContainer = document.getElementById(chartContainerId);
  chartContainer.innerHTML = '';

  // Prepare data for plotting
  const years = data.map(item => item[0]);
  const totalCrimeValues = data.map(item => item[1]);
  const averageSaleAmounts = data.map(item => item[2]);

  // Create a canvas for the chart
  const canvas = document.createElement('canvas');
  canvas.id = 'property-crime-vs-real-estate-chart';
  chartContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: 'Total Crime Value',
        data: totalCrimeValues,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        yAxisID: 'y-axis-1',
      }, {
        label: 'Average Sale Amount',
        data: averageSaleAmounts,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y-axis-2',
      }]
    },
    options: {
      scales: {
        'y-axis-1': {
          type: 'linear',
          display: true,
          position: 'left',
        },
        'y-axis-2': {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
        },
      }
    }
  });
}

function plotHousingAffordability(data, chartContainerId, dataDisplayId) {
  const chartContainer = document.getElementById(chartContainerId);
  chartContainer.innerHTML = '';

  // Prepare data for plotting
  const years = data.map(item => item[0]);
  const affordability = data.map(item => item[1]);

  // Create a canvas for the chart
  const canvas = document.createElement('canvas');
  canvas.id = 'housing-affordability-chart';
  chartContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Affordability',
        data: affordability,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

function plotCityGrowthSalesRatio(data, chartContainerId, dataDisplayId) {
  const chartContainer = document.getElementById(chartContainerId);
  chartContainer.innerHTML = '';

  // Group data by town
  const dataByTown = data.reduce((acc, item) => {
    const town = item[0];
    if (!acc[town]) {
      acc[town] = [];
    }
    acc[town].push({ year: item[1], ratio: item[2] });
    return acc;
  }, {});

  Object.keys(dataByTown).forEach(town => {
    // Create a canvas for each town
    const canvas = document.createElement('canvas');
    canvas.id = `sales-ratio-chart-${town.replace(/\s/g, '-')}`;
    chartContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataByTown[town].map(item => item.year),
        datasets: [{
          label: `${town} Sales Ratio`,
          data: dataByTown[town].map(item => item.ratio),
          borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
          fill: false,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  });
}

function plotMonthlyAverageSalePrice(data, chartContainerId, dataDisplayId) {
  const chartContainer = document.getElementById(chartContainerId);
  chartContainer.innerHTML = '';

  // Prepare data for plotting
  const months = data.map(item => item[0]);
  const averageSalePrices = data.map(item => item[1]);

  // Create a canvas for the chart
  const canvas = document.createElement('canvas');
  canvas.id = 'monthly-average-sale-price-chart';
  chartContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Average Sale Price',
        data: averageSalePrices,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


