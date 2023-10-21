const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    username: String,
    userid: String,
    date: String,
    time: String

});


module.exports = mongoose.model('Booking', BookingSchema);