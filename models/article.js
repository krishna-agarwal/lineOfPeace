var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    body : String,
    image : String,
    image_title : String,
    interest : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Interest',
        required : true
    },
    tags : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tag'
    }],
    views : Number,
    slug : String,
    status : Boolean,
    created_at : Date,
    updated_at : Date
})

articleSchema.index({title : 1,interest : 1},{unique : true});

articleSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

module.exports =  mongoose.model("article",articleSchema);