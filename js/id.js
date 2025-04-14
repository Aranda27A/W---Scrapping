import { load } from "cheerio";
import axios from "axios";
import fs from "fs" 

async function Main() {

    try{
        const document = await axios.get("https://reactnativetutorial.net/css-selectors/lesson3.html")
        const html =  document.data;
        fs.writeFileSync("./test2.html", html);

        const $ = load(html)
       const tit = $("#red").text()
       console.log(tit);

    }catch(error){

        console.log("error" ,  error);
    }
    
}

Main()