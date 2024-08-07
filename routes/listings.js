const express = require("express");
const router=express.Router()
const Listing = require("../models/listing.js");
const { listingSchema }=require("../models/server.js");
const expressError = require("../utility/ExpressError");
const wrapAsync = require("../utility/wrapAsync");



 const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        console.log(error)

let errorMsg=error.details.map((el)=>el.message).join(",")
console.log(errorMsg)
        throw new expressError(401,errorMsg)
    }else{
        next()
    }
 }


// Routes
router.get("/", wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    
    
    res.render("listings/show.ejs", { allListing });
}));


router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//add route

router.post("/",validateListing, wrapAsync(async (req, res, next) => {
   const newListing =  new Listing(req.body.listing);
    await newListing.save();
    req.flash("sucess","Listing added sucessfully")
 res.redirect("/listings");
}));

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id).populate("review");
    
    if (!listings) {
        req.flash("error", "Listings Not Found");
        return res.redirect("/listings");
    }
    res.render("listings/read.ejs", { listings });
}));

//upadte route

router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let Listings = await Listing.findById(id);
    
    if (!Listings ) {
        req.flash("error", "Listings Not Found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { Listings });
}));

router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let {title,description,image,country,price,location}=req.body;
   await Listing.findByIdAndUpdate(id, {title,description,image,country,price,location});
   

   req.flash("sucess","Listing Updated sucessfully")

    res.redirect(`/listings/${id}`);
}));

//delete route

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("sucess","Listing Deleted")
    res.redirect("/listings");
}));












module.exports=router