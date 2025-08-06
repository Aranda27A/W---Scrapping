import axios, { all } from "axios";
import { load } from "cheerio";
import fs from "fs"





async function JobsScrappersFromPages() {

    try{
        const AllJobs = []
        for (let i = 1; i < 14; i++) {

            const Extract = await axios.get(`https://braigslist.vercel.app/jobs/${i}/`)
            const html = Extract.data

           await timeWait(3000)
            fs.writeFileSync("./extract.html" ,  html)
            const $ = load(html)
        
        //Aqui se obtiene uno por uno con each de cheerio (Parecido a jquery  )
            // $(".title-blob > a").each((Number, Element)=> {
            
            //        const Titulo = $(Element).text()
            //        const url = $(Element).attr("href")
            //        const content = await Content(url) 
            //         return  {Number, Titulo, url, content}
            //       
            // });

        //Ahora con .map para ver esa funcionalidad.
        
            const json = await Promise.all( 
                        $(".title-blob > a").map( async(Number, Element)=> {
           
                        const Titulo = $(Element).text()
                        const url = $(Element).attr("href")
                        const content = await  Content(url)        /// Es necesario un await para que no regrese una promise.
       
                        return {Number, Titulo, url,content}
          

                        }).get() //Always use get cuando hacemos map een cheerio
                        
           );

   
         AllJobs.push(...json)
         console.log('Page Scrapped: ' + i);
    
        };
        
          
     console.log(AllJobs);
     return AllJobs;
      

    }catch(error){
        console.log( "Error to find" , error);
    };
    
}

async function Content(url) {

  
    const jobDescription = await axios.get("https://braigslist.vercel.app/" + url) 
    const $  = load(jobDescription.data)
    const Text =  $("div").text() 
    return Text    
    
}

const  timeWait = (ms) => new Promise((r) => {
    setTimeout(r, ms)
});

async function Main() {
    const AllJobs = await JobsScrappersFromPages()

  return AllJobs

   
}

Main()