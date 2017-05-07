var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require("mongoose");
var bodyParesr = require('body-parser');
var morgan = require('morgan');
var crypto = require('crypto');
var path    = require("path");

var config = require('./config');
var controller = require('./controller');

var db = mongoose.connection;
db.on('error',console.error);
db.once('on',function(){
	console.log("connected")
})

mongoose.connect(config.dbURL);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(bodyParesr.json({type : 'application/json'}));
app.use(allowCrossDomain);
app.use(morgan('dev'));
app.use('/api', router);

app.use(function(err,req,res,next){
	res.status(err.status || 500).send();
	res.render('error', {
        message: err.message,
        error: err
    });
})

app.use(express.static(__dirname+'/view/'));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/view/index.html'))
})

router.get('/interests',controller.getInterests);

router.post('/interest',controller.addInterest);

router.get('/tags',controller.getTags);

router.post('/tag',controller.addTag);

router.get('/:interest/articles',controller.getArticles);

router.get('/:interest/article/:title',controller.getArticle);

router.post('/:interest/article',controller.addArticle);

router.put('/:interest/article',controller.updateArticle)

app.listen(8080,function(){
	console.log("LineOfPeace is running on port 8080");
})
