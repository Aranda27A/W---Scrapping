import axios from "axios";
import fs from 'fs';

async function get(url) {

 const html= await axios.get(url)
 return html.data
}

async function save(html) {

    fs.writeFileSync("./test.html", html)
    
}


async function main() {
    const html = await get("https://dallas.craigslist.org/search/eve#search=2~list~0")
    await save(html)

}

main()

