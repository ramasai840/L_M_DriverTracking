// ... [Your initial setup including imports and JWT client configuration] ...

const express = require('express');
const {google} = require('googleapis');
const {JWT} = require('google-auth-library');
const keys = require('./serviceAcc_keys.json');
const path = require('path');
const googleMapsClient = require('@google/maps').createClient({
    key: <YOUR_API_KEY>,
    Promise: Promise
});


const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({version: 'v4', auth: client});
const app = express();

app.use(express.json());

// app.post('/appendToSheet', async (req, res) => {

function reverseGeocode(lat, lon) {
    return new Promise((resolve, reject) => {
        googleMapsClient.reverseGeocode({
            latlng: [lat, lon]
        }, (err, response) => {
            if (!err) {
                if (response.json.results && response.json.results[0]) {
                    resolve(response.json.results[0].formatted_address);
                } else {
                    resolve("Unknown Location");
                }
            } else {
                reject(err);
            }
        });
    });
}


function extractLatLng(locationString) {
    if (!locationString) {
        return null;
    }
    const matches = locationString.match(/lat:(\s*[\d.-]+),\s*lon:(\s*[\d.-]+)/);
    if (matches && matches[1] && matches[2]) {
        return {
            lat: parseFloat(matches[1].trim()),
            lon: parseFloat(matches[2].trim())
        };
    }
    return null;
}




app.post('/appendToSheet', async (req, res) => {
    console.log("Received request:", req.body); 

    try {

        let startLocation = req.body.startLocation;
        let endLocation = req.body.endLocation;

        //check if the sheet is empty
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: '<YOUR_SPREADSHEET_ID>',
            range: 'Sheet1!A1:F1',
        });

        // If sheet is empty or headers are not set, initialize headers
        if (!response.data.values || response.data.values.length === 0) {
            await sheets.spreadsheets.values.append({
                spreadsheetId: '<YOUR_SPREADSHEET_ID>',
                range: 'Sheet1!A1',
                valueInputOption: 'RAW',
                insertDataOption: 'OVERWRITE',
                resource: {
                    values: [['name', 'car model', 'start time', 'start location', 'end time', 'end location']]
                }
            });

            // Update the format of the header row to make it bold

        }        
        if (req.body.action === "start") {
            await sheets.spreadsheets.values.append({
                spreadsheetId: '<YOUR_SPREADSHEET_ID>',
                range: 'A1',
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                resource: {
                    values: [[
                        req.body.name, 
                        req.body.carModel, 
                        req.body.startTime, 
                        req.body.startLocation,
                        "",  // Placeholder for endTime
                        ""   // Placeholder for endLocation
                    ]]
                }
            });
            res.send('Data saved');
        } else if (req.body.action === "end") {
            // Retrieve rows from Google Sheets
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: '<YOUR_SPREADSHEET_ID>',
                range: 'Sheet1'
            });
            
            const rows = response.data.values;
            let rowIndex = null;

            // Identify the row that needs updating
            for (let i = 0; i < rows.length; i++) {
                if (rows[i][0] === req.body.name && rows[i][1] === req.body.carModel && !rows[i][4]) {
                    rowIndex = i;
                    break;
                }
            }

            if (rowIndex !== null) {
                // Update the identified row
                await sheets.spreadsheets.values.update({
                    spreadsheetId: '<YOUR_SPREADSHEET_ID>',
                    range: `Sheet1!E${rowIndex + 1}:F${rowIndex + 1}`,
                    valueInputOption: 'RAW',
                    resource: {
                        values: [[
                            req.body.endTime, 
                            req.body.endLocation
                        ]]
                    }
                });
                res.send('End trip details updated');
            } else {
                res.send('No matching start trip found');
            }
        }
    } catch (error) {
        console.error('Error saving data: ', error);
        res.send('Failed to save');
    }
});


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join("<YOUR_FOLDER_PATH>",'index.html'));
});


app.listen(<PORT_NUMBER>, () => {
    console.log("Server started on port <PORT_NUMBER>");
});

