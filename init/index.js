const mongoose=require("mongoose")
const sampleListings = require("./data.js").data;
const Listing=require("../models/listing.js")



main().then(()=>{console.log("sucess")})
.catch((err)=>{console.log(err)})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

const  initDB= async()=>{
    await Listing.deleteMany({})
    
   
 
    await Listing.insertMany(sampleListings)
    console.log(sampleListings[0])

    console.log("data added")

}

initDB()
