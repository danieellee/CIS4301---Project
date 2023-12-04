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
