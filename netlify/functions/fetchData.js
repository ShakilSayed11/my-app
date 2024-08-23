// netlify/functions/fetchData.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { API_KEY, SHEET_ID } = process.env;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:I?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Handle errors by returning the response text
            const errorText = await response.text();
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: errorText }),
            };
        }
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
