const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Festival = require('../models/festival');
const Review = require('../models/review')
const { reviewSchema } = require('../schemas.js')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req,res) => {
    const festival = await Festival.findById(req.params.id)
    const review = new Review(req.body.review)
    festival.reviews.push(review)
    await review.save()
    await festival.save()
    req.flash('success', 'Successfully created a new Review')
    res.redirect(`/festivals/${festival._id}`)
}))

router.delete('/:reviewId', catchAsync( async (req,res) => {
    const { id, reviewId } = req.params
    await Festival.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a Review')
    res.redirect(`/festivals/${id}`)
}))

module.exports = router