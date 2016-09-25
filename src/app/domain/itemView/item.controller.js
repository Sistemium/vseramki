'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('ItemController', ItemController)
  ;

  function ItemController($filter, Schema, ArticleImage, $scope, $state, ToastHelper, ImageHelper, AuthHelper, AlertHelper) {

    var Article = Schema.model('Article');
    var Cart = Schema.model('Cart');
    var Colour = Schema.model('Colour');
    var Material = Schema.model('Material');
    var FrameSize = Schema.model('FrameSize');
    var BaguetteImage = Schema.model('BaguetteImage');

    var vm = this;
    var numberFilter = $filter('number');

    function recalcTotals() {
      Cart.recalcTotals(vm);
      if (vm.article) {
        setPrices();
      }
    }

    Cart.bindAll({}, $scope, 'vm.cart', recalcTotals);

    vm.isAdmin = AuthHelper.isAdmin();

    var stateFilter = {
      articleId: $state.params.id
    };

    function minusOne(item) {

      var cart = item.inCart;

      cart.count--;

      if (cart.count <= 0) {
        Cart.destroy(cart);
      } else {
        onCartChange(cart);
      }

    }

    function plusOne(item) {
      var cart = item.inCart;
      cart.count = (cart.count || 0) + 1;

      onCartChange(cart);
    }

    function onBlur(article) {
      if (!article.inCart.count) {
        Cart.destroy(article.inCart);
      }
    }

    function onCartChange(cart) {
      Cart.save(cart);
    }

    Article.findAll({limit: 100})
      .then(function (data) {
        vm.allArt = data;
      });

    Article.find($state.params.id).then(function (article) {
      vm.article = article;

      if (vm.article) {

        setPrices();

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

    function setPrices() {

      var discount = 100 - 100 * vm.article.discountedPrice(vm.cartSubTotal)/vm.article.highPrice;

      vm.prices = [
        {
          label: 'Скидка',
          from: numberFilter(discount, 1) + '%',
          value: vm.article.discountedPrice(vm.cartSubTotal),
          hide: discount ? 'show' : 'hide',
          ord: vm.cartSubTotal,
          animate: 'change-up',
          id: 1
        },
        {
          label: 'До',
          from: numberFilter(vm.minThreshold,0),
          value: vm.article.highPrice,
          ord: vm.minThreshold,
          id: 2
        },
        {
          label: 'От',
          from: numberFilter(vm.middleThreshold1,0),
          value: vm.article.discountedPrice(vm.middleThreshold1),
          ord: vm.middleThreshold1,
          id: 3
        },
        {
          label: 'От',
          from: numberFilter(vm.middleThreshold2,0),
          value: vm.article.discountedPrice(vm.middleThreshold2),
          ord: vm.middleThreshold2,
          id: 4
        },
        {
          label: 'От',
          from: numberFilter(vm.maxThreshold,0),
          value: vm.article.discountedPrice(vm.maxThreshold),
          ord: vm.maxThreshold,
          id: 5
        }
      ];

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
      middleThreshold1: Math.round(Article.maxThreshold()/4),
      middleThreshold2: Math.round(Article.maxThreshold()/2),
      maxThreshold: Article.maxThreshold(),

      showImageDialog: ImageHelper.mdDialogHelper(
        function (imsImg, id) {
          ArticleImage.create(
            angular.extend(imsImg, {
              articleId: id
            }));
        }),

      clearCart: function () {
        vm.article.inCart.count = 0;
        minusOne(vm.article);
      },

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
