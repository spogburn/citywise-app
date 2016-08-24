app.service('addPhotoService', ['$cordovaCamera', '$http', function($cordovaCamera, $http) {

  var sv = this;
  sv.picture = {
    avatar: ''
  };
  //this method will open the camera app. after a photo is taken the user will crop it. It returns a promise with the data being the base64 encoded image
  sv.takePicture = function() {
    console.log('taking photo!');
    var options = {
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      allowEdit: true,
      targetWidth: 1200,
      targetHeight: 800,
      saveToPhotoAlbum: false,
	    correctOrientation:true
    };
    console.log('options: ', options);
    return $cordovaCamera.getPicture(options)
      .then(function(data) {
        console.log('data:', 'data:image/jpeg;base64,' + data);
        return 'data:image/jpeg;base64,' + data;
      });
  };

  //this method uploads the image passed into it as base64 and returns a promise where the data is an object of information about the image. the url can be accessed at data.data.secure_url
  sv.uploadPicture = function(imageInfo) {
    return $http.post('https://api.cloudinary.com/v1_1/spogburn/auto/upload', {
        file: imageInfo,
        upload_preset: 'zt4pq0pu'
      })
      .then(function(data) {
        return data.data.secure_url;
      });
  };

  sv.takeAndSend = function(){

  }

  sv.takeAndSubmit = function() {
   var url;
     sv.takePicture()
       .then(function(image) {
         return sv.uploadPicture(image);
       })
       .then(function(_url) {
         url = _url;
         return sv.sendPicture(number, username + ' has submitted the following picture of ' + taskName + ' for review');
       })
       .then(function() {
         return sv.sendPicture(number, url);
       })
       .then(function() {
         alert(taskName + ' was successfully submitted.');
       })
       .catch(function(err) {
         alert('there was an issue submitting ' + taskName);
       });
 };

}])
