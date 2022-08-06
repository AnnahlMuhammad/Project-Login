const mongoose = require('mongoose');

// Membuat model database
const regis = mongoose.model('dataLogin', {
    username : {
        type:String,
        required : true,
    },
    email : {
        type:String,
        required : true,
    },
    password : {
        type:String,
        required : true,
    }
});

module.exports = regis;