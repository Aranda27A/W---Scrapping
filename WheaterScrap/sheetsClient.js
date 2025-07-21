import { google} from "googleapis";





const auth = new google.auth.GoogleAuth({
    keyFile: "./.env/wheater-scrapping-1fccc28470b2.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({version: "v4" ,auth: await auth.getClient()});

const spreadsheetId = "1gdOoAoBa3G0A9vGFaceaPoncjJLjehe4TkBeXzXTXmY"
const spreedName = "Hoja1"

export async function exportToSpreed(data) {

  const values = data.map(obj => Object.values(obj));

  await sheets.spreadsheets.values.update({
      spreadsheetId, 
      range: `${spreedName}!A1`, 
      valueInputOption: "RAW",
      requestBody: {
            values: [
              Object.keys(data[0]),//head title
              ...values   //datos
            ],
      },
  });

  console.log("Export to google Sheets");
  
}