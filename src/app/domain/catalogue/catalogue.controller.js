'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('CatalogueController', CatalogueController)
  ;

  function CatalogueController($scope, Article, Cart, Schema, ArticleImage, $q, $state, Baguette, VSHelper, AuthHelper, TableHelper) {

    var vm = this;

    var FrameSize = Schema.model('FrameSize');
    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');
    var BaguetteImage = Schema.model('BaguetteImage');

    var groupSize = 3;

    angular.extend(vm, {

      rows: [],
      rowsFlex: 33,
      articleFilter: {},
      currentFilter: {},
      filterLength: false,
      selected: [],

      pagination: TableHelper.pagination(),
      isAdmin: AuthHelper.isAdmin(),

      plusOne,
      minusOne,
      onCartChange,
      onBlur,
      filterOptionClick,
      resetFilters,
      delCurrFilter,
      addToCart: Cart.addToCart,

      goToCreateFrame: function () {
        $state.go('catalogue.add');
      },

      changeFrame: function (frame) {
        var newState = vm.currentState === 'add' ? '^.item' : $state.current.name;
        $state.go(newState, {id: frame.id});
      },

      gotoItemView: function (article) {
        $state.go($state.current.name + '.item', {id: article.id});
      },

      changeView: function (goTo) {
        $state.go(goTo);
      }

    });

    Cart.findAll();

    function recalcTotals() {
      Cart.recalcTotals(vm);
    }

    Cart.bindAll({}, $scope, 'vm.cart', recalcTotals);

    Baguette.findAll().then(function (data) {
      vm.baguette = data;
    });

    BaguetteImage.findAll().then(function (data) {
      vm.baguetteImage = data;
    });

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



    Article.findAll({limit: 10})
      .then(function (data) {
        vm.articles = data;
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

    Article.bindAll({}, $scope, 'vm.articles', () => VSHelper.watchForGroupSize($scope, 345, 270, function (nv) {
      groupSize = nv;
      vm.rowsFlex = nv > 1 ? Math.round(100 / (groupSize + 1)) : 100;
      vm.rows = _.chunk(vm.articles, nv);
    }));

    VSHelper.watchForGroupSize($scope, 345, 270, function (nv) {
      groupSize = nv;
      vm.rowsFlex = nv > 1 ? Math.round(100 / (groupSize + 1)) : 100;
      vm.rows = _.chunk(vm.articles, nv);
    });

    $scope.$watch('vm.articleFilter', filterArticles);

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams) {
      vm.currentState = _.first($state.current.name.match(/[^\.]*$/));
      vm.disableAddFrame = toState.url === '/add';
      vm.isRootState = /^catalogue.(table|tiles)$/.test(toState.name);
      vm.currentItemId = toParams.id;
    });

  }

}());
