import puppeteer from "puppeteer";
import fs from "fs"
import { Parser } from "json2csv";
import {parse as csvParseSync} from "csv-parse/sync"
import { timeout } from "puppeteer";
import { withSourcePuppeteerURLIfNone } from "puppeteer";



async function Scraper(page) {
    try{




    }catch{
        console.log("Error");
    }
    
}



 async function AutoScrollUntil500(page) {
 
  let totalvideos = 0
  let previousHeight = 0 
  const maxVideos = 500

  while (totalvideos < maxVideos){
    totalvideos = await page.$$eval( 'ytd-video-renderer',
      videos => videos.length
    );
    console.log("videos cargados: " + totalvideos);

    await page.evaluate(()=>{
        window.scrollBy(0,window.innerHeight);
    })

    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const newHeight = await page.evaluate(() => document.body.scrollHeight);
    if (newHeight === previousHeight) {
      console.log("No hay más videos que cargar.");
      break;
    }
    previousHeight = newHeight
    await page.screenshot({ path: 'debug.png', fullPage: true });

  }
};



async function main(url) {

    const browser = await puppeteer.launch({  headless: true}) // 👈 Abre navegador visible
    // defaultViewport: null, 
    //args: ['--start-maximized'] })
    const page = await browser.newPage();

    await page.goto(url, {waitUntil: "networkidle2",})
   const selector = page.$eval('ytd-video-renderer > a#video-title')[1].textContent()
   console.log(selector);

    
}
main("https://www.youtube.com/@COLORSxSTUDIOS/videos")