const Festival = require('../models/festival');
const Review = require('../models/review')

module.exports.createReview = async (req,res) => {
    const festival = await Festival.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    festival.reviews.push(review)
    await review.save()
    await festival.save()
    req.flash('success', 'Successfully created a new Review')
    res.redirect(`/festivals/${festival._id}`)
}

module.exports.deleteReview = async (req,res) => {
    const { id, reviewId } = req.params
    await Festival.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a Review')
    res.redirect(`/festivals/${id}`)
}