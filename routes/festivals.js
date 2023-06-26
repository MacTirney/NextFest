const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Festival = require('../models/festival');
const { isLoggedIn, isAuthor, validateFestival } = require('../middleware')
const festivals = require('../controllers/festivals')

router.route('/')
    .get(catchAsync(festivals.index))
    .post(isLoggedIn, validateFestival, catchAsync(festivals.createFestival))

router.get('/new', isLoggedIn, festivals.renderNewForm)

router.route('/:id')
    .get(catchAsync(festivals.showFestival))
    .put(isLoggedIn, isAuthor, validateFestival, catchAsync(festivals.updateFestival))
    .delete(isLoggedIn, isAuthor, catchAsync(festivals.deleteFestival))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(festivals.renderEditForm))

module.exports = router;