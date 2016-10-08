'use strict';

(function () {

  function ItemController($filter, $scope, $state, Schema, ToastHelper, ImageHelper, AuthHelper, AlertHelper) {

    var vm = this;

    var {
      Article,
      ArticleImage,
      Cart,
      BaguetteImage
    } = Schema.models();

    var numberFilter = $filter('number');

    var stateFilter = {
      articleId: $state.params.id
    };

    _.assign(vm, {

      uploading: true,
      imageClick,
      deletePhoto,
      minusOne,
      plusOne,
      onBlur,
      onCartChange,
      onThumbnailClick,

      currentImageHover: {},
      addToCart: Cart.addToCart,
      article: '',
      isRootState: true,
      isAdmin: AuthHelper.isAdmin(),

      minThreshold: Article.minThreshold(),
      middleThreshold1: Math.round(Article.maxThreshold() / 4),
      middleThreshold2: Math.round(Article.maxThreshold() / 2),
      maxThreshold: Article.maxThreshold(),

      showImageDialog: ImageHelper.mdDialogHelper(
        imsImg => ArticleImage.create(_.assign(imsImg, {articleId: vm.article.id}))
      ),

      clearCart: function () {
        vm.article.inCart.count = 0;
        minusOne(vm.article);
      },

      editFrame: () => $state.go($state.current.name + '.edit', {id: vm.article.id}),
      addFrame: () => $state.go('catalogue.' + $state.current.name.split('.')[1] + '.create'),
      deleteFrame,

      previewClick: () => $scope.$broadcast('openGallery', {index: vm.images.indexOf(vm.currentImage) || 0})

    }, stateFilter);


    /*

     Init

     */

    Article.findAll({limit: 1000})
      .then(function (data) {
        vm.allArt = data;
      });


    Article.find($state.params.id)
      .then(article => {

        vm.article = article;

        if (vm.article) {

          setPrices();

          var baguetteImageFilter = {
            baguetteId: vm.article.baguetteId
          };

          ArticleImage.bindAll(stateFilter, $scope, 'vm.articleImages', mergeImages);
          BaguetteImage.bindAll(baguetteImageFilter, $scope, 'vm.baguetteImages', mergeImages);

          ArticleImage.findAll(stateFilter);
          BaguetteImage.findAll(baguetteImageFilter);

        }

      });

    /*

     Listeners

     */


    $scope.$on('$stateChangeSuccess', function (event, to) {
      vm.isRootState = /(^|\.)item$/.test(to.name);
    });

    Cart.bindAll({}, $scope, 'vm.cart', recalcTotals);

    /*

    Functions

     */

    function recalcTotals() {
      Cart.recalcTotals(vm);
      if (vm.article) {
        setPrices();
      }
    }

    function deleteFrame($event) {

      var frameId = vm.article.id;

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

    function mergeImages() {
      vm.images = _.union(vm.baguetteImages, vm.articleImages);
      if (vm.images.length) {
        onThumbnailClick(0,_.first(vm.images));
      }
    }

    function imageClick(item) {
      vm.clickedImage = item;
    }

    function deletePhoto(photo) {
      ArticleImage.destroy(photo);
    }

    function setPrices() {

      var discount = 100 - 100 * vm.article.discountedPrice(vm.cartSubTotal) / vm.article.highPrice;

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
          from: numberFilter(vm.minThreshold, 0),
          value: vm.article.highPrice,
          ord: vm.minThreshold,
          id: 2
        },
        {
          label: 'От',
          from: numberFilter(vm.middleThreshold1, 0),
          value: vm.article.discountedPrice(vm.middleThreshold1),
          ord: vm.middleThreshold1,
          id: 3
        },
        {
          label: 'От',
          from: numberFilter(vm.middleThreshold2, 0),
          value: vm.article.discountedPrice(vm.middleThreshold2),
          ord: vm.middleThreshold2,
          id: 4
        },
        {
          label: 'От',
          from: numberFilter(vm.maxThreshold, 0),
          value: vm.article.discountedPrice(vm.maxThreshold),
          ord: vm.maxThreshold,
          id: 5
        }
      ];

    }

    function onThumbnailClick(i, newImg) {

      var newId = _.get(newImg, 'id');

      if (newId !== vm.currentImageLoading && newId !== _.get(vm.currentImage, 'id')) {

        vm.currentImageLoading = newId;

        ImageHelper.loadImage(newImg.smallSrc)
          .then(() => vm.currentImageLoading === newImg.id && (vm.currentImage = newImg))
          .finally(() => vm.currentImageLoading === newImg.id && (vm.currentImageLoading = false));

      }

    }

  }

  angular
    .module('vseramki')
    .controller('ItemController', ItemController);


}());
