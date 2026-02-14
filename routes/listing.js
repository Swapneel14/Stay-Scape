const express = require("express");
const router = express.Router();
const wrap = require("../utils/wrap.js");
const err = require("../utils/err.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedin, isOwner } = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//Middleware for listing Validation
const validatelisting = (req, res, next) => {
  let result = listingSchema.validate(req.body);

  if (result.error) {
    throw new err(400, result.error);
  }
  else {
    next();
  }
}

router
  .route("/")
  .get(listingcontroller.index)//Index Route
  .post(//Create Route
    isLoggedin,
    upload.single('newlist[image][url]'),
    validatelisting,
   
    wrap(listingcontroller.createlisting)
  );
 
//New Route
router.get("/new", isLoggedin, listingcontroller.rendernewform);

router.get("/category/:cat",listingcontroller.filter);

router
  .route("/:id")
  .get(wrap(listingcontroller.showlising))//Show Route
  .put(//Update Route
    isLoggedin,
    isOwner,
    upload.single('newlist[image][url]'),
    validatelisting,
    wrap(listingcontroller.editlisting))
  .delete(//Delete Route
  isLoggedin,
  isOwner,
  wrap(listingcontroller.deleteListing)
  )

//Edit Route
router.get("/:id/edit",
  isLoggedin,
  isOwner,
  wrap(listingcontroller.rendereditform));







module.exports = router;