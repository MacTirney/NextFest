const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const Festival = require('./models/festival')

mongoose.connect('mongodb://localhost:27017/My-Next-Fest');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.get('/',(req, res) => {
    res.render('home')
})

app.get('/makefestival', async (req, res) => {
    const festival = new Festival({title: 'My Local Festival', description: 'Local festival with local artists' });
    await festival.save();
    res.send(festival)
})

app.listen(port, () => {
    console.log(`Serving on ${port}`)
})