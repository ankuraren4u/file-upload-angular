'use strict';

angular.module('myApp.upload', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/upload', {
    templateUrl: 'upload/upload.html',
    controller: 'FileUpload'
  });
}])

.controller('FileUpload', function($scope, $http, $sce, $timeout) {
    $scope.progress = null;
    $scope.loaded = false;
    $scope.wistiaPassword = '19b0898874ecd8e68ade1f3a48d5fedc6531222a912e29ff3c4207073b385c3c';

    $scope.checkStatus = function(hashId) {
        $http({
          method: 'GET',
          url: 'https://api.wistia.com/v1/medias/' + hashId + '.json?api_password=' + $scope.wistiaPassword
        }).then(function (response) {
          if (response.data.status == 'ready') {
            $scope.status = null;
            $scope.url = $sce.trustAsResourceUrl('https://fast.wistia.net/embed/iframe/' + hashId);
            $scope.loaded = true;
            $scope.progress = null;
           // $scope.$apply();
            $("#upload-btn").val("Upload Now").attr('disabled', false);
          } else if (response.data.status != 'failed') {
            $scope.status = 'Processing...'
            //$scope.$apply();
            $timeout(function(){
              $scope.checkStatus(hashId);
            }, 3000);
          }
        });
      };
    $('#fileupload').fileupload({
        dataType: 'json',
        formData: {
            api_password: $scope.wistiaPassword
        },
        add: function (e, data) {
            $scope.file = data.files[0];
            $scope.process = 0;
            $scope.loaded = false;
            $scope.status = "Uploading..."
            $("#upload-btn").val("Uploading").attr('disabled', true);
            data.submit();
        },
        done: function (e, data) {
            if (data.result.hashed_id != '') {
              $scope.checkStatus(data.result.hashed_id);
              // $scope.url = $sce.trustAsResourceUrl('http://fast.wistia.net/embed/iframe/' + data.result.hashed_id);
            }
        },
        progressall: function (e, data) {
            $scope.progress = parseInt(data.loaded / data.total * 100, 10);
            $scope.$apply();
        },
        fail: function(e, data) {
          $("#upload-btn").val("Retrying").attr('disabled', true);
          data.submit();
        }
    });

    $scope.openFileUpload = function() {
        $("#fileupload").click();
    };
});