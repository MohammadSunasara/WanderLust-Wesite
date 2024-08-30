
    require("dotenv").config()
    const axios = require('axios');

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Joi = require('joi');
const bodyParser = require('body-parser');
const expressError = require("./utility/ExpressError");
const listingrouter=require("./routes/listings.js");
const reviewrouter=require("./routes/review.js");
const userrouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require("connect-mongo")
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");




// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require("ejs-mate");
const { error } = require("console");
app.engine("ejs", ejsMate);
app.use(express.json()); 

const db=process.env.ATLASDB
main().then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

async function main() {
    await mongoose.connect(db);
}

const store=MongoStore.create({
    mongoUrl:db,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})
store.on("error", function (error) {
    console.log(error);
});



const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}


// MongoDB Connection


app.use(session(sessionOptions))
app.use(flash())



app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.message=req.flash("sucess")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user
    next()
})

app.get("/demo",async(req,res)=>{
    let user=new User({
        email:"mohammadali@gmail.com",
        username:"mohammad ali"
    })
    let result= await User.register(user,"mohammad111ali")
    res.send(result)
})




app.use("/listings",listingrouter)
app.use("/listings/:id/reviews",reviewrouter)
app.use("/",userrouter)


app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found!!"));
});

app.use((req, res, next) => {
    console.log('Handling request:', req.method, req.url);
    next();
});
// Error Handling Middleware - should be at the end
app.use((err, req, res, next) => {
    let {status=500,message}=err// log the error stack for debugging
    console.log(err)
    res.status(500).render("error.ejs",{message}); // send a generic error response
});



// Server listening
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
