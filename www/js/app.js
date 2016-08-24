// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('saySomething', ['ionic', 'ngCordova'])

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
        // controller: 'HomeController as HC'
      }
    }
  })
  $urlRouterProvider.otherwise('/tab/say-something')
})

/* aps is short for addPhotoSrvice */
app.controller('SaySomethingController', ['$http', 'addPhotoService', function($http, aps){
  var vm = this;
  vm.takePicture = aps.takePicture;

}])
