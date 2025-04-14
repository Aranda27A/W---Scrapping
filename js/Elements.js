import { load } from "cheerio";
import axios from "axios";
import fs from "fs"


async function Main() {
    try{
     const respone = await axios.get("https://reactnativetutorial.net/css-selectors/lesson2.html")
     const html = respone.data

     fs.writeFileSync("./test.html", html)
     const $ = load(html)
        $("h2").each((index, element) => {
        console.log($(element).text());
        
     });
    }catch(error){
        console.log("error message" , error);
    }
    
}

Main()