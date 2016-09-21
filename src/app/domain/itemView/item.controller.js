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
                          $state,
                          ToastHelper,
                          ImageHelper,
                          AuthHelper,
                          AlertHelper) {

    var Colour = Schema.model('Colour');
    var Material = Schema.model('Material');
    var FrameSize = Schema.model('FrameSize');
    var BaguetteImage = Schema.model('BaguetteImage');

    var vm = this;

    function recalcTotals() {
      vm.cartSubTotal = Cart.orderSubTotal();
      vm.cartTotal = Cart.orderTotal();
    }

    Cart.bindAll({}, $scope, 'vm.cart', recalcTotals);

    vm.isAdmin = AuthHelper.isAdmin();

    var stateFilter = {
      articleId: $stateParams.id
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

    Article.findAll({limit: 100})
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
      imageClick,
      deletePhoto,
      minusOne,
      plusOne,
      onBlur,
      onCartChange,
      addToCart: Cart.addToCart,
      article: '',
      isRootState: true,

      minThreshold: Article.minThreshold(),
      middleThreshold: Math.round(Article.maxThreshold()/2),
      maxThreshold: Article.maxThreshold(),

      showImageDialog: ImageHelper.mdDialogHelper(
        function (imsImg, id) {
          ArticleImage.create(
            angular.extend(imsImg, {
              articleId: id
            }));
        }),

      editFrame: function (frameId) {
        $state.go('catalogue.item.edit', {id: frameId});
      },

      deleteFrame: function (frameId, $event) {

        var promise = AlertHelper.showConfirm($event);

        promise.then(function (response) {
          if (response) {
            Article.destroy(frameId).then(function (frameId) {
              if (frameId) {
                ToastHelper.showToast('Рамка удалена', true);
                $state.go('catalogue')
              }
            }).catch(function () {
              ToastHelper.showToast('Ошибка. Рамка не удалена', false);
            });
          }
        });

      }

    }, stateFilter);

    $scope.$on('$stateChangeSuccess', function (event, to) {
      vm.isRootState = /(^|\.)item$/.test(to.name);
    });

  }

}());
