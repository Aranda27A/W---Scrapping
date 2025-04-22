// in a dinamic way 
import axios from "axios";
import { load } from "cheerio";
import { table } from "console";
import fs from "fs"

async function Main() {
    try {
        const website = await axios.get("https://codingwithstefan.com/table-example");
        const html  = website.data
        
        fs.writeFileSync("./Extract.html" , html)
        const $ = load(html)  
        const object = [] 
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

            object.push(tableRow)

        });

        console.log(object);

    
    } catch (error) {
        console.log(error, "No se encontro lo que deseabas.");
    }
    
}
Main()