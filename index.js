const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Festival = require('./models/festival');
const Review = require('./models/review')
const ejsEngine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const { festivalSchema, reviewSchema } = require('./schemas.js')

const festivals = require('./routes/festivals')

mongoose.connect('mongodb://localhost:27017/My-Next-Fest');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

app.engine('ejs', ejsEngine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.use('/festivals', festivals)

app.get('/',(req, res) => {
    res.render('home')
})

app.post('/festivals/:id/reviews', validateReview, catchAsync(async (req,res) => {
    const festival = await Festival.findById(req.params.id)
    const review = new Review(req.body.review)
    festival.reviews.push(review)
    await review.save()
    await festival.save()
    res.redirect(`/festivals/${festival._id}`)
}))

app.delete('/festivals/:id/reviews/:reviewId', catchAsync( async (req,res) => {
    const { id, reviewId } = req.params
    await Festival.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/festivals/${id}`)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
    console.log(`Serving on ${port}`)
})