const express=require("express")
const router=express.Router();
const passport=require("passport")
const wrapAsync = require("../utility/wrapAsync");
const { saveUrl }=require("../loginmiddleware.js")
const userController=require("../controller/user.js")


router.get("/signup",(userController.signUpEjs))



router.post("/signup",wrapAsync(userController.signUpUser))

router.get("/login",(userController.loginEjs))

router.post("/login",saveUrl,
passport.authenticate("local" ,{failureRedirect:"/login",failureFlash:true})
,(userController.loginUser))




module.exports=router