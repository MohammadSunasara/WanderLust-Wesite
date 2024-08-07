const express=require("express")
const router=express.Router();
const User=require("../models/user.js")
const passport=require("passport")


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})


router.post("/signup",async(req,res)=>{
    try{
        let { email,username,password }=req.body;
        let newUser=new User({email,username})
        let result= await User.register(newUser,password)
        
        req.flash("sucess","Welcome To WanderLust")
        res.redirect("/listings")

    }catch(err){
        req.flash("error","User With Same Name Already Exists")
        res.redirect("/signup")
    }


})

router.get("/login",async(req,res)=>{
    res.render("users/login.ejs")

})

router.post("/login",passport.authenticate("local" ,{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("sucess","Wecome Back To WanterLust")
    res.redirect("/listings")
})











module.exports=router