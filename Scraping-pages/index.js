import axios from "axios";
import { load } from "cheerio";
import fs from "fs"


async function Main() {

    try{

        const Extract = await axios.get("https://braigslist.vercel.app/jobs/1/")
        const html = Extract.data

        fs.writeFileSync("./extract.html" ,  html)
     
       
        const $ = load(html)
        $(".title-blob").each((Number, Element)=> {
           
           const Titulo = ($(Element).text())
            const json = {Number, Titulo}
            console.log(json);
            

        })

    }catch(error){
        console.log( "Error to find" , error);
    };
    
}
Main()