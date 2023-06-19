const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Festival = require('../models/festival');
const { isLoggedIn, isAuthor, validateFestival } = require('../middleware')

router.get('/', catchAsync(async (req, res) => {
    const festivals = await Festival.find({})
    res.render('festivals/index', { festivals })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('festivals/new')
})

router.post('/', isLoggedIn, validateFestival, catchAsync(async (req, res, next) => {
    // if (!req.body.festival) throw new ExpressError('Invalid Festival Data', 400)
    const festival = new Festival(req.body.festival)
    festival.author = req.user._id;
    await festival.save()
    req.flash('success', 'Successfully made a new Festival')
    res.redirect(`/festivals/${festival._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const festival = await Festival.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!festival) {
        req.flash('error', 'Cannot find that festival')
        return res.redirect('/festivals')
    }
    res.render('festivals/show', { festival })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const festival = await Festival.findById(id)
    if (!festival) {
        req.flash('error', 'Cannot edit that festival')
        return res.redirect('/festivals')
    }
    res.render('festivals/edit', { festival })
}))

router.put('/:id', isLoggedIn, isAuthor, validateFestival, catchAsync(async (req, res) => {
    const { id } = req.params
    const festival = await Festival.findByIdAndUpdate(id, { ...req.body.festival })
    req.flash('success', 'Successfully updated a Festival')
    res.redirect(`/festivals/${festival._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    await Festival.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a Festival')
    res.redirect('/festivals')
}))

module.exports = router;