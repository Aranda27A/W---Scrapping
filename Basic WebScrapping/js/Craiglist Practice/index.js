import axios from "axios";
import fs from "fs";
import { load } from "cheerio";


async function Extraccion () {

    try{

    const document = await axios.get("https://telaviv.craigslist.org/")
    const html = document.data

    fs.writeFileSync("./extraccion.html" , html)
    const $ = load(html)
    $("h3").each((index, Element)=>{
            console.log( "*"+ $(Element).text())

            })
    
    }catch(error){
console.log("No encontrado", error);
    };
    
    
}

Extraccion()