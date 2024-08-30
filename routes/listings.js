const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

const { listingSchema } = require("../models/server.js");
const expressError = require("../utility/ExpressError");
const wrapAsync = require("../utility/wrapAsync");
const { validateUser, isOwner } = require("../loginmiddleware.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudinaryconfig.js");
const upload = multer({ storage });
const nodemailer = require('nodemailer');



// Middleware to validate listing data
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map((el) => el.message).join(",");
        console.log(error);
        return next(new expressError(400, errorMsg)); // Use next() to pass the error to error-handling middleware
    }
    next();
};


router.get("/logout", (req, res, next) => {
  console.log("Logout route hit"); 
  req.logout((err) => {
      if (err) {
          return next(err);
      }
      req.flash("sucess", "Logged Out Successfully");
      res.redirect("/listings");
  });
});



// Route to show all listings
router.get("/", wrapAsync(listingController.index));



// Route to show form for new listing
router.get("/new", validateUser, (req, res) => {
    res.render("listings/new.ejs");
});

// Route to handle search requests
router.get('/search',wrapAsync(listingController.search) );

// Route to add a new listing
router.post("/", validateUser, upload.single("listing[image]"), validateListing, wrapAsync(listingController.addListing));

// Route to show a specific listing
router.get("/:id", wrapAsync(listingController.readListing));

// Route to show edit form for a specific listing
router.get("/:id/edit", validateUser, isOwner, wrapAsync(listingController.updateEjs));

// Route to update a specific listing
router.put("/:id", validateUser, isOwner, upload.single("image"), wrapAsync(listingController.update));


// Route to delete a specific listing
router.delete("/:id", validateUser, isOwner, wrapAsync(listingController.deleteListing));



// Route to filter listings
router.get("/filter/:filter?",(listingController.filter));

router.get("/:id/reserve/booking", validateUser,(listingController.bookejs));




router.get("/:id/reserve/booking/detail", validateUser,(listingController.finalbookejs));



router.post("/:id/reserve/booking/detail",validateUser,(listingController.booked));





module.exports = router;
