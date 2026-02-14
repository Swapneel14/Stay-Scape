const express= require("express");
const router= express.Router({mergeParams:true});
const wrap= require("../utils/wrap.js");
const err = require("../utils/err.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review = require("../models/review.js");
const Listing= require("../models/listing.js");
const { isLoggedin, isreviewAuthor } = require("../middleware.js");
const  reviewcontroller= require("../controllers/review.js")



//Middleware for Review Validation
const validatereview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);

    if (result.error) {
        throw new err(400, result.error);
    }
    else {
        next();
    }
}


//Reviews
//Post Review Route
router.post("/",
    isLoggedin,
    validatereview,
    wrap(reviewcontroller.createReview)
);


//Delete Review Route

router.delete("/:reviewid",
    isLoggedin,
    isreviewAuthor,
     wrap(reviewcontroller.deleteReview))

module.exports=router;