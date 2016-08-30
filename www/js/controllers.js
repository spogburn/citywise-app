'use strict';

/* aps is short for addPhotoSrvice */
app.controller('SaySomethingController', ['$scope', '$http', 'addPhotoService', 'addMapService', 'submitService', '$cordovaGeolocation', function($scope, $http, aps, ams, ss, $cordovaGeolocation){
  var vm = this;

  vm.showMap = ams.getMap();

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

  // swiper
  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
  // data.slider is the instance of Swiper
  $scope.slider = data.slider;
});

  $scope.swiper = {
        options: {
            pagination: '.custom-swiper-pagination',
            paginationClickable: true,
            loop: false,
            direction: 'horizontal',
            spaceBetween: 20,
            speed: 600,
            touchAngle: 10,
            simulateTouch: false
        },
        data: {}
  };

}])

app.controller('HomeController', ['$http', function($http){
  var vm = this;
}])

app.controller('LoginController', ['$state', '$http', '$cordovaOauth', '$window', function($state, $http, $cordovaOauth, $window){

  var CLIENT_ID = '386825602244-09eg7osmai1qi07nbo9maefjpff7h0dm.apps.googleusercontent.com';
  var vm = this;

  vm.googleLogin = function() {
      $cordovaOauth.google(CLIENT_ID, ["https://www.googleapis.com/auth/userinfo.email"])
      .then(function(result) {
      return $http.post('http://localhost:3000/google-login', result)
    })
    .then(function(jwt){
      console.log('jwt:', jwt);
      $window.localStorage.token = jwt.data.token;
      $window.localStorage.email = jwt.data.profile.email;
      $state.go('tabs.home')
      }), function(error) {
          console.log('error:', error);
      };
  }
}])
