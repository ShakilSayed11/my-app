// Fetch the API key and Sheet ID from the config file
async function fetchConfig() {
    const response = await fetch('/config.json');
    return response.json();
}

document.getElementById('data-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const config = await fetchConfig();
    const apiKey = config.API_KEY;
    const sheetId = config.SHEET_ID;

    const fromDate = document.getElementById('from-date').value;
    const toDate = document.getElementById('to-date').value;
    const agentName = document.getElementById('agent-name').value;
    const department = document.getElementById('department').value;
    const region = document.getElementById('region').value;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:I?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    // Filter data based on user input
    const filteredData = data.values.filter(row => {
        const taskDate = new Date(row[4]);
        return (!fromDate || new Date(fromDate) <= taskDate) &&
               (!toDate || taskDate <= new Date(toDate)) &&
               (!agentName || row[0].includes(agentName)) &&
               (!department || row[1].includes(department)) &&
               (!region || row[2].includes(region));
    });

    // Convert filtered data to Excel
    const worksheet = XLSX.utils.aoa_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, 'FilteredData.xlsx');
});
