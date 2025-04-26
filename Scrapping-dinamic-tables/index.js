// in a dinamic way 
import axios from "axios";
import { load } from "cheerio";
import fs from "fs"

async function Main() {
    try {
        const website = await axios.get("https://www.worldometers.info/world-population/population-by-country/");
        const html  = website.data
        
        fs.writeFileSync("./Extract.html" , html)
        const $ = load(html)  
        const DataBase = [] 
         const titles = [] 
        $("tr").each((index,Element)=> {
            
        
            
             if (index === 0){
                 const ths = $(Element).find("th")
                 ths.each((index, Element)=> {
                     titles.push(
                         $(Element)
                                  .text()
                                  .toLowerCase()
                    );
                });


             return true

             } 

             const tds = $(Element).find("td")
             const tableRow = {}
             tds.each((index, Element)=> {
                tableRow[titles[index]] = $(Element).text()
                tableRow.push
               

            });

             DataBase.push(tableRow)

        });

        console.log(DataBase);

    
    } catch (error) {
        console.log( "No se encontro lo que deseabas.");
    }
    
}
Main()