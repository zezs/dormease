const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketsSchema = new Schema({
    title: String,
    description: String,
    date: {
        type: Date,
        // Set the default time to midnight (00:00:00)
        default: function () {
            return new Date().setHours(0, 0, 0, 0);
        }
    },
    username: String,
    userid: String,
    status: Number 

});

// module.exports = mongoose.model('Campground', CampgroundSchema);
module.exports = mongoose.model('Ticket', TicketsSchema);