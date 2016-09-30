'use strict';

(function () {

  const MIN_LOADING = 400;

  angular.module('vseramki')
    .service('ImageHelper', ImageHelper);

  function ImageHelper($mdMedia, $window, $mdDialog, $rootScope, $q, $timeout) {

    var body2 = $window.document.getElementsByClassName('for-md-dialog');
    var customFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

    var un = $rootScope.$watch(function () {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function (wantsFullScreen) {
      customFullScreen = (wantsFullScreen === true);
    });

    $rootScope.$on('$destroy', un);

    function loadImage(src) {
      return $q((resolve, reject) => {

        var image = new Image();
        var startedAt = new Date();

        image.onload = function () {
          if (this.complete === false || this.naturalWidth === 0) {
            reject();
          }

          var since = startedAt - new Date() + MIN_LOADING;
          $timeout(since > 0 ? since : 0)
            .then(()=>resolve(image));
        };

        image.onerror = function () {
          reject();
        };

        $timeout(function () {
          image.src = src;
        });

      });
    }

    function imsResponseHelper(data) {

      var pictures = _.get(data, 'data.pictures');

      if (!pictures) {
        console.error('Unexpected IMS response', data);
        return;
      }

      function safeSrc(key) {
        return _.get(_.find(pictures, {name: key}), 'src');
      }

      return {
        smallSrc: safeSrc('smallImage'),
        largeSrc: safeSrc('largeImage'),
        thumbnailSrc: safeSrc('thumbnail')
      };

    }

    function mdDialogHelper(responder) {
      return function showDialog(ev, id) {

        $mdDialog.show({
          controller: 'AddPhotoDialogController as vm',
          templateUrl: 'app/domain/addPhotoDialog/addPhotoDialog.html',
          parent: body2,
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: !!customFullScreen
        })
          .then(function (photos) {
            _.each(photos, function (photo) {
              responder(imsResponseHelper(photo), id);
            });
          });

      }
    }

    return {
      mdDialogHelper,
      loadImage
    };

  }

})();
