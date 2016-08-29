'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('ItemController', ItemController)
  ;

  function ItemController($stateParams,
                          Article,
                          Cart,
                          Schema,
                          ArticleImage,
                          $scope,
                          $mdDialog,
                          $mdMedia,
                          $window,
                          $mdToast,
                          $state) {

    var Colour = Schema.model('Colour');
    var Material = Schema.model('Material');
    var FrameSize = Schema.model('FrameSize');
    var BaguetteImage = Schema.model('BaguetteImage');

    var vm = this;

    var body2 = $window.document.getElementsByClassName('for-md-dialog');
    var el = $window.document.getElementsByClassName('toolbar-fixed-top');

    var stateFilter = {
      articleId: $stateParams.id
    };


    vm.showAdvanced = function (ev) {

      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

      $mdDialog.show({
          controller: 'AddPhotoDialogController as vm',
          templateUrl: "app/domain/itemView/addPhotoDialog.html",
          parent: body2,
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: useFullScreen
        })
        .then(function (answer) {

          _.each(answer, function (obj) {

            ArticleImage.create({
              smallSrc: obj.data.pictures[0].src,
              largeSrc: obj.data.pictures[1].src,
              thumbnailSrc: obj.data.pictures[2].src,
              articleId: vm.articleId
            });

          });

        });

      $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function (wantsFullScreen) {
        vm.customFullscreen = (wantsFullScreen === true);
      });

    };

    function minusOne(item) {

      var cart = item.inCart;

      cart.count--;

      if (!cart.count) {
        Cart.destroy(cart);
      } else {
        Cart.save(cart);
      }
    }

    function plusOne(item) {
      var cart = item.inCart;
      cart.count = (cart.count || 0) + 1;
      Cart.save(cart);
    }

    function onBlur(article) {
      if (!article.inCart.count) {
        Cart.destroy(article.inCart);
      }
    }

    function onCartChange(article) {
      Cart.save(article.inCart);
    }

    Article.findAll({limit: 1000})
      .then(function (data) {
        vm.allArt = data;
      });

    Article.find($stateParams.id).then(function (article) {
      vm.article = article;

      if (vm.article) {

        Colour.find(vm.article.colourId).then(function (colour) {
          vm.colour = colour;
        });

        Material.find(vm.article.materialId).then(function (material) {
          vm.material = material;
        });

        FrameSize.find(vm.article.frameSizeId).then(function (size) {
          vm.size = size;
        });

        ArticleImage.findAll(stateFilter).then(function () {

          ArticleImage.bindAll(stateFilter, $scope, 'vm.articleImages', function (a, b) {

            vm.articleImages = b;
            vm.images = _.union(vm.baguetteImages, vm.articleImages);
          });

          var baguetteImageFilter = {
            baguetteId: vm.article.baguetteId
          };

          BaguetteImage.findAll(baguetteImageFilter).then(function () {
            BaguetteImage.bindAll(baguetteImageFilter, $scope, 'vm.baguetteImages', function (a, b) {
              vm.baguetteImages = b;
              vm.images = _.union(vm.baguetteImages, vm.articleImages);
            });
          });

        });

      }

    });


    function imageClick(item) {
      vm.clickedImage = item;
    }

    function deletePhoto(photo) {
      ArticleImage.destroy(photo);
    }

    angular.extend(vm, {
      uploading: true,
      imageClick: imageClick,
      deletePhoto: deletePhoto,
      minusOne: minusOne,
      plusOne: plusOne,
      onBlur: onBlur,
      onCartChange: onCartChange,
      addToCart: Cart.addToCart,
      article: '',
      isEditable: true,     // admin settings !!
      isRootState: true,

      editFrame: function (frameId) {
        $state.go('catalogue.item.edit', {id: frameId});
      },

      deleteFrame: function (frameId) {
        Article.destroy(frameId).then(function (frameId) {
          if (frameId) {
            vm.showToast('Рамка удалена', true);
            $state.go('catalogue')
          }
        }).catch(function () {
          vm.showToast('Ошибка', false);
        });
      },

      showToast: function (resStr, status) {
        var theme;

        if (status) {
          theme = 'success-toast';
        } else {
          theme = 'fail-toast';

        }

        $mdToast.show(
          $mdToast.simple()
            .textContent(resStr)
            .position('top right')
            .hideDelay(2000)
            .theme(theme)
            .parent(el)
        );
      }

    }, stateFilter);


    $scope.$on('$stateChangeSuccess', function (event, to) {
      vm.isRootState = /(^|\.)item$/.test(to.name);
    });

  }

}());
