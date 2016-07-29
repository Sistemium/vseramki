'use strict';

(function () {

  angular.module('vseramki')
    .service('ImageHelper', ImageHelper);

  function ImageHelper($mdMedia, $window, $mdDialog, $rootScope) {

    var body2 = $window.document.getElementsByClassName('for-md-dialog');
    var customFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

    var un = $rootScope.$watch(function () {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function (wantsFullScreen) {
      customFullScreen = (wantsFullScreen === true);
    });

    $rootScope.$on('$destroy', un);

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

    return {

      mdDialogHelper: function (responder) {
        return function showDialog(ev, id) {

          $mdDialog.show({
              controller: 'AddPhotoDialogController as vm',
              templateUrl: 'app/domain/itemView/addPhotoDialog.html',
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

    }
  }

})();
