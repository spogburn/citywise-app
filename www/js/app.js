// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('saySomething', ['ionic', 'ngCordova', 'ngCordovaOauth'])

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
  $ionicConfigProvider
  .tabs.position('bottom')

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginController as LC'
  })
  .state('tabs', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tabs.say-something', {
    url: '/say-something',
    views: {
      'say-something': {
        templateUrl: 'templates/say-something.html',
        controller: 'SaySomethingController as SS'
      }
    }
  })
  .state('tabs.home', {
    url: '/home',
    views: {
      'home': {
        templateUrl: 'templates/home.html',
        controller: 'HomeController as HC'
      }
    }
  })
  $urlRouterProvider.otherwise('/login')
})


app.factory('authInterceptor', ['$q', '$window', function ($q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.localStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
}]);

app.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}]);

  //     vm.googleLogin = function(){
  //
  //     $cordovaOauth.google(CLIENT_ID, ["email","profile"]).then(function(result) {
  //         vm.showProfile = false;
  //         $http.get("https://www.googleapis.com/plus/v1/people/me", {params: {access_token: result.access_token }})
  //         .then(function(res) {
  //
  //          vm.showProfile = true;
  //          vm.details = res.data;
  //          console.log('details: ', vm.details);
  //
  //         }, function(error) {
  //             alert("Error: " + error);
  //         });
  //
  //     },function(error) {
  //           // error
  //           vm.details = 'got error';
  //           console.log('error:', error);
  //       });
  //
  // }
