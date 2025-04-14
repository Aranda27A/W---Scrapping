import axios from "axios";
import { load } from "cheerio";
import fs from "fs"

async function main() {
    try{
        const document = await axios.get("https://reactnativetutorial.net/css-selectors/lesson5.html")
        const html = document.data
        
        fs.writeFileSync("./test2.html" , html)
        const $ = load(html)
        const final  = $(".red").text()
        
        console.log(final);

    }catch(error){
        console.log(error);
    }
    
}
main()