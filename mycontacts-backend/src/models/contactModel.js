const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    phone:{
        type: String
    }
});

module.exports = mongoose.model('Contact', contactSchema);