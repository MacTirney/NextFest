const Festival = require('../models/festival');

module.exports.index = async (req, res) => {
    const festivals = await Festival.find({})
    res.render('festivals/index', { festivals })
}

module.exports.renderNewForm = (req, res) => {
    res.render('festivals/new')
}

module.exports.createFestival = async (req, res, next) => {
    const festival = new Festival(req.body.festival)
    festival.author = req.user._id;
    await festival.save()
    req.flash('success', 'Successfully made a new Festival')
    res.redirect(`/festivals/${festival._id}`)
}

module.exports.showFestival = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const festival = await Festival.findById(id)
    if (!festival) {
        req.flash('error', 'Cannot edit that festival')
        return res.redirect('/festivals')
    }
    res.render('festivals/edit', { festival })
}

module.exports.updateFestival = async (req, res) => {
    const { id } = req.params
    const festival = await Festival.findByIdAndUpdate(id, { ...req.body.festival })
    req.flash('success', 'Successfully updated a Festival')
    res.redirect(`/festivals/${festival._id}`)
}

module.exports.deleteFestival = async (req, res) => {
    const { id } = req.params
    await Festival.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a Festival')
    res.redirect('/festivals')
}