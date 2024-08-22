const Listing=require("./models/listing.js");


module.exports.validateUser = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo=req.originalUrl
        req.flash("error", "To create a new listing, please log in.");
        return res.redirect("/login"); // Return to prevent further processing
    }
    next();
};


module.exports.saveUrl=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.savedUrl=req.session.returnTo ;
        delete req.session.returnTo; 
    }
    next()

}


module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    
    let listing=await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Your Are Not Owner Of This Listing")
        return res.redirect(`/listings/${id}`)
    }
    next()

}