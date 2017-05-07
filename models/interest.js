var mongoose = require('mongoose');

var interestSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    primaryColor : String,
    secondaryColor : String
})

module.exports =  mongoose.model("interest",interestSchema);