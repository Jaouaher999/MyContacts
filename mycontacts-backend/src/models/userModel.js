const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);