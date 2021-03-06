'use strict';

(function () {

  function ItemController($filter, $scope, $state, Schema, Helpers, $uiViewScroll, $timeout, $mdMedia) {

    const {ToastHelper, ImageHelper, AuthHelper, AlertHelper} = Helpers;

    const vm = Helpers.ControllerHelper.setup(this, $scope);

    const {
      Article,
      ArticleImage,
      Cart,
      // BaguetteImage
    } = Schema.models();

    const numberFilter = $filter('number');

    const stateFilter = {
      articleId: $state.params.id
    };

    _.assign(vm, {

      uploading: true,
      imageClick,
      minusOne,
      plusOne,
      onBlur,
      onCartChange,
      onThumbnailClick,

      currentImageHover: {},
      addToCart: () => {
        Cart.addToCart(vm.article);
        $mdMedia('gt-sm') || $timeout(() => {
          $uiViewScroll(angular.element(document.getElementById('cartCountInput')));
        });
      },
      article: '',
      isRootState: true,
      isAdmin: AuthHelper.isAdmin(),

      minThreshold: Article.minThreshold(),
      middleThreshold1: Math.round(Article.maxThreshold() / 4),
      middleThreshold2: Math.round(Article.maxThreshold() / 2),
      maxThreshold: Article.maxThreshold(),

      addAPhotoClick: ImageHelper.mdDialogHelper(
        imsImg => ArticleImage.create(_.assign(imsImg, {articleId: vm.article.id}))
      ),

      clearCart: function () {
        vm.article.inCart.count = 0;
        minusOne(vm.article);
      },

      editClick: () => $state.go($state.current.name + '.edit', {id: vm.article.id}),
      // addFrame: () => $state.go('catalogue.' + $state.current.name.split('.')[1] + '.create'),
      deleteClick,

      previewClick: () => {
        vm.images.length && $scope.$broadcast('openGallery', {index: vm.images.indexOf(vm.currentImage) || 0})
      },

      visibilityClick: () => {
        setIsValid(false);
      },

      visibilityOffClick: () => {
        setIsValid(true);
      }

    }, stateFilter);


    /*

     Init

     */

    Article.findAll({limit: 3000})
      .then(function (data) {
        vm.allArt = data;
      });

    Article.bindOne(stateFilter.articleId, $scope, 'vm.article', () => {

      // vm.article = article;

      if (vm.article) {

        setPrices();

        vm.images = vm.article.pictureImages();

        setPreviewImage(_.first(vm.images));

      }

    });

    Article.find(stateFilter.articleId);

    /*

     Listeners

     */

    Cart.bindAll({}, $scope, 'vm.cart', recalcTotals);

    /*

     Functions

     */


    function setIsValid(to) {
      vm.article.isValid = to;
    }

    function recalcTotals() {
      Cart.recalcTotals(vm);
      if (vm.article) {
        setPrices();
      }
    }

    function deleteClick($event) {

      const frameId = vm.article.id;

      const promise = AlertHelper.showConfirm($event);

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

      const cart = item.inCart;

      cart.count--;

      if (cart.count <= 0) {
        Cart.destroy(cart);
      } else {
        onCartChange(cart);
      }

    }

    function plusOne(item) {
      const cart = item.inCart;
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

    function imageClick(item) {
      vm.clickedImage = item;
    }

    function setPrices() {

      if (!vm.article.highPrice || !vm.article.lowPrice) {
        vm.prices = false;
        return;
      }

      const discount = 100 - 100 * vm.article.discountedPrice(vm.cartSubTotal) / vm.article.highPrice;

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

    function setPreviewImage(newImg) {
      const newId = _.get(newImg, 'id');

      if (newId === vm.currentImageLoading) {
        return;
      }

      if (newId !== vm.currentImageLoading && newId !== _.get(vm.currentImage, 'id')) {

        vm.currentImageLoading = newId;

        ImageHelper.loadImage(newImg.smallSrc)
          .then(() => vm.currentImageLoading === newImg.id && (vm.currentImage = newImg))
          .finally(() => vm.currentImageLoading === newImg.id && (vm.currentImageLoading = false));

      } else {
        vm.currentImageLoading = vm.currentImage = false;
      }
    }

    function onThumbnailClick(i, newImg) {

      const newId = _.get(newImg, 'id');

      if (!vm.currentImageLoading && newId === _.get(vm, 'currentImage.id')) {
        return $scope.$broadcast('openGallery', {index: i});
      } else {
        setPreviewImage(newImg);
      }

    }

  }

  angular
    .module('vseramki')
    .controller('ItemController', ItemController);


}());
