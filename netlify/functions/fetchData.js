// netlify/functions/fetchData.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    console.log("Function invoked");

    const { API_KEY, SHEET_ID } = process.env;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:I?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: errorText }),
            };
        }
        const data = await response.json();
        console.log('Data fetched:', data);
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data' }),
        };
    }
};
