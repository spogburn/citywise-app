// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('CityWise', ['ionic', 'ngCordova', 'ngCordovaOauth'])

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

app.constant("production", {
        "apiUrl": "https://city-wise.herokuapp.com/"
    })

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
  $ionicConfigProvider
  .spinner.icon('spiral')
  $ionicConfigProvider.views.swipeBackEnabled(false)

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: './templates/login.html',
    controller: 'LoginController as LC',
    cache: false
  })
  .state('city-wise', {
    url: '/city-wise',
    templateUrl: './templates/city-wise.html',
    controller: 'CityWiseController as CWC'
  })
  .state('city-wise2', {
    url: '/city-wise2',
    cache: false,
    templateUrl: './templates/city-wise2.html',
    controller: 'MapPageController as MPC'
  })
  .state('city-wise3', {
      url: '/city-wise3',
      templateUrl: './templates/city-wise3.html',
      controller: 'lastPageController as LPC'
  })
  .state('success', {
    url: '/success',
    templateUrl: './templates/success.html'
  })
  .state('failure', {
    url: '/failure',
    templateUrl: './templates/failure.html'
  })
  $urlRouterProvider.otherwise('/login')
});

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
