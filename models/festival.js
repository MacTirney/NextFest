const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FestivalSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Festival', FestivalSchema);