import axios from "axios";
import {load} from "cheerio"
import fs from "fs"
import { Parser } from "json2csv";

async function Scrape() {

    const page = await axios.get("https://en.wikipedia.org/wiki/List_of_tallest_buildings")
    const html = page.data

    const $ = load(html)

    const TablaBuildings = $(".sortable.wikitable").first()
    const structureList = []
    
    let lastName = ''
    let lastHeight = ''
    let lastFloor = ''
    let lastCity = '';
    let lastCountry = '';
    
     
    TablaBuildings.find("tbody tr").each((i, row) => {
        const column = $(row).find("td")
        if (column.length === 0) return;

        if (column.length > 1){
        const number = i // skiping the order of the wiki table due mistakes taken by te code, choosing a clasicc order.    
        const name = $(column[1]).find("a").text().trim() ||$(column[1]).text().trim() || lastName
        const height = $(column[2]).text().trim() || lastHeight
        const floors = $(column[4]).text().trim() || lastFloor
        const city = $(column[6]).text().trim() || lastCity
        const country = $(column[7]).find("a").text() || lastCountry
         
        if ($(column[0]).text().trim())  lastNumber = number;
        if ($(column[1]).text().trim())  lastName = name;
        if ($(column[2]).text().trim())  lastHeight = height;
        if ($(column[4]).text().trim())  lastFloor = floors;
        if ($(column[6]).text().trim())  lastCity = city;
        if ($(column[7]).find("a").text().trim())  lastCountry = country;

         structureList.push( {number,name, height, floors,city, country})
        }else{
         
        const number = i
        const name =  $(column[0]).text().trim()
        const height =  lastHeight
        const floors = lastFloor
        const city =  lastCity
        const country = lastCountry
         structureList.push( {number,name, height, floors,city, country})
        
        }
        
        

       


   
    })
        
console.log(structureList);

const parser = new Parser();
const csv = parser.parse(structureList)
fs.writeFileSync('Bulidngs.csv',csv);
console.log("Exportado el csv");
}

Scrape()