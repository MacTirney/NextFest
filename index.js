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

const validateFestival = (req, res, next) => {
    const { error } = festivalSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/',(req, res) => {
    res.render('home')
})

app.get('/festivals', catchAsync(async (req, res) => {
    const festivals = await Festival.find({})
    res.render('festivals/index', { festivals })
}))

app.get('/festivals/new', (req, res) => {
    res.render('festivals/new')
})

app.post('/festivals', validateFestival, catchAsync(async (req, res, next) => {
    // if (!req.body.festival) throw new ExpressError('Invalid Festival Data', 400)
    const festival = new Festival(req.body.festival)
    await festival.save()
    res.redirect(`/festivals/${festival._id}`)
}))

app.get('/festivals/:id', catchAsync(async (req, res) => {
    const festival = await Festival.findById(req.params.id).populate('reviews')
    // console.log(festival)
    res.render('festivals/show', { festival })
}))

app.get('/festivals/:id/edit', catchAsync(async (req, res) => {
    const festival = await Festival.findById(req.params.id)
    res.render('festivals/edit', { festival })
}))

app.put('/festivals/:id', validateFestival, catchAsync(async (req, res) => {
    const { id } = req.params
    const festival = await Festival.findByIdAndUpdate(id, { ...req.body.festival })
    res.redirect(`/festivals/${festival._id}`)
}))

app.delete('/festivals/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Festival.findByIdAndDelete(id)
    res.redirect('/festivals')
}))

app.post('/festivals/:id/reviews', validateReview, catchAsync(async (req,res) => {
    const festival = await Festival.findById(req.params.id)
    const review = new Review(req.body.review)
    festival.reviews.push(review)
    await review.save()
    await festival.save()
    res.redirect(`/festivals/${festival._id}`)
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

// app.get('/makefestival', async (req, res) => {
//     const festival = new Festival ({ title: 'Artic Festival', description: 'Cold Festival'})
//     await festival.save()
//     res.send(festival)
// })