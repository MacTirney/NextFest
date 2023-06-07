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
    req.flash('success', 'Successfully made a new Festival')
    res.redirect(`/festivals/${festival._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const festival = await Festival.findById(req.params.id).populate('reviews')
    if (!festival) {
        req.flash('error', 'Cannot find that festival')
        return res.redirect('/festivals')
    }
    res.render('festivals/show', { festival })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const festival = await Festival.findById(req.params.id)
    if (!festival) {
        req.flash('error', 'Cannot edit that festival')
        return res.redirect('/festivals')
    }
    res.render('festivals/edit', { festival })
}))

router.put('/:id', validateFestival, catchAsync(async (req, res) => {
    const { id } = req.params
    const festival = await Festival.findByIdAndUpdate(id, { ...req.body.festival })
    req.flash('success', 'Successfully updated a Festival')
    res.redirect(`/festivals/${festival._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Festival.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a Festival')
    res.redirect('/festivals')
}))

module.exports = router;