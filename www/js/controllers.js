'use strict';


app.controller('LoginController', ['$state', '$http', '$cordovaOauth', '$window', '$ionicLoading', '$ionicPopup', 'authService', function($state, $http, $cordovaOauth, $window, $ionicLoading, $ionicPopup, authService){

var CLIENT_ID = '386825602244-09eg7osmai1qi07nbo9maefjpff7h0dm.apps.googleusercontent.com';

var vm = this;

  // if(authService.checkAuth()){
  //   $state.go('city-wise')
  // }
console.log('window token in login', $window.localStorage.token);

  // plan to move this to a service to keep logic out of controller
  vm.googleLogin = function() {
    console.log('login');
    $ionicLoading.show({
        templateUrl: './templates/loading.html'
      })
      $cordovaOauth.google(CLIENT_ID, ["https://www.googleapis.com/auth/userinfo.email"])
      .then(function(result) {
        return $http.post('https://city-wise.herokuapp.com/google-login', result);
    })
    .then(function(jwt){
      console.log('jwt', jwt);
      $window.localStorage.token = jwt.data.token;
      $window.localStorage.email = jwt.data.profile.email;
      $state.go('city-wise')
      })
      .catch(function(error) {
        console.log('error:', JSON.stringify(error));
        // handle login errors
        $ionicLoading.hide()
        .then(function(){
          return $ionicPopup.alert({
            title: 'Login error',
              content: 'We are unable to log you in at this time. Please try again later.',
              buttons: [{text: 'Okay',type: 'button-energized'}]
          })
        })
        .then(function(){
          ionic.Platform.exitApp();
        })
      });
  }

}])


/* ams is short for addMapService */
app.controller('CityWiseController', ['formService', 'addMapService', '$scope', '$state', '$ionicLoading', '$ionicPlatform', 'authService', '$ionicPopup', function(formService, ams, $scope, $state, $ionicLoading, $ionicPlatform, authService, $ionicPopup){
  console.log('citywise controller');
  $ionicLoading.show({
    templateUrl: './templates/loading.html',
    duration: 1500
  })

  //checks if location is enabled if not prompts to enable
  $ionicPlatform.ready(function(){
    ams.checkLocationService();
  })

  var vm = this;
  vm.issue = formService.issue;

  //update form
  vm.updatePageOne = function(){
    formService.issue.type = vm.issue.type;
  }

  vm.logout = authService.logout;

}])

app.controller('MapPageController', ['$scope', 'addMapService', '$state', 'authService', function($scope, ams, $state, authService){
  console.log('map page controller');
  
  $scope.$on('$stateChangeSuccess', function() {
    ams.getMap();
  });

}])

app.controller('lastPageController', ['$scope', '$ionicModal', 'addPhotoService', 'submitService', 'formService', 'authService', function($scope, $ionicModal, aps, submitService, formService, authService){
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
      // formService.cancel() // not using until can improve UX on this
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
