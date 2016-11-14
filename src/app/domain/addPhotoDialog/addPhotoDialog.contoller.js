(function () {

  function AddPhotoDialogController($mdDialog, Upload, $q, $state, saaAppConfig, $timeout) {

    var vm = this;
    var folder;

    angular.extend(vm, {

      uploadFiles,
      hide: () => $mdDialog.hide(),
      cancel: () => $mdDialog.cancel(),
      answer: answer => $mdDialog.hide(answer)

    });

    if (/^cat/.test($state.current.name)) {
      folder = 'Article';
    } else if (/^bag/.test($state.current.name)) {
      folder = 'Baguette';
    } else {
      folder = 'Images'
    }

    function uploadFiles() {

      var promises = [];
      var operations = [];

      function setProgress() {

        var total = 0;
        var loaded = 0;

        _.each(operations, function (operation) {
          total += operation.total;
          loaded += operation.loaded;
        });

        $timeout(() => vm.progressPercent = Math.round(100.0 * loaded / total));

      }

      _.each(vm.files, function (f) {

        var file = f.lfFile;  // for lf-ng-md-file-input. use  var file = files[i] for ng-file-upload

        if (!file.$error) {

          var operation = {};

          operations.push(operation);

          promises.push($q(function (resolve, reject) {

            Upload.upload({
              url: saaAppConfig.ims || 'https://api.sistemium.com/ims/vr',
              data: {
                file: file,
                folder: folder
              }
            })
              .progress(function (progress) {
                angular.extend(operation, _.pick(progress, ['loaded', 'total']));
                setProgress();
              })
              .then(resolve, reject);

          }));

        }

      });

      vm.busy = true;

      return $q.all(promises)
        .then(function (pictures) {
          $mdDialog.hide(pictures);
        })
        .catch(function () {
          vm.busy = false;
        });

    }

  }

  angular
    .module('vseramki')
    .controller('AddPhotoDialogController', AddPhotoDialogController);

})();
