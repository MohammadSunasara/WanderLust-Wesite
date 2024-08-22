
const User=require("../models/user.js")


module.exports.signUpEjs=(req,res)=>{
    res.render("users/signup.ejs")
}


module.exports.signUpUser=async(req,res)=>{
    try{
        let { email,username,password }=req.body;
        let newUser=new User({email,username})
        let result= await User.register(newUser,password)
        req.login(result,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("sucess","Welcome To WanderLust")
            res.redirect("/listings")
        } )
     }catch(err){
        req.flash("error","User With Same Name Already Exists")
        res.redirect("/signup")
    }
}

module.exports.loginEjs=async(req,res)=>{
    res.render("users/login.ejs")

}

module.exports.loginUser=async(req,res)=>{
    req.flash("sucess","Welcome Back To WanterLust")
    if(res.locals.savedUrl){
       return res.redirect(res.locals.savedUrl)}
    res.redirect("/listings")

}

