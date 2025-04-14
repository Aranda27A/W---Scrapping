
import fs from "fs";
import axios from "axios";
    import * as cheerio  from "cheerio";


async function main() {
    try {
        const respone = await axios.get("https://reactnativetutorial.net/css-selectors/");
        const html = respone.data
        fs.writeFileSync("./test.html", html)
        const $ =   cheerio.load(html);
        const titulo = $('h1').text()
        console.log(titulo);


    }catch (error){
        console.error("error in fetching" , error.message);

    }




}

main();