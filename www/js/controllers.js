'use strict';


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
      $ionicLoading.hide();
      $state.go('city-wise')
      }), function(error) {
          console.log('error:', error);
      };
  }
}])

app.controller('MapPageController', ['$scope', 'addMapService', function($scope, ams){
  ams.getMap();
}])

app.controller('lastPageController', ['$scope', '$ionicModal', 'addPhotoService', 'submitService', 'formService', function($scope, $ionicModal, aps, submitService, formService){
  var vm = this;

  // object to hold photo state
  vm.photo = aps.photo;

  //object to hold form state
  vm.issue = formService.issue;

  // object for errors
  vm.error = formService.error;
  console.log(vm.error);

  // takes a picture and stores its base 64 data in a variable
  vm.takePicture = function(){
    aps.takePicture()
  }

  // gives what's in the text box to the form service
  vm.updatePageThree = function(text){
    formService.update(text)
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
      submitService.submit();
   }

}])
/* aps is short for addPhotoSrvice */
app.controller('CityWiseController', ['formService', function(formService){
  var vm = this;
  vm.issue = {};
  vm.issue.type = 'roads' || formService.issue.type;

  //update form
  vm.updatePageOne = function(){
    formService.issue.type = vm.issue.type;
    console.log('form service issue', formService.issue);
  }


}])
