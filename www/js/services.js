app.service('addPhotoService', ['$cordovaCamera', '$http', function($cordovaCamera, $http) {

  var sv = this;
  sv.url = '' ;
  sv.photoData = '';
  sv.photoTaken = {};

  //this method will open the camera app. It returns a promise with the data being the base64 encoded image
  sv.takePicture = function() {
    console.log('in photo function!');
    var options = {
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      allowEdit: 1,
      saveToPhotoAlbum: true,
	    correctOrientation: true
    };
    return $cordovaCamera.getPicture(options)
    .then(function(pictureData){
      sv.photoTaken.done = true;
      sv.photoData = 'data:image/jpeg;base64,' + pictureData;
     return 'data:image/jpeg;base64, ' + pictureData;
  });
}
  //this method uploads the image passed into it as base64 and returns a promise where the data is an object of information about the image. the url can be accessed at data.data.secure_url
  sv.uploadPicture = function(imageInfo) {
    return $http.post('https://api.cloudinary.com/v1_1/spogburn/auto/upload', {
        file: imageInfo,
        upload_preset: 'zt4pq0pu'
      })
      .then(function(data) {
        return data.data.secure_url;
      })
      .catch(function(err){
        console.log('error', err);
      });
  };
  //
  // sv.takeAndSend = function() {
  //    sv.takePicture()
  //      .then(function(image) {
  //        return sv.uploadPicture(image);
  //      })
  //      .then(function(_url) {
  //       sv.url = _url;
  //       console.log('url:', sv.url);
  //     })
  //      .catch(function(err) {
  //        console.log('error', err);
  //      });
  //  };

}])

app.service('addMapService', ['$cordovaGeolocation', function($cordovaGeolocation){
  var sv = this;
  var posOptions = {timeout: 20000, enableHighAccuracy: false};

  sv.getMap = function(){
    console.log('running get map');
    $cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function(position){
     sv.lat = position.coords.latitude;
     sv.long = position.coords.longitude
     var positionNow = new google.maps.LatLng(sv.lat, sv.long);
     reverseGeocode();
     var mapOptions = {
        center: positionNow,
        zoom: 15,
        draggable: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      sv.map = new google.maps.Map(document.getElementById("map"), mapOptions)
    var image = {
      path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
     fillColor: '#ffc900',
     fillOpacity: 0.8,
     scale: 1,
     strokeColor: '#444',
     strokeWeight: 6
     }
    // makes a marker
      var marker = new google.maps.Marker({
        position: positionNow,
        title: "Pinpoint your WiseUp!",
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: image
      });

    // Adds the marker to the map;
      marker.setMap(sv.map);

    // listens for the lat/long of the marker
      marker.addListener('dragend', function(){
        sv.lat = marker.getPosition().lat();
        sv.long = marker.getPosition().lng();
        sv.map.setCenter(marker.getPosition());
        console.log('lat:', sv.lat);
        console.log('long:', sv.long);
        reverseGeocode();
      })

      sv.map.addListener('dragend', function(){
        marker.setPosition(sv.map.getCenter())
      })

      function reverseGeocode(){
        var geocoder = new google.maps.Geocoder;
        var latlng = {lat: sv.lat, lng: sv.long}
        console.log('latlng,', latlng);
        geocoder.geocode({'location': latlng}, function(results, status){
          if (status === 'OK'){
            if (results[0]){
              console.log(results[0]);
              var results = results[0].formatted_address;
              // this gets the name of the city although i am not currently using this
              sv.cityName = results.split(', ')[1];
              // this gets the state two letter abbr ditto not using
              sv.stateAbbr = results.split(', ')[2].substring(0,2);
              console.log(sv.cityName);
              console.log(sv.stateAbbr);
            }
            else {
              console.log('no results found');
            }
          } else {
            console.log('status not ok', status);
          }
        })
      }

    }).catch(function(err){
      console.log('could not get location');
    });
  }
}])

// service that holds form values from various controllers
app.service('formService', ['$http', function($http){
 var sv = this;
 sv.issue = {};
}])

// service to send form to server endpoint
app.service('submitService', ['$http', '$window','addMapService', 'addPhotoService', 'formService', function($http, $window, ams, aps, formService){
  var sv = this;
  var lat = '';
  var long = '';
  var url = '';
  var cityWiseSubmit = {};

  sv.submit = function(){
    aps.photoTaken.done = false;
    aps.uploadPicture(aps.photoData)
    .then(function(data){
      url = data;
        cityWiseSubmit = {
        city: ams.cityName,
        state: ams.stateAbbr,
        category: formService.issue.type,
        issue: formService.issue.txt,
        photo_url: url,
        user_email: $window.localStorage.email,
        lat: ams.lat,
        long: ams.long
      }
      console.log('cityWiseSubmit', cityWiseSubmit);
    })
    .then(function(){
      return $http.post('https://city-wise.herokuapp.com/api/city-wise', cityWiseSubmit)
    })
    .then(function(response){
      console.log('response!', response);
      if(response.status === 200){
        // run a function to show the user the request was successfull
      } else {
        // run a funcion to show the user the request was not successul
      }
    })
    .catch(function(err){
      console.log('error', err);
    });

  }

  // sv.submit = function(form){
  //   // get user location in lt and long
  //   $http.post('http://localhost:3000/api/say-something', form){
  //       console.log(lat + '   ' + long);
  //    }).then(function(data){
  //    })
  //    .catch(function(err){
  //      console.log('error in submitting form', err);
  //    })
  // }


}])
