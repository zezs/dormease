const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    
    title: String,
    image: String,
    description: String,
    details: String,
    date: {
        type: Date,
        // Set the default time to midnight (00:00:00)
        default: function () {
            return new Date().setHours(0, 0, 0, 0);
        }
    }
});

// module.exports = mongoose.model('Campground', CampgroundSchema);
module.exports = mongoose.model('Notification', NotificationSchema);