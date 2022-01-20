const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    widgets: {
        cinema: {
            isActive: Boolean,
            search: String
        },
        youtube: {
            isActive: Boolean,
            search: String
        },
        weather: {
            isActive: Boolean,
            search: String
        },
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;