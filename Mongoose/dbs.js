const mongoose = require('mongoose');
// konfigurasi mongoose
mongoose.connect('mongodb://127.0.0.1:27017/annahlDB', (err)=>{
    if(err){
        throw err;
    }
    console.log("Connected at database");
});