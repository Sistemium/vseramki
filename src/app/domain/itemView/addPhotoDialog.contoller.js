(function () {

  angular
    .module('vseramki')
    .controller('AddPhotoDialogController', AddPhotoDialogController);

  function AddPhotoDialogController($mdDialog, Upload, $q) {

    var vm = this;

    vm.hide = function () {
      $mdDialog.hide();
    };

    vm.cancel = function () {
      $mdDialog.cancel();
    };

    vm.answer = function (answer) {
      $mdDialog.hide(answer);
    };

    function uploadFiles() {

      var promises = [];

      _.each(vm.files, function (f) {

        var file = f.lfFile;  // for lf-ng-md-file-input. use  var file = files[i] for ng-file-upload

        if (!file.$error) {

          promises.push($q(function (resolve, reject) {

            Upload.upload({
              url: 'https://api.sistemium.com/ims/vr',
              data: {
                file: file,
                folder: 'Article'
              }
            }).then(function (resp) {
              resolve(resp);
            }, reject);

          }));

        }

      });

      $q.all(promises).then(function (pictures) {
        console.log('Saved pictures:', pictures.length);
        $mdDialog.hide(pictures);
      });

    }

    angular.extend(vm, {
      uploadFiles: uploadFiles
    });

  }

})();
