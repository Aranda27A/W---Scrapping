


export async function WtrChek(page) {  // Extract Data from 14 days


  const dias = await page.$$eval("ul.dias_w > li.grid-item.dia", (elementos) => {
    return elementos.map((el) => {

        try{ 

             const nombre = el.querySelector(".text-0")?.innerText.trim();
             const fecha = el.querySelector(".subtitle-m")?.innerText.trim();
             const tempMax = el.querySelector(".temp .max")?.innerText.trim();
             const tempMin = el.querySelector(".temp .min")?.innerText.trim();
             const descripcion = el.querySelector(".prediccion img.simbW")?.alt?.trim();

             const vientoMin = el.querySelector(".velocidad .changeUnitW")?.innerText.trim();
             const vientoMax = el.querySelectorAll(".velocidad .changeUnitW")[1]?.innerText.trim();

             return {
               nombre,
               fecha,
               tempMax,
               tempMin,
               descripcion,
               vientoMin,
               vientoMax,
             };

        }catch(error){
            console.log("DOM has been modified", err);
        }
            
        
    });
  });

 return dias

}

