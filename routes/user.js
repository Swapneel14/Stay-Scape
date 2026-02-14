const express= require("express");
const router= express.Router();
const User=require("../models/user.js");
const wrap = require("../utils/wrap.js");
const passport=require('passport');
const { saveRedirectUrl } = require("../middleware.js");

const usercontroller= require("../controllers/user.js");


//SignUp-GET
router.get("/signup",usercontroller.renderSignupForm);

//SignUp-POST
router.post("/signup",
   wrap(usercontroller.signup)

);

//Login-GET
router.get("/login",usercontroller.renderLoginForm);

//Login-Post
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate('local',{
    failureRedirect:"/login",
    failureFlash:true
}),
 wrap(usercontroller.login)
)

router.get("/logout",wrap(usercontroller.logout));

module.exports=router