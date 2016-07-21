(function () {
  'use strict';

  angular
    .module('vseramki')
    .controller('CatalogueController', CatalogueController)
  ;

  function CatalogueController($scope, Article, Cart, Schema, ArticleImage, $q) {

    var FrameSize = Schema.model('FrameSize');
    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');

    var vm = this;
    var groupSize = 3;

    Cart.findAll();
    Cart.bindAll({}, $scope, 'vm.cart');

    ArticleImage.findAll({limit: 1000})
      .then(function (data) {
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

      if (!cart.count) {
        Cart.destroy(cart);
      } else {
        Cart.save(cart);
      }
    }

    function onCartChange(article) {
      Cart.save(article.inCart);
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
      vm.filterLength = !!Object.keys(f).length;

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

      vm.articleFilter = {};
      vm.currentFilter = {};

    }

    function delCurrFilter(a) {

      _.unset(vm.currentFilter, a);
      _.unset(vm.articleFilter, a + 'Id');

      filterArticles(vm.articleFilter);

    }

    function filterOptionClick(item, field) {

      var fieldName = field + 'Id';

      if (item) {
        vm.articleFilter[fieldName] = item.id;
      } else if (vm.articleFilter[fieldName]) {
        delete vm.articleFilter[fieldName];
      }

      vm.currentFilter [field] = item;
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
      addToCart: Cart.addToCart

    });

    Article.findAll({limit: 1000})
      .then(function (data) {
        vm.articles = data;
        vm.currentPage = 1;
        vm.rows = _.chunk(data, groupSize);
        vm.ready = true;
        vm.total = Math.ceil(data.length / vm.pageSize);

        $q.all([
          Colour.findAll(),
          Material.findAll(),
          FrameSize.findAll(),
          Brand.findAll()
        ]).then(function () {
          filterArticles();
        });

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

    $scope.$watch('vm.groupSize', function (nv, ov) {

      if (nv || 0 !== ov || 0) {
        vm.rows = _.chunk(vm.articles, groupSize)
      }

    });

    $scope.$watch('vm.articleFilter', filterArticles);

    //$scope.$on ('vsRepeatInnerCollectionUpdated', function (e,a,b,c,d) {
    //  DEBUG (e.name, a,':', b, '-', c, ':', d);
    //});

    $scope.$on('$stateChangeSuccess', function (event, to) {
      vm.isRootState = /^catalogue$/.test(to.name);
    });

  }

}());
