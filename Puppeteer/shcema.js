import mongoose from "mongoose";

const SchemaList = new mongoose.Schema({
    title: String,
    URL:String,
    date: Date,
    Payroll: String,
    content: Object

});
const listingsModel = mongoose.model("listings", SchemaList )
export default  listingsModel;