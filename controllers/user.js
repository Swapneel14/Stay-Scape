const Listing= require("../models/listing.js");
const Review = require("../models/review.js");
const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
    const newUser= new User({email,username});
    const rUser= await User.register(newUser,password);
    console.log(rUser);
    req.login(rUser,(err)=>{
        if(err){
            return next(err);
        }
       req.flash("success",`Welcome to Stay-Scape,Mr ${username}!`);
       res.redirect("/listing");
    })
   
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res,next)=>{
    let {username}=req.body;
    req.flash('success',`Welcome Back to Stay-Scape,Mr ${username}`);
    let url=res.locals.redirectURL||"/listing";
    res.redirect(url);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash('success',"Logged out Successfully!!");
        res.redirect("/listing");
    })
}