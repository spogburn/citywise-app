'use strict';

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

app.controller('LoginController', ['$state', '$http', '$cordovaOauth', '$window', '$location', function($state, $http, $cordovaOauth, $window, $location){

  var CLIENT_ID = '386825602244-09eg7osmai1qi07nbo9maefjpff7h0dm.apps.googleusercontent.com';
  var vm = this;

  vm.googleLogin = function() {
      $cordovaOauth.google(CLIENT_ID, ["https://www.googleapis.com/auth/userinfo.email"])
      .then(function(result) {
      $http.post('http://localhost:3000/google-login', result)
    })
      .then(function(jwt){
      alert('logged in!')
      $state.go('tabs.home')
      }), function(error) {
          console.log('error:', error);
      };
  }
}])
