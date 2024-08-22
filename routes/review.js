const express=require("express")
const router=express.Router({mergeParams:true});
const expressError = require("../utility/ExpressError");
const wrapAsync = require("../utility/wrapAsync");
const {reviewSchema}=require("../models/server.js");
const {validateUser , isOwner}=require("../loginmiddleware.js")
const reviewController=require("../controller/review.js")



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

router.post("/",validateUser,validateReview,wrapAsync(reviewController.addReview ));

//delete route 

router.delete("/:reviewId",validateUser,wrapAsync(reviewController.deleteReview))


module.exports=router;
