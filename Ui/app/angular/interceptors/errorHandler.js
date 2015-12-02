tok.factory('errorInterceptor',['$user','$q',function($user,$q){
     return {
            'request': function(config,data) {

              if($user.isLoggedIn()){
                config.headers.kalToken = $user.gsToken();
                config.headers.kalUsername = $user.gsUsername();
              }


              if(/.*localhost:3000.*/.test(config.url)) {
                console.log("METHOD: " + config.method);
                console.log("URL: " + config.url);
                if(config.data) {
                  console.log("DATA:");
                  console.log(config.data);
                }

              }

            return config;
            },
            'response': function(response) {


            if(/.*localhost:3000.*/.test(response.config.url)){
              console.log("Response:");
              console.log(response.data);
              console.log(' ');
            }
             // console.log(response.data);


            return response;
            },


            'responseError': function(rejection) {


              console.log("ERROR:");
              console.log(rejection.data);

              if(console.log(rejection.data.error == "Invalid Credentials")) $user.setLoggedIn(false);
              return $q.reject(rejection);
            }
        };
}]);


tok.config(['$httpProvider',function($httpProvider) {
  $httpProvider.interceptors.push('errorInterceptor');
}]);
