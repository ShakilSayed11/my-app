// netlify/functions/fetchData.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { API_KEY, SHEET_ID } = process.env;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:I?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data' }),
        };
    }
};

