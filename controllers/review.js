const Listing= require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview= async (req, res, next) => {
            let { id } = req.params;
            let list = await Listing.findById(id);
            let new_review = new Review(req.body.review);

            new_review.author=req.user._id;
            console.log(new_review)

            list.reviews.push(new_review);
            await new_review.save();
            await list.save();
            req.flash("success","Review Added");
            res.redirect(`/listing/${id}`);
        }

module.exports.deleteReview=async (req, res, next) => {
        let { id, reviewid } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
        await Review.findByIdAndDelete(reviewid);

        req.flash("success","Review Deleted");

        res.redirect(`/listing/${id}`);
    }