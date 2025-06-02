import axios from "axios";
import {load} from "cheerio"

async function Scrape() {

    const page = await axios.get("https://en.wikipedia.org/wiki/List_of_tallest_buildings")
    const html = page.data

    const $ = load(html)

    const TablaBuildings = $(".sortable.wikitable").first()
    const structureList = []
    
    let lastNumber = '';
    let lastCity = '';
    let lastCountry = '';
    
     
    TablaBuildings.find("tbody tr").each((i, row) => {
        const column = $(row).find("td")

        if (column.length === 0) return;
        const number = $(column[0]).text() || lastNumber
        const name = $(column[1]).find("a").text().trim()
        const height = $(column[2]).text().trim()
        const floors = $(column[4]).text().trim()
        const city = $(column[6]).text().trim()
        const country = $(column[7]).find("a").text()

   if ($(column[0]).text().trim()) return lastNumber = number;
        if ($(column[6]).text().trim()) return lastCity = city;
        if ($(column[7]).find("a").text().trim()) return lastCountry = country;


    structureList.push( {number,name, height, floors,city, country})
    })
        
console.log(structureList);
    
}

Scrape()