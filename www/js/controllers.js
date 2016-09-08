'use strict';

/* aps is short for addPhotoSrvice */
app.controller('CityWiseController', ['$scope','$ionicModal', '$http', 'addPhotoService', 'addMapService', 'submitService', '$cordovaGeolocation', function($scope, $ionicModal, $http, aps, ams, ss, $cordovaGeolocation){
  var vm = this;
  // this makes it so the map never loads on ionic browser.
  document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log("navigator.geolocation function about to run");
        ams.getMap();
    }

  // comment this out when not testing in ionic
  ams.getMap();

  // state to toggle photo button
  vm.photoTaken = aps.photoTaken;
  // empty object to hold form data
  vm.issue = {};
  // an empty variable to hold the photo data
  vm.photoData = '';

  vm.takePicture = function(){
    aps.takePicture()
    .then(function(photoData){
      vm.issue.photoData = photoData;
    });
  }

  //make the form modal
  $ionicModal.fromTemplateUrl('./templates/modal.html', {
  scope: $scope,
  animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
// Execute action on remove modal
    $scope.$on('modal.removed', function() {
  // Execute action
});

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
      $state.go('city-wise')
      }), function(error) {
          console.log('error:', error);
      };
  }
}])
