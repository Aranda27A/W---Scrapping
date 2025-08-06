// sheetsClient.js

import {google} from "googleapis"

// Simular __dirname en ESM


const KEYFILEPATH = "C:/Users/alex_/Escritorio/Aranda Coding/.secrets/wheater-scrapping-a13fe995fea4.json";

// Scope necesario para editar Google Sheets
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});


const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });

const spreadsheetId = "1gdOoAoBa3G0A9vGFaceaPoncjJLjehe4TkBeXzXTXmY";
const sheetName = "Hoja1";

export async function exportToSheet(data) {

  const readingData = await sheets.spreadsheets.values.get({
    spreadsheetId , 
    range: `${sheetName}!A1:Z1000`
  });

  const existingValues = readingData.data.values || [];

  const headers = existingValues[0] ||  Object.keys(data[0]);
  const existingData = existingValues.slice(1).map(row=> {
    const obj = {};
    headers.forEach((h,i)=> {
      obj[h] = row[i] || "";
    })
    return obj;
  })

  const combined = [...existingData];

  data.forEach(newItem => {
    const index = combined.findIndex(item => item.fecha === newItem.fecha)
    if (index >= 0){
      combined[index] = newItem;

    }else{
      combined.push(newItem);
    }
  });

  const headersToWrite = headers.filter(h => h !== "nombre");

const valuesToWrite = [
  headersToWrite,
  ...combined.map(obj => {
    const row = headersToWrite.map(h => obj[h] || "");
    return row;
})]
  
await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: `${sheetName}!A1`,
  valueInputOption: "RAW",
  requestBody: {values: valuesToWrite}
});

  console.log("Export hisotoric to Google Sheets");/////////////////////////////////////////////////////////////////
}

