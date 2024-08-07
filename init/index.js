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
    const sampleListingsss=sampleListings.map((obj)=>({...obj,owner:"66b3572d43ebb4119c4aede8"}))
   
 
    await Listing.insertMany(sampleListingsss)
    console.log(sampleListingsss[0])

    console.log("data added")

}

initDB()
