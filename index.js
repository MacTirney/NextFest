const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const ejsEngine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');

const festivals = require('./routes/festivals')
const reviews = require('./routes/reviews')

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

app.use('/festivals', festivals)
app.use('/festivals/:id/reviews', reviews)

app.get('/',(req, res) => {
    res.render('home')
})

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