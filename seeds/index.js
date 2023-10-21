const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log("Connection open!!!");
}

const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
// console.log(seedHelpers.descriptors)

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<3; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const random20 = Math.floor(Math.random()*20);
        const price = Math.floor(Math.random()*20)+10;
        // console.log(cities[random1000].city)
        // console.log(descriptors[15])
        const camp = new Campground({
            author: '6526b3851e3998e184c6c1ae',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${descriptors[random20]} ${places[random20]}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis voluptates voluptatum eveniet, facilis laudantium necessitatibus dignissimos a, pariatur dicta modi aut explicabo perferendis. Voluptas impedit voluptatibus labore iure ea vitae?',
            price: price
        })
        console.log(camp);
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
    console.log('Server closed')
})