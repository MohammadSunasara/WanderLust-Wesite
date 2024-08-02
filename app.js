const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const Joi = require('joi');
const { listingSchema,reviewSchema}=require("./models/server.js");
const Review = require("./models/review.js");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.json()); // To parse JSON bodies



// Error handler utility
const expressError = require("./utility/ExpressError");
const wrapAsync = require("./utility/wrapAsync");

// MongoDB Connection
main().then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

 const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
let errorMsg=error.details.map((el)=>el.message).join(",")
console.log(errorMsg)
        throw new expressError(401,errorMsg)
    }else{
        next()
    }
 }
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

// Routes
app.get("/listings", wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listings/show.ejs", { allListing });
}));

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//add route

app.post("/listings",validateListing, wrapAsync(async (req, res, next) => {
   
    
    const newListing =  new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id).populate("review");
    res.render("listings/read.ejs", { listings });
}));

//upadte route

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let Listings = await Listing.findById(id);
    res.render("listings/edit.ejs", { Listings });
}));

app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let {title,description,image,country,price,location}=req.body;
   await Listing.findByIdAndUpdate(id, {title,description,image,country,price,location});
    res.redirect(`/listings/${id}`);
}));

//delete route

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


//review route
//post review route

app.post("/listings/:id/reviews",validateReview,wrapAsync( async (req,res)=>{

       let listing=await Listing.findById(req.params.id)
       let {review}=req.body
       let {comment,rating}=review

       console.log(comment)
       let newReview=new Review({comment,rating})

       listing.review.push(newReview)
       await newReview.save()
       await listing.save()
       res.redirect(`/listings/${req.params.id}`)

}));

//delete route 
 
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
   let{id ,reviewId}=req.params;
   
   await Listing.findByIdAndUpdate(id,{$pull :{review:reviewId}})
   await Review.findByIdAndDelete(reviewId)
   res.redirect(`/listings/${id}`)


}))


app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found!!"));
});

// Error Handling Middleware - should be at the end
app.use((err, req, res, next) => {
    let {status=500,message}=err// log the error stack for debugging
    res.status(500).render("error.ejs",{message}); // send a generic error response
});



// Server listening
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
