import puppeteer from "puppeteer";
import fs from "fs";
import parse, { Parser } from "json2csv"
import { error } from "console";



async function WtrChek(page) {




  // Extraer datos de los días
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
    const urls = ["https://www.tiempo.com/tel-aviv.htm" , 
"https://www.tiempo.com/israel/tel-aviv/proxima-semana"  ]   
  const Database = []

  const browser = await puppeteer.launch({ headless: true });
  const Meteored = await browser.newPage();


  for (const url of urls) {

    try{
        await Meteored.goto(url, {waitUntil: "networkidle2",});
        const html = await Meteored.content();
        fs.writeFileSync("./Page.html", html);  
        const extractdata = await WtrChek(Meteored)
        Database.push(...extractdata)
       
    }catch (error) {
  console.log("Error, no se pudo cargar la URL:", url);
  console.error(error);
    }
  }

  await browser.close()
   console.log(Database);
   
  try{
    const Outdir = "C:/Users/alex_/Escritorio/Aranda Coding/scrapping/WheaterScrap/csv"
    const parse = new  Parser() 
    const csv = parse.parse(Database)
    fs.writeFileSync(`${Outdir}/14dayOfwheater.csv`,csv) 
    console.log("Exportado con exito");


  }catch(error){
    console.log(error, "Not possible get the CSV");
  }

  csvHistory(Database)

}

function csvHistory (DataBase){

 const Outdir = "C:/Users/alex_/Escritorio/Aranda Coding/scrapping/WheaterScrap/csv"
 const DatabaseHistory = DataBase.map(({nombre , ...resto}  )=> resto)
 
 try{
    const parse = new Parser()
    const csvHistory = parse.parse(DatabaseHistory)
    fs.writeFileSync(`${Outdir}/Wheater History.csv`, csvHistory)
    console.log("Second Csv exported")
 } catch (error) {
  console.log(error, "Unkwon error");
 }


}




main()
