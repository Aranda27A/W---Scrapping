const parser =  require("./parser.js")
const fs = require("fs")
let html

beforeAll(()=> {
    html = fs.readFileSync("./test.html")
})
 //Make tests cuantas lsitings hay, el titulo del primero, url

it("should give 4" , () =>{
    const result = parser.add(2,2)
    expect(result).toBe(4)
});