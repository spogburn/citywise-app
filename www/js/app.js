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

/* aps is short for addPhotoSrvice */
app.controller('SaySomethingController', ['$http', 'addPhotoService', 'submitService', '$cordovaGeolocation', function($http, aps, ss, $cordovaGeolocation){
  var vm = this;
  vm.picture = '';
  vm.showPhotoButton = true;
  vm.takePicture = function(){
    aps.takePicture()
    .then(function(image){
    vm.picture = image;
    vm.showPhotoButton = false;
    console.log('new picture:', vm.picture);
  });
}
  vm.submit = ss.submit;
}])

app.controller('HomeController', ['$http', function($http){
  var vm = this;
}])

app.controller('LoginController', ['$state', '$http', '$cordovaOauth', function($state, $http, $cordovaOauth){

  var CLIENT_ID = '386825602244-09eg7osmai1qi07nbo9maefjpff7h0dm.apps.googleusercontent.com';
  var vm = this;
  vm.googleLogin = function() {

      $cordovaOauth.google(CLIENT_ID, ["https://www.googleapis.com/auth/userinfo.email"])
      .then(function(result) {
      $http.post('http://localhost:3000/google-login', result)
    }), function(error) {
          console.log('error:', error);
      };
  }
}])
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
