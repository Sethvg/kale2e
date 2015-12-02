tok.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/root', {
      templateUrl:'routes/root/_root.html',
      controller:'rootCtrl'

    })
    .when('/search',{
      templateUrl:'routes/search/_search.html',
      //controller:''
    }).when('/admin',{
      templateUrl:'routes/admin/_admin.html',
      controller:'adminCtrl'
    })
    .otherwise({
      //redirectTo:'/root'
    })




}]);
