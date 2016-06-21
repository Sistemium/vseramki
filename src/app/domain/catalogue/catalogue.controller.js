(function () {
  'use strict';

  angular
    .module('vseramki')
    .controller('CatalogueController', CatalogueController)
  ;

  function CatalogueController($scope, Article, Cart, Schema, ArticleImage) {

    var FrameSize = Schema.model('FrameSize');
    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');

    var vm = this;
    var groupSize = 3;

    Cart.findAll();
    Cart.bindAll({}, $scope, 'vm.cart');

    ArticleImage.findAll({limit: 1000})
      .then(function(data){
        vm.images = data;
      });

    function plusOne(item) {
      var cart = item.inCart;
      cart.count = (cart.count || 0) + 1;
      Cart.save(cart);
    }

    function minusOne(item) {

      var cart = item.inCart;

      cart.count--;

      console.log(cart.count);

      if (!cart.count) {
        Cart.destroy(cart);
      } else {
        Cart.save(cart);
      }
    }

    function onCartChange(article) {

      Cart.save(article.inCart);

    }

    function findPicture(){

      console.log(vm.articles);
      console.log(vm.cart);

    }


    function onBlur(article) {
      if (!article.inCart.count) {
        Cart.destroy(article.inCart);
      }
    }

    function filterArticles(filter) {

      var f = filter || vm.articleFilter;

      vm.articles = Article.filter(f);
      vm.rows = _.chunk(vm.articles, groupSize);

      function getVisibleBy(prop) {
        var propFilter = _.pickBy(f, function (val, key) {

          return key !== prop;
        });


        var articles = Article.filter(propFilter);

        if (!articles) {
          articles = {a: 'fail'}
        }

        return _.map(
          _.groupBy(articles, prop),
          function (val, key) {
            return key;
          }
        );

      }

      vm.colours = Colour.getAll(getVisibleBy('colourId'));
      vm.materials = Material.getAll(getVisibleBy('materialId'));
      vm.brands = Brand.getAll(getVisibleBy('brandId'));
      vm.frameSizes = FrameSize.getAll(getVisibleBy('frameSizeId'));

    }


    function resetFilters() {

      Colour.bindAll({}, $scope, 'vm.colours');
      Brand.bindAll({}, $scope, 'vm.brands');
      FrameSize.bindAll({}, $scope, 'vm.frameSizes');
      Material.bindAll({}, $scope, 'vm.materials');

      vm.articleFilter = {};
      vm.currentFilter = {};

      vm.filterLength = false;

    }

    function delCurrFilter(a) {

      Colour.bindAll({}, $scope, 'vm.colours');
      FrameSize.bindAll({}, $scope, 'vm.frameSizes');
      Brand.bindAll({}, $scope, 'vm.brands');
      Material.bindAll({}, $scope, 'vm.materials');

      _.unset(vm.currentFilter, a);
      _.unset(vm.articleFilter, a + 'Id');

      filterArticles(vm.articleFilter);

      if (Object.keys(vm.currentFilter).length) {
        vm.filterLength = true;
      } else {
        vm.filterLength = false;
      }

    }

    function filterOptionClick(item, field) {

      var fieldName = field + 'Id';


      if (item) {
        vm.articleFilter[fieldName] = item.id;
      } else if (vm.articleFilter[fieldName]) {
        delete vm.articleFilter[fieldName];
      }


      vm.currentFilter [field] = item;

      if (Object.keys(vm.currentFilter).length) {
        vm.filterLength = true;
      }


      filterArticles();

    }

    angular.extend(vm, {

      currentPage: 1,
      pages: 9,
      pageSize: 36,
      rows: [],
      rowsFlex: 33,
      articleFilter: {},
      currentFilter: {},
      filterLength: false,
      price: 33,

      //setPage: function () {
      //  DEBUG('setPage', vm.currentPage);
      //  setPage(0);
      //},

      plusOne: plusOne,
      minusOne: minusOne,
      onCartChange: onCartChange,
      onBlur: onBlur,
      filterOptionClick: filterOptionClick,
      resetFilters: resetFilters,
      delCurrFilter: delCurrFilter,
      findPicture: findPicture,
      addToCart: Cart.addToCart


    });

    Article.findAll({limit: 1000})
      .then(function (data) {
        vm.articles = data;
        vm.currentPage = 1;
        vm.rows = _.chunk(data, groupSize);
        vm.ready = true;
        vm.total = Math.ceil(data.length / vm.pageSize);

        Colour.findAll()
          .then(function (data) {
            vm.colours = data;
          });

        Material.findAll()
          .then(function (data) {
            vm.materials = data;
          });

        FrameSize.findAll()
          .then(function (data) {
            vm.frameSizes = data;
          });

        Brand.findAll()
          .then(function (data) {
            vm.brands = data;
          });

        findPicture();

      });


    //Article.getCount().then(function (res) {
    //  vm.ready = true;
    //  vm.total = Math.ceil(res / vm.pageSize);
    //});

    $scope.$watch('windowHeight', function (windowHeight) {

      if (windowHeight > 710) {
        vm.pages = 9;
      } else if (windowHeight > 620) {
        vm.pages = 7;
      } else if (windowHeight > 530) {
        vm.pages = 5;
      } else if (windowHeight > 420) {
        vm.pages = 3;
      } else if (windowHeight > 380) {
        vm.pages = 2;
      } else {
        vm.pages = 1;
      }

    });

    $scope.$watch('windowWidth', function (windowWidth) {

      if (windowWidth > 1150) {
        groupSize = 4;
        vm.rowsFlex = 20
      } else if (windowWidth > 950) {
        groupSize = 3;
        vm.rowsFlex = 25
      } else if (windowWidth > 730) {
        groupSize = 2;
        vm.rowsFlex = 33
      } else if (windowWidth > 550) {
        groupSize = 1;
        vm.rowsFlex = 50
      } else {
        groupSize = 1;
        vm.rowsFlex = 100
      }

      vm.groupSize = groupSize;

    });

    $scope.$watch('vm.groupSize', function (nw, o) {

      if (nw || 0 !== o || 0) {
        vm.rows = _.chunk(vm.articles, groupSize)
      }

    });

    $scope.$watch('vm.articleFilter', filterArticles);

    //$scope.$on ('vsRepeatInnerCollectionUpdated', function (e,a,b,c,d) {
    //  DEBUG (e.name, a,':', b, '-', c, ':', d);
    //});

  }

}());
