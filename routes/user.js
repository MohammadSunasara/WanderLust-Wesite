const express=require("express")
const router=express.Router();
const User=require("../models/user.js")
const passport=require("passport")
const expressError = require("../utility/ExpressError");
const wrapAsync = require("../utility/wrapAsync");
const { saveUrl }=require("../loginmiddleware.js")


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})



router.post("/signup",wrapAsync(async(req,res)=>{
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
}))

router.get("/login",async(req,res)=>{
    res.render("users/login.ejs")

})

router.post("/login",saveUrl,
passport.authenticate("local" ,{failureRedirect:"/login",failureFlash:true})
,async(req,res)=>{
    req.flash("sucess","Welcome Back To WanterLust")
    if(res.locals.savedUrl){
       return res.redirect(res.locals.savedUrl)}
    res.redirect("/listings")

})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("sucess","Log Out")
        res.redirect("/listings")
    })
})


module.exports=router