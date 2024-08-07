const express=require("express")
const router=express.Router({mergeParams:true});
const expressError = require("../utility/ExpressError");
const wrapAsync = require("../utility/wrapAsync");
const {reviewSchema}=require("../models/server.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        console.log(error)
let errorMsg=error.details.map((el)=>el.message).join(",")

        throw new expressError(401,errorMsg)
    }else{
        next()
    }
 }



 

//review route
//post review route

router.post("/",validateReview,wrapAsync( async (req,res)=>{

    let listing=await Listing.findById(req.params.id)
    let {review}=req.body
    let {comment,rating}=review

    console.log(comment)
    let newReview=new Review({comment,rating})

    listing.review.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("sucess","Review added ")
    res.redirect(`/listings/${req.params.id}`)

}));

//delete route 

router.delete("/:reviewId",wrapAsync(async (req,res)=>{
let{id ,reviewId}=req.params;

await Listing.findByIdAndUpdate(id,{$pull :{review:reviewId}})
await Review.findByIdAndDelete(reviewId)
req.flash("sucess","Review Deleted")
res.redirect(`/listings/${id}`)


}))


module.exports=router;
