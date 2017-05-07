angular.module("appFactory",[])
.factory("dataFactory",function($http){
	var baseUrl = "api/";
	return {
		getInterests : function(){
			return $http.get(baseUrl+"interests");
		},
		addInterest : function(data){
			return $http.post(baseUrl+"interest",data);
		},
		getTags : function(){
			return $http.get(baseUrl+"tags")
		},
		addTag : function(data){
			return $http.post(baseUrl+"tag",data);
		},
		getArticles : function(interest){
			return $http.get(baseUrl+interest+"/articles");
		},
		getArticle : function(interest,article){
			return $http.get(baseUrl+interest+"/article/"+article);
		},
		addArticle : function(interest,data){
			return $http.post(baseUrl+interest+"/article",data)
		},
		updateArticle : function(interest,data){
			return $http.put(baseUrl+interest+"/article",data)
		}
	}
})