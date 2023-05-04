const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Festival = require('./models/festival');
const ejsEngine = require('ejs-mate');

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

app.get('/',(req, res) => {
    res.render('home')
})

app.get('/festivals', async (req, res) => {
    const festivals = await Festival.find({})
    res.render('festivals/index', { festivals })
})

app.get('/festivals/new', (req, res) => {
    res.render('festivals/new')
})

app.post('/festivals', async (req, res) => {
    const festival = new Festival(req.body.festival)
    await festival.save()
    res.redirect(`/festivals/${festival._id}`)
})

app.get('/festivals/:id', async (req, res) => {
    const festival = await Festival.findById(req.params.id)
    res.render('festivals/show', { festival })
})

app.get('/festivals/:id/edit', async (req, res) => {
    const festival = await Festival.findById(req.params.id)
    res.render('festivals/edit', { festival })
})

app.put('/festivals/:id', async (req, res) => {
    const { id } = req.params
    const festival = await Festival.findByIdAndUpdate(id, { ...req.body.festival })
    res.redirect(`/festivals/${festival._id}`)
})

app.delete('/festivals/:id', async (req, res) => {
    const { id } = req.params
    await Festival.findByIdAndDelete(id)
    res.redirect('/festivals')
})

app.listen(port, () => {
    console.log(`Serving on ${port}`)
})

// app.get('/makefestival', async (req, res) => {
//     const festival = new Festival ({ title: 'Artic Festival', description: 'Cold Festival'})
//     await festival.save()
//     res.send(festival)
// })