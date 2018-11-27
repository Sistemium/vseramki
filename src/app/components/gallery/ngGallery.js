'use strict';

(function () {

  angular.module('vseramki').directive('ngGallery', ngGallery);

  function ngGallery($document, $timeout, $q, $templateRequest, $compile, ToastHelper) {

    const defaults = {
      baseClass: 'ng-gallery',
      thumbClass: 'ng-thumb',
      templateUrl: 'app/components/gallery/galleryTemplate.html'
    };

    const keys_codes = {
      enter: 13,
      esc: 27,
      left: 37,
      right: 39
    };

    function setScopeValues(scope) {
      scope.baseClass = scope.class || defaults.baseClass;
      scope.thumbClass = scope.thumbClass || defaults.thumbClass;
      scope.thumbsNum = scope.thumbsNum || 3; // should be odd
    }

    return {
      restrict: 'EA',

      scope: {
        images: '=',
        thumbsNum: '@',
        hideOverflow: '=',
        imageHoveredFn: '&',
        thumbnailClickFn: '&',
        isDeletable: '='
      },

      controller: [
        '$scope',
        function ($scope) {

          const vm = this;

          $scope.$on('openGallery', function (e, args) {
            $scope.openGallery(args.index);
          });

          vm.thumbnailClick = function (img, index) {

            const fn = $scope.thumbnailClickFn() || $scope.openGallery;

            if (_.isFunction(fn)) {
              fn(index, img);
            }

          }
        }
      ],

      controllerAs: 'vm',

      templateUrl: function (element, attrs) {
        return attrs.templateUrl || defaults.templateUrl;
      },

      link: function (scope, element, attrs) {

        setScopeValues(scope, attrs);

        if (scope.thumbsNum >= 11) {
          scope.thumbsNum = 11;
        }

        function querySelectorAll(q) {
          return element[0].querySelectorAll(q);
        }

        const $body = $document.find('body');
        let $thumbwrapper;// = angular.element(querySelectorAll('.ng-thumbnails-wrapper'));
        let $thumbnails;// = angular.element(querySelectorAll('.ng-thumbnails'));

        scope.index = 0;
        scope.opened = false;

        scope.thumb_wrapper_width = 0;
        scope.thumbs_width = 0;
        scope.clickCount = 0;

        const loadImage = function (i) {

          const deferred = $q.defer();
          const image = new Image();

          image.onload = function () {
            scope.loading = false;
            if (this.complete === false || this.naturalWidth === 0) {
              deferred.reject();
            }
            deferred.resolve(image);
          };

          image.onerror = function () {
            deferred.reject();
          };

          scope.loading = true;

          $timeout(function () {
            image.src = scope.images[i].largeSrc;
          });


          return deferred.promise;
        };

        const showImage = function (i) {
          loadImage(scope.index).then(function (resp) {
            //defineClass(_.get(resp, 'naturalWidth'), _.get(resp, 'naturalHeight'));
            scope.img = resp.src;
            scope.id = scope.description;
            smartScroll(scope.index);
          });
          scope.description = scope.images[i].id || '';
          scope.confirmDelete = false;
        };

        let fullscreenElement;

        //const defineClass = function (width, height) {
        //  scope.useWide = false, scope.useTall = false;
        //  width >= height ? scope.useWide = true : scope.useTall = true;
        //};

        scope.changeImage = function (i) {
          scope.index = i;
          showImage(i);
        };

        scope.nextImage = function () {

          scope.index += 1;

          if (scope.index === scope.images.length) {
            scope.index = 0;
          }

          showImage(scope.index);
        };

        scope.prevImage = function () {
          scope.index -= 1;
          if (scope.index < 0) {
            scope.index = scope.images.length - 1;
          }
          showImage(scope.index);
        };

        scope.setHovered = function (image) {
          if (_.isFunction(scope.imageHoveredFn())) {
            scope.imageHoveredFn()(image);
          }
        };

        scope.openGallery = function (i) {

          $templateRequest('app/components/gallery/galleryFullscreen.html')
            .then(function (html) {
              const template = angular.element(html);
              $body.append(template);
              fullscreenElement = $compile(template)(scope);
            });

          if (angular.isDefined(i)) {
            scope.index = i;
            showImage(scope.index);
          }

          scope.opened = true;

          $timeout(function () {

            $thumbwrapper = angular.element(querySelectorAll('.ng-thumbnails-wrapper'));
            $thumbnails = angular.element(querySelectorAll('.ng-thumbnails'));

            const calculatedWidth = calculateThumbsWidth();
            scope.thumbs_width = calculatedWidth.width;
            //Add 1px, otherwise some browsers move the last image into a new line
            const thumbnailsWidth = calculatedWidth.width + 1;
            $thumbnails.css({width: thumbnailsWidth + 'px'});
            $thumbwrapper.css({width: calculatedWidth.visible_width + 'px'});
            smartScroll(scope.index);

          });
        };

        scope.closeGallery = function () {
          scope.opened = false;
          fullscreenElement.remove();
        };

        scope.deletePhoto = function () {

          const imageModel = scope.images[scope.index];

          if (imageModel) {
            imageModel.DSDestroy()
              .then(()=>{
                scope.closeGallery();
              })
              .catch(err => {
                scope.closeGallery();
                ToastHelper.error('Не удалось удалить изображение');
                console.error(err);
              });
          } else {
            console.error('ngGallery: Failed to initialize image model');
          }

        };

        scope.deleteClick = function () {
          if (scope.confirmDelete) {
            scope.deletePhoto();
          }
          scope.confirmDelete = !scope.confirmDelete;
        };

        $body.bind('keydown', function (event) {
          if (!scope.opened) {
            return;
          }
          const which = event.which;
          if (which === keys_codes.esc) {
            scope.closeGallery();
          } else if (which === keys_codes.right || which === keys_codes.enter) {
            scope.nextImage();
          } else if (which === keys_codes.left) {
            scope.prevImage();
          }

          scope.$apply();
        });

        const calculateThumbsWidth = function () {

          let width = 0;
          let visible_width = 0;

          angular.forEach($thumbnails.find('img'), function (thumb) {
            width += thumb.clientWidth;
            width += 10; // margin-right
            visible_width = thumb.clientWidth + 10;
          });
          scope.width = width;
          scope.visibleWidth = visible_width * scope.thumbsNum;
          return {
            width: width,
            visible_width: visible_width * scope.thumbsNum
          };
        };

        let smartScroll = function (index) {
          $timeout(function () {

            if (!_.first($thumbwrapper)) {
              return;
            }

            let len = scope.images.length,
              width = scope.thumbs_width,
              item_scroll = parseInt(width / len, 10),
              i = index + 1,
              s = Math.ceil(len / i);

            $thumbwrapper[0].scrollLeft = 0;
            $thumbwrapper[0].scrollLeft = i * item_scroll - (s * item_scroll);
          }, 100);
        };

      }
    };
  }
})();
