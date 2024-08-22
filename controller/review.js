const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.addReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let {review}=req.body
    let {comment,rating}=review
    let newReview=new Review({comment,rating})
    newReview.author=req.user._id;
    listing.review.push(newReview)
    await newReview.save()
    await listing.save()
    console.log(newReview)
    req.flash("sucess","Review added ")
    res.redirect(`/listings/${req.params.id}`)

}

module.exports.deleteReview=async (req,res)=>{
    let{id ,reviewId}=req.params;
    let deleteReview=await Review.findById(reviewId)
    if(!deleteReview.author.equals(res.locals.currUser._id)){
    req.flash("error","Your Are Not Owner Of This Review")
     return res.redirect(`/listings/${id}`)
    }
    await Listing.findByIdAndUpdate(id,{$pull :{review:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("sucess","Review Deleted")
    res.redirect(`/listings/${id}`)
    
    
    }