import { load } from "cheerio";
import puppeteer, { Page } from "puppeteer";
import fs from "fs"

async function Main() {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("https://newyork.craigslist.org/search/tch#search=2~thumb~0");

     await page.waitForSelector("a.posting-title");
    const html = await page.content()

   

    const $ = load(html)
    const listing =  $("a.posting-title").map((index, Element) => {
             
             const url = $(Element).attr("href"); 
             return {url,index}
            
    }).get()

    console.log(listing);
    await browser.close()

}

Main()