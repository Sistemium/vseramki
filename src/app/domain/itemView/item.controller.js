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
                          $window
  ) {

    var Colour = Schema.model('Colour');
    var Material = Schema.model('Material');
    var FrameSize = Schema.model('FrameSize');



    var vm = this;

    vm.testImg = [
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'https://s3-eu-west-1.amazonaws.com/sisdev/Article/9d73f7ae9eeca99f60c914a92701d703/largeImage.png'},
      { img:'http://cs4.pikabu.ru/post_img/2016/06/20/7/146642042213246053.jpg'},
      { img:'http://cs4.pikabu.ru/post_img/2016/06/20/7/146642042213246053.jpg'},
      { img:'http://cs4.pikabu.ru/post_img/2016/06/20/7/146642042213246053.jpg'},
      { img:'http://cs4.pikabu.ru/post_img/2016/06/20/7/146642042213246053.jpg'},
      { img:'http://cs4.pikabu.ru/post_img/2016/06/20/7/146642042213246053.jpg'},
      { img:'http://cs4.pikabu.ru/post_img/2016/06/20/7/146642042213246053.jpg'},
      { img:'http://cs4.pikabu.ru/post_img/2016/06/20/7/146642042213246053.jpg'},
      { img:'http://cs4.pikabu.ru/post_img/2016/06/20/7/146642042213246053.jpg'},
      { img:'http://cs4.pikabu.ru/post_img/2016/06/20/7/146642042213246053.jpg'},
      { img:'http://cs4.pikabu.ru/post_img/2016/06/20/7/146642042213246053.jpg'},
      { img:'http://cs4.pikabu.ru/post_img/2016/06/20/7/146642042213246053.jpg'},
      { img:'http://photo.withqiuliang.com/_images/equipment/dslr/nikon/nikon_d7200/sample_images/High_res/Nikon-D7200-Sample-Images-1.jpg'}

    ];

    var body2 = $window.document.getElementsByClassName('for-md-dialog');

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

        }, function () {
          console.log('You cancelled the dialog.');
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
      console.log(vm.colour);
    }


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

        ArticleImage.findAll(stateFilter);

        ArticleImage.bindAll(stateFilter, $scope, 'vm.articleImages');

      }

    });


    function imageClick(item) {
      vm.clickedImage = item;
    }

    function deletePhoto(photo) {

      ArticleImage.destroy(photo).then(function (a) {
        console.log(a, 'deleted.');
      });

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
      price: 33,
      article: '',
      isEditable: true
    }, stateFilter);

    //Article.find(vm.articleId).then(function(article){
    //  vm.article = article;
    //});

    //ArticleImage.findAll(stateFilter);

    //ArticleImage.bindAll(stateFilter,$scope,'vm.articleImages');


  }

}());
