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
        // Temporary random price
        const price = Math.floor(Math.random() * 20) + 10;
        const festival = new Festival({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/1314854',
            description: 'Temporary Description about what festival this is and what type of festival it is',
            price
        })
        await festival.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});