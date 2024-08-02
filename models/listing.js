const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { listingSchema } = require("./server.js");

const listningSchema= new Schema({
    title:String,
    description:String,
    image:String,
    price:Number,
    location:String,
    country:String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})

listningSchema.post("findOneAndDelete",async (listing)=>{
    console.log(listing)
    if(listing){
     await Review.deleteMany({_id :{$in : listing.review}})
    }
})

const Listing=mongoose.model("Listing",listningSchema)
module.exports=Listing;