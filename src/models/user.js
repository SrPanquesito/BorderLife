const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'I am a new user'
    }
});

module.exports = mongoose.model('User', userSchema);