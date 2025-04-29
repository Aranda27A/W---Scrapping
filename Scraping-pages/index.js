import axios, { all } from "axios";
import { load } from "cheerio";
import { randomBytes } from "crypto";
import fs from "fs"
import { text } from "stream/consumers";


async function JobsScrappersFromPages() {

    try{
        const AllJobs = []
        for (let i = 1; i < 14; i++) {
    
            

        const Extract = await axios.get(`https://braigslist.vercel.app/jobs/${i}/`)
        const html = Extract.data

        fs.writeFileSync("./extract.html" ,  html)
        const $ = load(html)
        
        // $(".title-blob > a").each((Number, Element)=> {
           
        //    const Titulo = $(Element).text()
        //    const url = $(Element).attr("href")
        //    const json = {Number, Titulo, url}
        //    console.log(json);
        // })

        //Ahora con .map para ver esa funcionalidad.
        
        const json = $(".title-blob > a").map((Number, Element)=> {
           
            const Titulo = $(Element).text()
            const url = $(Element).attr("href")
             const content = Content(url)
            return {Number, Titulo, url,content}

         }).get();

         AllJobs.push(...json)
    
        };

      console.log(AllJobs); 
        return AllJobs;

    }catch(error){
        console.log( "Error to find" , error);
    };
    
}

async function Content(job) {

  
    const jobDescription = await axios.get("https://braigslist.vercel.app/" + job[1].url) 
    const $  = load(jobDescription.data)
    const Text =  $("div").text()
    return Text


     
}


async function Main() {
    const AllJobs = await JobsScrappersFromPages()
    return console.log(AllJobs);

    
}

JobsScrappersFromPages()