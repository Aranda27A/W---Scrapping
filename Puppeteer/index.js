import fs from "fs"
import puppeteer from "puppeteer";


async function Main () { 
   
        const browser =  await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto("https://newyork.craigslist.org/search/tch#search=2~thumb~0")
      
        const html = await page.content();
        fs.writeFileSync("./extract.html" , html)
        
        //Important noticing that needs to wait until finds the selector
        await page.waitForSelector("a.posting-title");

       // Extract titeles in a array
   const listings = await page.$$eval("a.posting-title", elements =>
            elements.map(el => ({
              title: el.innerText.trim(), 
              url: el.href
            
            }))
          );

   const meta = await page.$$eval(".meta span[title]", elements => elements.map(el => ({date: el.getAttribute("title")})));

  // Show list of titles
  listings.forEach((post, i) => {
    console.log(`${i + 1}. ${post.title} `);
  });
  //Show The objects 
  console.log(listings);
  console.log(meta);
           
      };
    

    
   
    


Main()