///Note: Nuevo packjson debido a que en este mismo modifique el apartado de test para poner el __text__


const cheerio = require("cheerio")

exports.add = (Number1,  number2)  => Number1 + number2  

exports.listening = html => {

    const $ = cheerio.load(html)
}