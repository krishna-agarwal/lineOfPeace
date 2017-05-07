angular.module("lineOfPeace",['ui.router','ui.bootstrap','ngMaterial','textAngular','appFactory'])

.config(function($stateProvider, $urlRouterProvider,$mdThemingProvider){
  
  $urlRouterProvider.otherwise('/login');

  $stateProvider.state('login',{
    url: '/login',
    templateUrl: 'templates/login.html'
  })

  $stateProvider.state('home',{
    url: '/home',
    templateUrl: 'templates/home.html'
  })

  $mdThemingProvider.definePalette('zeniusprimary', {
    '50': 'e3e8ec',
    '100': 'b9c5d1',
    '200': '8b9eb2',
    '300': '5c7793',
    '400': '395a7b',
    '500': '163d64',
    '600': '13375c',
    '700': '102f52',
    '800': '0c2748',
    '900': '061a36',
    'A100': '6fa0ff',
    'A200': '3c7eff',
    'A400': '095cff',
    'A700': '0051ee',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50','100','200','A100'],
    'contrastLightColors': ['300','400','500','600','700','800','900','A200','A400','A700']
  });

  $mdThemingProvider.definePalette('zeniusaccent', {
    '50': 'fce6ea',
    '100': 'f8c0ca',
    '200': 'f497a7',
    '300': 'ef6d83',
    '400': 'eb4d69',
    '500': 'e82e4e',
    '600': 'e52947',
    '700': 'e2233d',
    '800': 'de1d35',
    '900': 'd81225',
    'A100': 'ffffff',
    'A200': 'ffd4d7',
    'A400': 'ffa1a8',
    'A700': 'ff8790',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50','100','200','300','A100','A200','A400','A700'],
    'contrastLightColors': ['400','500','600','700','800','900']
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('zeniusprimary')
    .accentPalette('zeniusaccent')

})

.directive("repeatEnd", function(){
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            if (scope.$last) {
                scope.$eval(attrs.repeatEnd);
            }
        }
    };
})

.controller('mainController',function($rootScope,$scope,$state,$mdDialog,$mdToast,dataFactory){
  $scope.currState = $state;
  $scope.$watch('currState.current.name', function(newValue, oldValue) {
      console.log(newValue);
      if(newValue == "home" && !$rootScope.validUser)
        $state.go('login')
  });



  $scope.user = {
    "name" : "",
    "password" :""
  }

  $scope.title = "Line Of Peace";
  $scope.activeTab = 0;
  $scope.interests = [];
  $scope.articles = [];
  $scope.tags = [];

  $scope.getInterests = function(){
    dataFactory.getTags()
    .then(function(res){
      $scope.tags = res.data.data;
    },function(err){

    })
  }
  $scope.getTags = function(){
    dataFactory.getInterests()
    .then(function(res){
      $scope.interests = res.data.data;
    },function(err){

    })
  }

  $scope.init = function(){
    $scope.getInterests()
    $scope.getTags()
  }

  $scope.init();

  $scope.addInterestPrompt = function(ev){
    $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: ev,
        controller: DialogController,
        templateUrl: 'templates/addInterestDialog.html',
        clickOutsideToClose:true
    })
    .then(function(newInterest) {
      if(newInterest)
        $scope.interests.push(newInterest);
    }, function() {
      //$scope.status = 'You cancelled the dialog.';
    });
  }

  function DialogController($scope, $mdDialog) {

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.addInterest = function() {
        postData = {
          name : $scope.interest,
          primaryColor : $scope.primaryColor,
          secondaryColor : $scope.secondaryColor
        };
        dataFactory.addInterest(postData)
        .then(function(res){
          $mdDialog.hide({name : $scope.interest});
        },function(err){

        })
    };
  }

  $scope.onEnd = function(){
    $scope.activeTab = $scope.interests.length;
  }

  $scope.interestChange = function(interest){
    $scope.selectedArticleIndex = null;
    $scope.currentArticle = null;
    $scope.articles = [];
    $scope.getArticles(interest);
    $scope.currentInterest = interest;
  }

  $scope.getArticles = function(interest){
    $scope.loadingArticles = true;
    dataFactory.getArticles(interest)
    .then(function(res){
        $scope.loadingArticles = false;
        $scope.articles = res.data.data
    },function(err){
      $scope.loadingArticles = false;
    })
  }

  $scope.addArticlePrompt = function(ev){
    var confirm = $mdDialog.prompt()
      .title('New Article for '+$scope.currentInterest)
      .placeholder('Article')
      .ariaLabel('Article')
      .targetEvent(ev)
      .ok('Add')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function(article) {
      $scope.addArticle(article);
    }, function() {
    });
  }

  $scope.addArticle = function(article){
    var postData = {article : {"title" : article}};
    dataFactory.addArticle($scope.currentInterest,postData)
    .then(function(res){
      $scope.articles.push({"title" : article});
    },function(err){
      //Show Toast
    })
  }

  $scope.updateArticle = function(){
    var postData = {article : $scope.article};
    dataFactory.updateArticle($scope.currentInterest,postData)
    .then(function(res){

      $mdToast.show(
        $mdToast.simple()
          .textContent('article updated')
          .hideDelay(3000)
      );
      //$scope.articles.push({"title" : article});
    },function(err){
      //Show Toast
    })
  }

  $scope.articleChange = function(article,index){
    if ($scope.selectedArticleIndex === null) {
      $scope.selectedArticleIndex = index;
    }
    else {
      $scope.selectedArticleIndex = index;
    }
    $scope.getArticle(article);
    $scope.currentArticle = article;
  }

  $scope.getArticle = function(article){
    dataFactory.getArticle($scope.currentInterest,article)
    .then(function(res){
      $scope.article = res.data.data;
    },function(err){
      console.log(err);
    })
  }

  $scope.addTagPrompt = function(ev){
    var confirm = $mdDialog.prompt()
      .title('New Tag')
      .placeholder('Tag')
      .ariaLabel('Tag')
      .targetEvent(ev)
      .ok('Add')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function(tag) {
      $scope.addTag(tag);
    }, function() {
    });
  }

  $scope.addTag = function(tag){
    var postData = {tag : {"name" : tag}};
    dataFactory.addTag(postData)
    .then(function(res){
      $scope.tags.push({"name" : tag});
    },function(err){
      //Show Toast
    })
  }

  $scope.enter = function(){
    if($scope.user.name == "user1" && $scope.user.password=="password1"){
      $rootScope.validUser = true;
      $state.go('home');
    }
  }


})
