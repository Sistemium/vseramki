(function () {

  angular
    .module('vseramki')
    .controller('AddPhotoDialogController', AddPhotoDialogController);

  function AddPhotoDialogController($mdDialog, Upload, $q, $state, $scope) {

    var vm = this;
    var folder;

    vm.hide = function () {
      $mdDialog.hide();
    };

    vm.cancel = function () {
      $mdDialog.cancel();
    };

    vm.answer = function (answer) {
      $mdDialog.hide(answer);
    };


    if (/^cat/.test($state.current.name)) {
      folder = 'Article';
    } else if (/^bag/.test($state.current.name)) {
      folder = 'Baguette';
    } else {
      folder = 'Unknown'
    }

    console.log(folder);

    var un = $scope.$on('uploadProgress', function (e, progressPercent) {
      vm.progressPercent = progressPercent;
    });

    $scope.$on('$destroy', un);

    function uploadFiles() {

      var promises = [];
      var operations = [];

      function setProgress() {

        var total = 0;
        var loaded = 0;

        _.each(operations, function (operation) {
          total += operation.total;
          loaded += operation.loaded;
          $scope.$broadcast('uploadProgress', Math.round(
            100.0 * loaded / total
          ));
        });

      }

      _.each(vm.files, function (f) {

        var file = f.lfFile;  // for lf-ng-md-file-input. use  var file = files[i] for ng-file-upload

        if (!file.$error) {

          var operation = {};

          operations.push(operation);

          promises.push($q(function (resolve, reject) {

            Upload.upload({
                url: 'https://api.sistemium.com/ims/vr',
                data: {
                  file: file,
                  folder: folder
                }
              })
              .progress(function (progress) {
                angular.extend(operation, _.pick(progress, ['loaded', 'total']));
                setProgress();
              })
              .then(function (resp) {
                resolve(resp);
              }, reject);

          }));

        }

      });

      vm.busy = true;

      $q.all(promises)
        .then(function (pictures) {
          $mdDialog.hide(pictures);
        })
        .catch(function () {
          vm.busy = false;
        });

    }

    angular.extend(vm, {
      uploadFiles: uploadFiles
    });

  }

})();
