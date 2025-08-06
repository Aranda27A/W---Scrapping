//Tables Scrapping/ 
//Aqui es un ejemplo de como scrappear una tabla, lo cual es importante, se siguen los pasos de un scrapp oringial.

import axios from "axios";
import { load } from "cheerio";
import fs from "fs"

async function Main() {
    try {
        const website = await axios.get("https://codingwithstefan.com/table-example");
        const html  = website.data
        
        fs.writeFileSync("./Extract.html" , html)
        const $ = load(html)  
        const object = []  
        $("tr").each((index,Element)=> {
            
            if (index === 0) return true

            const   name = $($(Element).find("td")[0]).text()
            const   Company  = $($(Element).find("td")[1]).text()
            const   place = $($(Element).find("td")[2]).text()
            
            const companyScrapped = {name, Company, place}
             object.push(companyScrapped)
        })
        console.log(object);

    
    } catch (error) {
        console.log(error, "No se encontro lo que deseabas.");
    }
    
}
Main()