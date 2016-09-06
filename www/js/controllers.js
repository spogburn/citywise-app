'use strict';

/* aps is short for addPhotoSrvice */
app.controller('CityWiseController', ['$scope', '$http', 'addPhotoService', 'addMapService', 'submitService', '$cordovaGeolocation', function($scope, $http, aps, ams, ss, $cordovaGeolocation){
  var vm = this;
  vm.showMap = ams.getMap();

  // state to toggle photo button
  vm.hideSuccess = true;
  // empty object to hold form data
  vm.issue = {};
  // an empty variable to hold the photo data
  vm.photoData = '';

  vm.takePicture = function(){
    aps.takeAndSend()
    .then(function(){
      vm.hideSuccess = false;
    })
  }

  vm.submitWiseUp = function(){
     ss.submit(vm.issue);
   }

}])

app.controller('HomeController', ['$http', function($http){
  var vm = this;
}])

app.controller('LoginController', ['$state', '$http', '$cordovaOauth', '$window', '$ionicLoading', function($state, $http, $cordovaOauth, $window, $ionicLoading){

  var CLIENT_ID = '386825602244-09eg7osmai1qi07nbo9maefjpff7h0dm.apps.googleusercontent.com';
  var vm = this;

  vm.googleLogin = function() {
      $cordovaOauth.google(CLIENT_ID, ["https://www.googleapis.com/auth/userinfo.email"])
      .then(function(result) {
        $ionicLoading.show({
          templateUrl: './templates/loading.html'
        })
      return $http.post('https://city-wise.herokuapp.com/google-login', result)
    })
    .then(function(jwt){
      console.log('jwt:', jwt);
      $window.localStorage.token = jwt.data.token;
      $window.localStorage.email = jwt.data.profile.email;
      console.log('about to redirect');
      $ionicLoading.hide();
      $state.go('tabs.city-wise')
      }), function(error) {
          console.log('error:', error);
      };
  }
}])
