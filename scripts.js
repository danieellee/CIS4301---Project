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

