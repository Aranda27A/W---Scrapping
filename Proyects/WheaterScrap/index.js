import puppeteer from "puppeteer";    //Base code for web scrapping, using task schedule of windows so is standard to run in the system                                       //
import fs from "fs";                  //Follow all the steps, because is the base for future simples scrappings
import { Parser } from "json2csv"     //On comments you can find some debugings
import {exportToSheet} from "./SheetClient.js"
import {WtrChek} from "./scrapper.js"
import {csvHistory} from "./csvHistory.js"


async function main() {

  try{


      const urls = ["https://www.tiempo.com/tel-aviv.htm" , 
      "https://www.tiempo.com/israel/tel-aviv/proxima-semana"  ]    //In this particular case we extract with 2 urls, could be a differrent case.
      const Database = []

      const browser = await puppeteer.launch({ headless: true,});
      const Meteored = await browser.newPage();


      for (const url of urls) {

        try{
            await Meteored.goto(url, {waitUntil: "networkidle2",});
            //const html = await Meteored.content();  ****here just in case you need to extract a html to see if your puppeter could get the data**
            //fs.writeFileSync(`C:/Users/alex_/Escritorio/Aranda Coding/scrapping/WheaterScrap/debug_html_task.html`, html); 
            const extractdata = await WtrChek(Meteored) //Calling extract data function
            Database.push(...extractdata) //we make one array from the 2 urls

        }catch (error) {
          console.log("Error, no se pudo cargar la URL:", url);
          console.error(error);
        }
      }

    await browser.close()
    console.log(Database);

      try{

        const Outdir ="C:/Users/alex_/Escritorio/Aranda Coding/scrapping/Proyects/WheaterScrap/csv/"
        const parse = new  Parser() 
        const csv = parse.parse(Database)
      
        fs.writeFileSync(Outdir + "14daysWheater.csv" ,csv) //To use task scheduler follow this format of writting
        console.log("Exportado con exito");


      }catch(error){
        console.log(error, "Not possible get the CSV");
      }

    csvHistory(Database)
    await exportToSheet(Database)

    
     fs.writeFileSync("C:/Users/alex_/Escritorio/Aranda Coding/scrapping/Proyects/WheaterScrap/log.txt", `Succeded run to the date: ${new Date().toISOString()}`);
   //***this debug was to see if is runed main function throught task manager */



  }catch (error) {
      console.error("CSV Export Error:", error.message, error.stack);
  }
}



main()




