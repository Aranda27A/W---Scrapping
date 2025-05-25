


/// Code based on web scrapping where we re getting objects with the information relevant.


import puppeteer from "puppeteer";

const  timeWait = (ms) => new Promise((r) => {  setTimeout(r, ms) })
    
async function ScrapingInfo (page) {


       
        
        //Important noticing that needs to wait until finds the selector
        await page.waitForSelector("a.posting-title");
         await page.waitForSelector(".meta");
        await page.waitForSelector(".meta span[title]");
       

       // Extraction of title and url of the job position and forming the base object
   const listings = await page.$$eval("a.posting-title", elements =>
            elements.map(el => ({
              title: el.innerText.trim(), 
              url: el.href

            
            }))
          );

          /// Function to get the date of posting, it was in a span called title, and we extract the attribute
   const metaDate = await page.$$eval(".meta span[title]", elements => elements.map(el =>  el.getAttribute("title")));

          /// Function to get the payment information, where we have keypatterns to help to get the accurate inforamtion
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
      
           '$20 an hour',
           'Entry Level',
           '$20 + based on experience',
           'Hourly Rate',
           'call for info',
           '$55 TO $65 PER HOUR',
           '17.00 per hour',
           'Will be discussed',
           'from $55,000 to $85,000/Year depend on ...',
           'Competitive',
           'Payroll',
           '$55 TO $65 PER HOUR',
           '$25/hour + Bonus + Sales Commission - N...',
           'To be discussed.',
           'To be discussed.',
           'To be discussed.',
           'To be discussed.',
           'Competitive Compensation',
           '70K to 90K based on experience',
           'Based on Skills and Experience',
           'depends on expirience level',
           'on call',
           'Negotiatable',
           'To be determined',
           '$22.00-$30.00/hr',
           'Open Discusssion / Open Negotiation',
           'competitive',
           'Based on Experience',
           '$400 Cash for day',
           'We will pay by the hour of service need...',
           'Inquire',
           'Negotiable Competitive compensation',
           'starting from $23',
           'DoE',
           'To be discussed.',
           'Full time Position, Salary, Benefits, 4...',
           '$50,00 and up (depending on experience)',
           'Negotiable',
           'Commensurate with Experience',
           '$600 - $1K+ Weekly',
           'TBD; based on experience',
           'TBD',
           'To be discussed.',
           'To be discussed.',
           'To be discussed.',
           'TBD',
           'Salary depends on experience',
           '$25-35 per hour',
           '$30.00 to 35.00 an hour. DOE',
           'To be discussed.',
           'Starting at $25/hour Negotiable with ex...',
           'Hourly and incentive',
           'Up to $1574 (Based on eligibility)',
           'Up to $1574 (Based on eligibility)',
           'Up to $1,125 (based on eligibility)',
           'Up to $1,237 (based on eligibility)',
           'Based on Skills and Experience'
    ]
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
             console.log(payroll);
               return payroll; // o `return payroll` si querés todos
              });

  // Listings is our base array were our objects for each job page are, we add dates and  
  listings.forEach((post, i) => {
    post.date = metaDate[i]
    post.Payroll = metaHours[i]

 
  });
  //Show The objects 


  
  return listings

 
 
           
};

async function scrapeContent(listings, page) {

 const PaginaCompleta = {}
  
     await  timeWait(3000)

    await page.goto(listings.url)
    
    await page.waitForSelector("#titletextonly");
  
   const  title = await page.$eval('#titletextonly', elements => elements.textContent.trim()) 
   const longText = await page.$eval('#postingbody', elements => elements.textContent.trim())
   
   
    PaginaCompleta.title = title
    PaginaCompleta.longText = longText
    
  console.log(PaginaCompleta);
 return PaginaCompleta
}

    

  async function Main() {
      const browser =  await puppeteer.launch({headless: false});
        const page = await browser.newPage();       
         await page.goto("https://newyork.craigslist.org/search/tch#search=2~thumb~0")

      
        const listings = await  ScrapingInfo(page)
        
        for (const element of listings) {
          try {
            element.content = await scrapeContent(element, page)

          }catch (error){
            console.log(error, "Couldnt reach");
          }
        }

        console.log(listings)

    
  } 
    

Main()