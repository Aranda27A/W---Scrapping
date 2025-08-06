 
import {parse as csvParseSync} from "csv-parse/sync"
import { Parser } from "json2csv"     //On comments you can find some debugings

import fs from "fs"

 
 export function csvHistory (DataBase){  //Function for making the historial for temperatures adding information to a base docuement

  // debuging---->  fs.writeFileSync("C:/Users/alex_/Escritorio/Aranda Coding/scrapping/WheaterScrap/debug_data_Init.json", JSON.stringify(DataBase, null, 2));
    const Outdir = "C:/Users/alex_/Escritorio/Aranda Coding/scrapping/Proyects/WheaterScrap/csv/"
    const HisotryPath = Outdir + "Wheater History.csv"


  const todayUpdateRecord = DataBase.map(({nombre , ...resto}  )=> resto) //No extraer los dias

  // debuging----> fs.writeFileSync("C:/Users/alex_/Escritorio/Aranda Coding/scrapping/WheaterScrap/debug_export1.txt", "before parser");

   let record = [];
   if(fs.existsSync(HisotryPath)){
    const fileContent = fs.readFileSync(HisotryPath, "utf8")

           if (fileContent.length > 0) {
            try {
              record = csvParseSync(fileContent, {
                columns: true,  
                skip_empty_lines: true,
              });
            } catch (err) {
              console.error("Error to parse hisotry:", err);
            }
   
           };

   const FullData = [...record, ...todayUpdateRecord]
   const nonDuple = Array.from(new Map(FullData.map(i=>[i.fecha , i])).values());


 
  try{

    
    const parser = new Parser()
    const csvHistory = parser.parse(nonDuple)
    fs.writeFileSync(Outdir + "Wheater History.csv", csvHistory)
    console.log("Second Csv exported")
  } catch (error) {
  console.log(error, "Unkwon error");
  }

}};


