const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { listingSchema } = require("../models/server.js");
const expressError = require("../utility/ExpressError");
const wrapAsync = require("../utility/wrapAsync");
const {validateUser}=require("../loginmiddleware.js")



// Middleware to validate listing data
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map((el) => el.message).join(",");
        console.log(errorMsg);
        return next(new expressError(400, errorMsg)); // Use next() to pass the error to error-handling middleware
    }
    next();
};

// Route to show all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/show.ejs", { allListing });
}));

// Route to show form for new listing
router.get("/new", validateUser, (req, res) => {
    res.render("listings/new.ejs");
});

// Route to add a new listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id
    await newListing.save();
    req.flash("sucess", "Listing added successfully."); // Keep the spelling as requested
    res.redirect("/listings");
}));

// Route to show a specific listing
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listings = await Listing.findById(id).populate("review").populate("owner");

    if (!listings) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings"); // Return to prevent further processing
    }
    res.render("listings/read.ejs", { listings });
}));

// Route to show edit form for a specific listing
router.get("/:id/edit", validateUser, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings"); // Return to prevent further processing
    }
    res.render("listings/edit.ejs", { listing });
}));

// Route to update a specific listing
router.put("/:id", validateUser, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, image, country, price, location } = req.body;
    await Listing.findByIdAndUpdate(id, { title, description, image, country, price, location });
    req.flash("sucess", "Listing updated successfully."); // Keep the spelling as requested
    res.redirect(`/listings/${id}`);
}));

// Route to delete a specific listing
router.delete("/:id", validateUser, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("sucess", "Listing deleted successfully."); // Keep the spelling as requested
    res.redirect("/listings");
}));

module.exports = router;
