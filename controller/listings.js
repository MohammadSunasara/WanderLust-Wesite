const fetch = require('node-fetch');
const Listing=require("../models/listing.js")
const nodemailer=require("nodemailer")

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mohammadali13703@gmail.com', // Replace with your Gmail address
    pass: 'isgq tryk cwpu dpbp'   // Replace with your Gmail App Password
  }
});




module.exports.index = async (req, res) => {
         const allListing = await Listing.find({});
        res.render('listings/show.ejs', { allListing });       
};

module.exports.search=async (req, res) => {
    const { state } = req.query; // Get state from query parameter
    console.log(state)
      
      const listings = await Listing.find({ state: state }); // Case-insensitive search
      if (listings.length > 0) {
        return res.render('listings/search.ejs', { listings, state });
      } 
        req.flash('error', 'No Listings Related To Your search');
        return res.redirect('/listings');
      
     
  }


module.exports.addListing = async (req, res) => {
    const apiKey = "a948c80c316742fe9367524c3589ec51"

    // Default location value if location is not provided
    
        // Default location value if location is not provided
        const locationToGeocode = req.body.listing.location;

        // Construct the URL for OpenCage
        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationToGeocode)}&key=${apiKey}`;

        // Fetch data from the OpenCage API
        const response = await fetch(geocodeUrl);

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON data
        const data = await response.json();
        console.log('Geocoding API response:', data); // Log the response for debugging

        if (!data.results || data.results.length === 0) {
            throw new Error('No geocoding results found');
        }

        // Extract latitude and longitude from the geometry object
        const geometry = data.results[0].geometry;
        if (!geometry || geometry.lat === undefined || geometry.lng === undefined) {
            console.error('Invalid geometry data:', geometry); // Log invalid geometry data
            throw new Error('Invalid geometry data');
        }

        // Convert lat/lng to GeoJSON format: [longitude, latitude]
        const longitude = geometry.lng;
        const latitude = geometry.lat;

        const url = req.file.path;
        const filename = req.file.filename;
        
        console.log(req.body.listing)
        
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user.id;
        newListing.image = { url, filename };
       
        newListing.geometry = {
            type: 'Point', // This should be 'Point' for GeoJSON
            coordinates: [longitude, latitude] // Ensure this order is correct: [longitude, latitude]
        };

        const savedListing = await newListing.save();
        console.log(savedListing)
        req.flash("sucess", "Listing added successfully."); // Corrected spelling
        res.redirect("/listings");
    };

    

module.exports.readListing=async (req, res) => {
    const { id } = req.params;
    const listings = await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");

    if (!listings) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings"); // Return to prevent further processing
    }
    res.render("listings/read.ejs", { listings });
}

module.exports.updateEjs=async (req, res) => {
    const { id } = req.params;
    const Listings = await Listing.findById(id);
  
    if (!Listings) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings"); // Return to prevent further processing
    }

    let originalImageUrl=Listings.image.url;
    let originalImageName=originalImageUrl.replace("/upload","/upload/h_300,w_250")
  
    res.render("listings/edit.ejs", { Listings,originalImageName});
  }

module.exports.update=async (req, res) => {
    
       let {id}=req.params;
       let{title,location,description,country,price}=req.body;
       let listing=await Listing.findByIdAndUpdate(id,{title,location,description,country,price});
       if(typeof req.file !=="undefined"){
        console.log(req.file)
        let url=req.file.path
        let filename=req.file.filename
        listing.image={url,filename}
      await listing.save()
       }
       req.flash("sucess","Listing Updated Sucessfully")
       res.redirect(`/listings/${id}`)
  

    
}



module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;
   
    await Listing.findByIdAndDelete(id);
    req.flash("sucess", "Listing deleted successfully."); // Keep the spelling as requested
    res.redirect("/listings");
}

module.exports.filter= async (req, res, next) => {
    const { filter } = req.params;


        // Find listings matching the filter
        if (filter) {
            const filteredListings = await Listing.find({ filter: filter });

            if (filteredListings.length === 0) {
                req.flash("error", `No listings found for filter: ${filter}`);
                return res.redirect('/listings');  // Redirects to the main listings page
            } else {
                return res.render('listings/icon.ejs', { filteredListings, filter });
            }
        
    }
}

module.exports.bookejs= async (req, res) => {
    const { id } = req.params;
    const listings = await Listing.findById(id).populate('owner'); // Populate owner to ensure it's an object

    // Assuming req.user is set by validateUser middleware
    const currUser = req.user;
     if (currUser && listings.owner._id.toString() === currUser._id.toString()) {
        req.flash("error", "Owner cannot book their own listing");
        return res.redirect(`/listings/${id}`);
    }

    res.render("listings/book.ejs", { listings });
}

module.exports.finalbookejs=async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/finalbook.ejs", { listings });
}

module.exports.booked= async (req, res) => {
    const { email } = req.body; 
    const {id}=req.params;
    
    const mailOptions = {
      from: 'mohammadali13703@gmail.com', // Replace with your Gmail address
      to: email,  // Replace with the recipient's email address
      subject: 'WanderLust Booking Confirmed ',
      text: 'Thank You For Booking From WanderLust For More Info Related To Payment And Many More..... Call:+91 8591874043'
    };
    
  
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error: ' + error.toString());
        req.flash("error","Something Went Wrong Please Try After Sometime ")
        return  res.redirect(`/listings/${id}`)
      }
      console.log('Email sent: ' + info.response);
      req.flash("sucess","Booking Confirmed , Futher Info Related To Payment Is Send To Your Given Email")
      res.redirect(`/listings/${id}`)
    });  
  }