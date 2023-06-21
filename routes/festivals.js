const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Festival = require('../models/festival');
const { isLoggedIn, isAuthor, validateFestival } = require('../middleware')
const festivals = require('../controllers/festivals')

router.get('/', catchAsync(festivals.index))

router.get('/new', isLoggedIn, festivals.renderNewForm)

router.post('/', isLoggedIn, validateFestival, catchAsync(festivals.createFestival))

router.get('/:id', catchAsync(festivals.showFestival))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(festivals.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateFestival, catchAsync(festivals.updateFestival))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(festivals.deleteFestival))

module.exports = router;