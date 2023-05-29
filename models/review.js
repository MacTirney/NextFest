const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const model = mongoose.model;

const reviewSchema = new Schema({
    body: String,
    rating: Number
})

module.exports = model('Review', reviewSchema)