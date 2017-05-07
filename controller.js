var interestModel = require('./models/interest');
var articleModel = require('./models/article');
var tagModel = require('./models/tag');

module.exports = {
    getInterests : function(req,res,next){
        interestModel.find({},{name : 1,_id : 0},function(err,interests){
			if(err){ return next(err);}
			res.send({status : "success",data : interests})
		})
	},
	addInterest : function(req,res,next){
		var interestName = req.body.name;
		var interest = new interestModel({
			name : interestName,
            primaryColor : req.body.primaryColor,
            secondaryColor : req.body.secondaryColor
		})
        interest.save(function(err){
			if(err){return next(err)}
			res.send(interestName+" saved successfully")
		})
	},
	getTags : function(req,res,next){
		tagModel.find({},{name : 1},function(err,tags){
			if(err){ return next(err);}
			res.send({status : "success",data : tags})
		})
	},
	addTag : function(req,res,next){
		var tagObj = req.body.tag;
		var tag = new tagModel(tagObj)
		tag.save(function(err,tag){
			if(err){return next(err)}
			res.send("tag saved succesfully")
		})
	},
	getArticle : function(req,res,next){
		var interest = req.params.interest;
		var title = req.params.title;
		interestModel.findOne({name : interest},function(err,interest){
			if(err){return next(err)}
			if(interest){
				articleModel.findOne({interest : interest.id,title : title},function(error,article){
					if(error){return next(res);}
					res.send({status : "success",data : article})
				})
			}else{
				res.status(500).send({msg : "Parent interest "+interest+" not found"})
			}
		})
	},
	getArticles : function(req,res,next){
		var interest = req.params.interest;
		interestModel.findOne({name : interest},function(err,interest){
			if(err){return next(err)}
			if(interest){
				articleModel.find({interest : interest.id},{title : 1,_id :0},function(error,articles){
					if(error){return next(res);}
					res.send({status : "success",data : articles})
				})
			}else{
				res.status(500).send({msg : "Parent interest "+req.params.interest+" not found"})
			}
		})
	},
	addArticle : function (req,res,next) {
		var interest = req.params.interest;
		var articleObj = req.body.article;
		interestModel.findOne({name : interest},function(err,interest){
			if(err){return next(err)}
			if(interest){
				articleObj.interest = interest._id;
				var article = new articleModel(articleObj);
				article.save(function(error,article){
					if(error){return next(err)}
					res.send("article saved successfully")
				})
			}else{
				res.status(500).send({msg : "Interest "+req.params.interest+" not found"})
			}
		})
	},
	updateArticle : function(req,res,next){
		var interest = req.params.interest;
		var articleObj = req.body.article;
		articleModel.findOne({_id : articleObj._id},function(err,article){
			if(err){return next(err)}
			if(article){
				article.title = articleObj.title;
				article.body = articleObj.body ? articleObj.body : "";
				article.image = articleObj.image ? articleObj.image : "";
				article.image_title = articleObj.image_title ? articleObj.image_title : "";
				article.tags = articleObj.tags ? articleObj.tags : [];
				article.status = articleObj.status ? articleObj.status : true;
				article.slug = articleObj.title.toLowerCase().replace(/ /g,"-");
			}
			article.save(function(error,article){
				if(error){return next(err)}
				res.send("article updated successfully")
			})
		})
	}
}