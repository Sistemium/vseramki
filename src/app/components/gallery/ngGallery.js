'use strict';

(function () {

  angular.module('vseramki').directive('ngGallery', ngGallery);

  function ngGallery($document, $timeout, $q, $templateCache, $window, $state, Schema) {

    var el = $window.$;
    var model;


    if (/^cat/.test($state.current.name)) {
      var ArticleImage = Schema.model('ArticleImage');
      model = ArticleImage;

    } else if (/^bag/.test($state.current.name)) {
      var BaguetteImage = Schema.model('BaguetteImage');
      model = BaguetteImage;

    } else {
      console.error('Unknown state');
    }

    var defaults = {
      baseClass: 'ng-gallery',
      thumbClass: 'ng-thumb',
      templateUrl: 'app/components/gallery/galleryTemplate.html'
    };

    var keys_codes = {
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


    // Set the default template
    $templateCache.put('galleryTemplate.html');

    return {
      restrict: 'EA',

      scope: {
        images: '=',
        thumbsNum: '@',
        hideOverflow: '=',
        imageHoveredFn: '&',
        isDeletable: '='
      },

      controller: [
        '$scope',
        function ($scope) {
          $scope.$on('openGallery', function (e, args) {
            $scope.openGallery(args.index);
          });
        }
      ],

      templateUrl: function (element, attrs) {
        return attrs.templateUrl || defaults.templateUrl;
      },

      link: function (scope, element, attrs) {

        setScopeValues(scope, attrs);

        if (scope.thumbsNum >= 11) {
          scope.thumbsNum = 11;
        }

        function querySelectorAll (q){
          return element[0].querySelectorAll(q);
        }

        var $body = $document.find('body');
        var $thumbwrapper;// = angular.element(querySelectorAll('.ng-thumbnails-wrapper'));
        var $thumbnails;// = angular.element(querySelectorAll('.ng-thumbnails'));

        scope.index = 0;
        scope.opened = false;

        scope.thumb_wrapper_width = 0;
        scope.thumbs_width = 0;

        var loadImage = function (i) {

          var deferred = $q.defer();
          var image = new Image();

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
            image.src = scope.images[i].smallSrc;
          });


          return deferred.promise;
        };

        var showImage = function (i) {
          loadImage(scope.index).then(function (resp) {
            //defineClass(_.get(resp, 'naturalWidth'), _.get(resp, 'naturalHeight'));
            scope.img = resp.src;
            scope.id = scope.description;
            smartScroll(scope.index);
          });
          scope.description = scope.images[i].id || '';
        };

        //var defineClass = function (width, height) {
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

          if (angular.isDefined(i)) {
            scope.index = i;
            showImage(scope.index);
          }

          scope.opened = true;

          if (scope.hideOverflow) {
            el('body').css({overflow: 'hidden'});
          }

          $timeout(function () {

            $thumbwrapper = angular.element(querySelectorAll('.ng-thumbnails-wrapper'));
            $thumbnails = angular.element(querySelectorAll('.ng-thumbnails'));

            var calculatedWidth = calculateThumbsWidth();
            scope.thumbs_width = calculatedWidth.width;
            //Add 1px, otherwise some browsers move the last image into a new line
            var thumbnailsWidth = calculatedWidth.width + 1;
            $thumbnails.css({width: thumbnailsWidth + 'px'});
            $thumbwrapper.css({width: calculatedWidth.visible_width + 'px'});
            smartScroll(scope.index);

          });
        };

        scope.closeGallery = function () {
          scope.opened = false;
          if (scope.hideOverflow) {
            el('body').css({overflow: ''});
          }
        };

        scope.showAlert = function () {
          // TODO: really show alert
          // TODO: model can be ArticleImage or BaguetteImage
          model.destroy(scope.images[scope.index]);
          scope.closeGallery();
        };

        scope.deletePhoto = function (id, index) {

          console.log(id, index);

          if (scope.images.length == 1) {
            model.destroy(id);
            scope.closeGallery();
          } else if ((scope.index + 1) == scope.images.length) {
            model.destroy(id);
            scope.index = 0;
            showImage(scope.index + 1);
          } else {
            model.destroy(id);
            scope.index = index;
            scope.changeImage(index);

          }

        };

        $body.bind('keydown', function (event) {
          if (!scope.opened) {
            return;
          }
          var which = event.which;
          if (which === keys_codes.esc) {
            scope.closeGallery();
          } else if (which === keys_codes.right || which === keys_codes.enter) {
            scope.nextImage();
          } else if (which === keys_codes.left) {
            scope.prevImage();
          }

          scope.$apply();
        });

        var calculateThumbsWidth = function () {

          var width = 0;
          var visible_width = 0;

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

        var smartScroll = function (index) {
          $timeout(function () {

            if (!_.first($thumbwrapper)) {
              return;
            }

            var len = scope.images.length,
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
