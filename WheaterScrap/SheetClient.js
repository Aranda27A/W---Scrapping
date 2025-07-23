// sheetsClient.js

import {google} from "googleapis"
import path from "path"
import { fileURLToPath } from "url";

// Simular __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEYFILEPATH = path.resolve(__dirname, "../.secrets/wheater-scrapping-1fccc28470b2.json");

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
  const values = data.map((obj) => Object.values(obj));

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [Object.keys(data[0]), ...values],
    },
  });

  console.log("Export to Google Sheets");
}