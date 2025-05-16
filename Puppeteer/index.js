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
         await page.waitForSelector(".meta");
        await page.waitForSelector(".meta span[title]");
       

       // Extract titeles in a array
   const listings = await page.$$eval("a.posting-title", elements =>
            elements.map(el => ({
              title: el.innerText.trim(), 
              url: el.href

            
            }))
          );

   const meta = await page.$$eval(".meta span[title]", elements => elements.map(el =>  el.getAttribute("title")));


  

   const metaHours = await page.$$eval(".meta", elements => {

      function keypatters(text) {

    //Regular expressions to filter
                const salaryPatterns = [
                  /\$\s?\d[\d,]*(\.\d+)?/,                                 // $20, $70,000.00
                  /\d{2,3}k(\s?[-to–]\s?\d{2,3}k)?/,                       // 70k, 70K to 90K
                  /\$\s?\d[\d,.]*\s?(per|an)?\s?(hour|day|week|month|year)/, // $20 per hour, $50,000 a year
                  /\d+\s?(usd|eur|ils)/,                                  // 3000 USD
                  /\$\d+.*(bonus|commission)/i,                           // $25/hour + Bonus
                  /starting from\s?\$?\d+/i,                              // starting from $23
                  /up to\s?\$?\d+/,                                       // up to $1574
                ];
              
                // referal sentences to a salary
                const salaryPhrases = [
                  'To be discussed',
                  'to be determined',
                  'TBD',
                  'Salary depends on experience',
                  'To be discussed.',
                  'Hourly Rate',``
                  'Based on Skills and Experience',
                  '(based on eligibility)',
                  'on call',
                  'Entry Level',
                  'Commensurate with Experience',
                  'Negotiable',
                  'Negotiable Competitive compensation', 
                  'depends on experience',
                  'depends on expirience level',
                  'Hourly and incentive',
                  'Based on Skills and Experience',
                  'competitive',
                  'based on experience',
                  'based on skills',
                  'Open Discusssion / Open Negotiation',
                  'competitive compensation',
                  'commensurate with experience',
                  'open discussion',
                  'doe', 
                  'call for info',
                  'inquire',
                  'will be discussed',
                  'salary depends',
                ];

                const isExplicit = salaryPatterns.some(p => p.test(text));
                const isImplicit = salaryPhrases.some(p => text.includes(p));

                  return (isExplicit || isImplicit );
                 }

     
     const payroll = [];
     elements.forEach(el => {
       el.childNodes.forEach(node => {
         if (node.nodeType === Node.TEXT_NODE) {
           const text = node.textContent.trim();
           if (keypatters(text)){ payroll.push(text);} 
         }
       });
     });

  return payroll; // o `return payroll` si querés todos
});

  // add dates to listings
  listings.forEach((post, i) => {
    post.date = meta[i]
    post.Payroll = metaHours[i]
  });
  //Show The objects 
  
  console.log(listings);

  await browser.close()
 
           
      };
    

    
   
    


Main()