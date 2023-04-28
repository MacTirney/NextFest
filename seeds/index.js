const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seed-helpers');
const Festival = require('../models/festival')

mongoose.connect('mongodb://localhost:27017/My-Next-Fest');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Festival.deleteMany({});
    // const f = new Festival({title: 'Artic Ocean'});
    // await f.save()
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const festival = new Festival({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await festival.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});