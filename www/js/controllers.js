'use strict';


app.controller('LoginController', ['$state', '$http', '$cordovaOauth', '$window', '$ionicLoading', function($state, $http, $cordovaOauth, $window, $ionicLoading){

var CLIENT_ID = '386825602244-09eg7osmai1qi07nbo9maefjpff7h0dm.apps.googleusercontent.com';
var vm = this;
console.log('here');
  vm.googleLogin = function() {
    console.log('sup');
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

app.controller('MapPageController', ['addMapService', function(ams){
  var vm = this;
  // runs on page load to load the map
  ams.getMap();

}])

app.controller('lastPageController', ['$scope', '$ionicModal', 'submitService', 'formService', function($scope, $ionicModal, submitService, formService){
  var vm = this;
  vm.issueShowText = false;

  // gives what's in the text box to the form service
  vm.updatePageThree = function(){
    vm.issueShowText = true;
    if(vm.issue.txt === ""){
      vm.issueShowText = false;
    }
    formService.issue.txt = vm.issue.txt;
    console.log('form service issue', formService.issue);
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

  //submits the form
  vm.submitWiseUp = function(){
     ss.submit();
   }

}])
/* aps is short for addPhotoSrvice */
app.controller('CityWiseController', ['$scope', '$ionicModal', '$http', 'addPhotoService', 'submitService', '$cordovaGeolocation', '$location', 'formService', function($scope, $ionicModal, $http, aps, ss, $cordovaGeolocation, $location, formService){
  var vm = this;
  vm.issue = {};
  vm.issue.type = 'roads' || formService.issue.type;


  //update form
  vm.updatePageOne = function(){
    formService.issue.type = vm.issue.type;
    console.log('form service issue', formService.issue);
  }


  // state to toggle photo button
  vm.photoTaken = aps.photoTaken;
  // empty object to hold form data

  // an empty variable to hold the photo data
  vm.photoData = '';

  vm.takePicture = function(){
    aps.takePicture()
    .then(function(photoData){
      aps.photoData = photoData;
    });
  }




}])
