import puppeteer from "puppeteer";    //Base code for web scrapping, using task schedule of windows so is standard to run in the system                                       //
import fs from "fs";                  //Follow all the steps, because is the base for future simples scrappings
import { Parser } from "json2csv"     //On comments you can find some debugings
import {parse as csvParseSync} from "csv-parse/sync"


async function WtrChek(page) {  // Extract Data from 14 days


  const dias = await page.$$eval("ul.dias_w > li.grid-item.dia", (elementos) => {
    return elementos.map((el) => {
      const nombre = el.querySelector(".text-0")?.innerText.trim();
      const fecha = el.querySelector(".subtitle-m")?.innerText.trim();
      const tempMax = el.querySelector(".temp .max")?.innerText.trim();
      const tempMin = el.querySelector(".temp .min")?.innerText.trim();
      const descripcion = el.querySelector(".prediccion img.simbW")?.alt?.trim();

      const vientoMin = el.querySelector(".velocidad .changeUnitW")?.innerText.trim();
      const vientoMax = el.querySelectorAll(".velocidad .changeUnitW")[1]?.innerText.trim();

      return {
        nombre,
        fecha,
        tempMax,
        tempMin,
        descripcion,
        vientoMin,
        vientoMax,
      };
    });
  });

 return dias

}





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

        const Outdir ="C:/Users/alex_/Escritorio/Aranda Coding/scrapping/WheaterScrap/csv/"
        const parse = new  Parser() 
        const csv = parse.parse(Database)
      
        fs.writeFileSync(Outdir + "14daysWheater.csv" ,csv) //To use task scheduler follow this format of writting
        console.log("Exportado con exito");


      }catch(error){
        console.log(error, "Not possible get the CSV");
      }

    csvHistory(Database)
     fs.writeFileSync("C:/Users/alex_/Escritorio/Aranda Coding/scrapping/WheaterScrap/log.txt", `Succeded run to the date: ${new Date().toISOString()}`);
   //***this debug was to see if is runed main function throught task manager */



  }catch (error) {
      console.error("CSV Export Error:", error.message, error.stack);
  }
}








 function csvHistory (DataBase){  //Function for making the historial for temperatures adding information to a base docuement

  // debuging---->  fs.writeFileSync("C:/Users/alex_/Escritorio/Aranda Coding/scrapping/WheaterScrap/debug_data_Init.json", JSON.stringify(DataBase, null, 2));
    const Outdir = "C:/Users/alex_/Escritorio/Aranda Coding/scrapping/WheaterScrap/csv/"
    const HisotryPath = Outdir + "Wheater History.csv"


  const todayUpdateRecord = DataBase.map(({nombre , ...resto}  )=> resto) //No extraer los dias

  // debuging----> fs.writeFileSync("C:/Users/alex_/Escritorio/Aranda Coding/scrapping/WheaterScrap/debug_export1.txt", "before parser");

  let record = [];
  if(fs.existsSync(HisotryPath)){
    const fileContent = fs.readFileSync(HisotryPath, "utf8")

           if (fileContent.length > 0) {
            try {
              record = csvParseSync(fileContent, {
                columns: true,  
                skip_empty_lines: true,
              });
            } catch (err) {
              console.error("Error al parsear el historial existente:", err);
            }
   
  }

  const FullData = [...record, ...todayUpdateRecord]
  const nonDuple = Array.from(new Map(FullData.map(i=>[i.fecha , i])).values());


 
 try{

    
    const parser = new Parser()
    const csvHistory = parser.parse(nonDuple)
    fs.writeFileSync(Outdir + "Wheater History.csv", csvHistory)
    console.log("Second Csv exported")
 } catch (error) {
  console.log(error, "Unkwon error");
 }

}
}

main()
