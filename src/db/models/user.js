const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    messenger_id: {
        type: String,
        required: true
    },
    webscrapping_count: {
        type: Number,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    profile_pic: {
        type: String
    },
    locale: {
        type: String
    },
    timezone: {
        type: Number
    },
    gender: {
        type: String
    },
    status: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);