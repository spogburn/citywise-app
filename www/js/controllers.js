'use strict';


app.controller('LoginController', ['$state', '$http', '$cordovaOauth', '$window', '$ionicLoading', function($state, $http, $cordovaOauth, $window, $ionicLoading){

var CLIENT_ID = '386825602244-09eg7osmai1qi07nbo9maefjpff7h0dm.apps.googleusercontent.com';

var vm = this;

  vm.googleLogin = function() {
    $ionicLoading.show({
        templateUrl: './templates/loading.html'
      })
      $cordovaOauth.google(CLIENT_ID, ["https://www.googleapis.com/auth/userinfo.email"])
      .then(function(result) {
        console.log('RESULT!!!' , JSON.stringify(result));
        return $http.post('https://city-wise.herokuapp.com/google-login', result);
    })
    .then(function(jwt){
      $window.localStorage.token = jwt.data.token;
      $window.localStorage.email = jwt.data.profile.email;
      $state.go('city-wise')
      })
      .catch(function(error) {
          console.log('error:', JSON.stringify(error));
      });
  }
}])



/* aps is short for addPhotoSrvice */
app.controller('CityWiseController', ['formService', 'addMapService', '$scope', '$state', '$ionicLoading', function(formService, ams, $scope, $state, $ionicLoading){

  $ionicLoading.show({
    templateUrl: './templates/loading.html',
    duration: 1500
  })

  ams.checkLocationService();

  var vm = this;
  vm.issue = {};
  vm.issue.type = 'roads' || formService.issue.type;

  //update form
  vm.updatePageOne = function(){
    formService.issue.type = vm.issue.type;
  }

}])

app.controller('MapPageController', ['$scope', 'addMapService', '$state', function($scope, ams, $state){
  $scope.$on('$stateChangeSuccess', function() {
    ams.getMap();
  });
}])

app.controller('lastPageController', ['$scope', '$ionicModal', 'addPhotoService', 'submitService', 'formService', function($scope, $ionicModal, aps, submitService, formService){
  var vm = this;

  // object to hold photo state
  vm.photo = aps.photo;

  //object to hold form state
  vm.issue = formService.issue;

  // holds the textarea text for clearing in case of cancel
  vm.txt = '';

  // object for errors
  vm.error = formService.error;


  // takes a picture and stores its base 64 data in a variable
  vm.takePicture = function(){
    aps.takePicture()
  }

  vm.addPicture = function(){
    aps.addPicture()
  }
  // gives what's in the text box to the form service
  vm.updatePageThree = function(text){
    formService.update(text);
  }

  //make the form modal
  $ionicModal.fromTemplateUrl('./templates/modal.html', {
  scope: $scope,
  animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.cancelModal = function(){
      vm.txt = '';
      formService.cancel()
      $scope.modal.hide();
    }
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };


  //submits the form
  vm.submitWiseUp = function(){
      submitService.submit();
   }

}])
