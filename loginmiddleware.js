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