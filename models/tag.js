var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    status : Boolean,
    count : Number
})

module.exports =  mongoose.model("tag",tagSchema);