const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Festival = require('../models/festival');
const { festivalSchema} = require('../schemas.js')

const validateFestival = (req, res, next) => {
    const { error } = festivalSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const festivals = await Festival.find({})
    res.render('festivals/index', { festivals })
}))

router.get('/new', (req, res) => {
    res.render('festivals/new')
})

router.post('/', validateFestival, catchAsync(async (req, res, next) => {
    // if (!req.body.festival) throw new ExpressError('Invalid Festival Data', 400)
    const festival = new Festival(req.body.festival)
    await festival.save()
    res.redirect(`/festivals/${festival._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const festival = await Festival.findById(req.params.id).populate('reviews')
    // console.log(festival)
    res.render('festivals/show', { festival })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const festival = await Festival.findById(req.params.id)
    res.render('festivals/edit', { festival })
}))

router.put('/:id', validateFestival, catchAsync(async (req, res) => {
    const { id } = req.params
    const festival = await Festival.findByIdAndUpdate(id, { ...req.body.festival })
    res.redirect(`/festivals/${festival._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Festival.findByIdAndDelete(id)
    res.redirect('/festivals')
}))

module.exports = router;