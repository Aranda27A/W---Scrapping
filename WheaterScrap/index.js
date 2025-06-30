import puppeteer from "puppeteer";
import fs from "fs";
import { url } from "inspector";


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
    let Database = []

  const browser = await puppeteer.launch({ headless: true });
  const Meteored = await browser.newPage();


  for (const url of urls) {

    try{
        await Meteored.goto(url, {waitUntil: "networkidle2",});
        const html = await Meteored.content();
        fs.writeFileSync("./Page.html", html);  
        
        Database.push(await WtrChek(Meteored))
       
    }catch (error) {
  console.log("Error, no se pudo cargar la URL:", url);
  console.error(error);
    }
  }

  const csvFormat = Database.map(arr => {
    return arr.join(",")
  })


  await browser.close()
  return csvFormat

    
}




main()
