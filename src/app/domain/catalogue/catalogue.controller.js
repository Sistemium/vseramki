'use strict';

(function () {

  function CatalogueController($scope, Article, Cart, Schema, ArticleImage, $q, $state, Baguette, VSHelper, AuthHelper, TableHelper) {

    var vm = this;

    var FrameSize = Schema.model('FrameSize');
    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');
    var BaguetteImage = Schema.model('BaguetteImage');

    var chunkSize = 3;

    angular.extend(vm, {

      rootState: 'catalogue',
      rows: [],
      rowsFlex: 33,
      articleFilter: {},
      currentFilter: {},
      filterLength: false,
      selected: [],

      pagination: TableHelper.pagination($scope),
      isAdmin: AuthHelper.isAdmin(),
      onPaginate: TableHelper.setPagination,

      plusOne,
      minusOne,
      addToCart: Cart.addToCart,
      gotoItemView: onClickWithPrevent(gotoItemView),

      onBlur,
      onCartChange,
      filterOptionClick,
      resetFilters,
      delCurrFilter,

      changeView: to => $state.go(to),
      goToCreateFrame,

      changeFrame: function (frame) {
        var newState = vm.currentState === 'create' ? '^.item' : $state.current.name;
        $state.go(newState, {id: frame.id});
      }

    });

    /*

     Init

     */


    Cart.findAll();

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

    Article.findAll({limit: 1000})
      .then(() => {

        return $q.all([
          Colour.findAll(),
          Material.findAll(),
          FrameSize.findAll(),
          Brand.findAll()
        ]);

      })
      .then(() => {
        recalcTotals();
        vm.ready = true;
        filterArticles();
      });


    /*

     Listeners

     */

    VSHelper.watchForGroupSize($scope, 300, 270, setChunks);

    $scope.$watch('vm.articleFilter', filterArticles);

    $scope.$watch('vm.search', () => {
      filterArticles();
    });

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams) {
      vm.currentState = _.first($state.current.name.match(/[^\.]*$/));
      vm.disableAddFrame = toState.url === '/add';
      vm.isRootState = /^catalogue.(table|tiles)$/.test(toState.name);
      vm.currentItemId = toParams.id;
    });


    /*

     Functions

     */

    function goToCreateFrame (parent) {

      var re = new RegExp(`${vm.rootState}\.([^.]+)`);
      var currentState = parent || _.last($state.current.name.match(re));
      $state.go(`${vm.rootState}.${currentState}.create`);

    }

    function onClickWithPrevent(fn) {
      return function (item, event) {
        if (_.get(event, 'defaultPrevented')) {
          return;
        }
        fn(item);
      }
    }

    function gotoItemView(article) {
      $state.go($state.current.name + '.item', {id: article.id});
    }

    function setChunks(nv) {
      chunkSize = nv;
      vm.rowsFlex = nv > 1 ? Math.round(100 / (chunkSize + 1)) : 100;
      vm.rows = _.chunk(vm.articles, nv);
    }

    function rebind(filter) {
      if (vm.unbind) {
        vm.unbind();
      }
      vm.unbind = Article.bindAll(filter, $scope, 'vm.articles', () => setChunks(chunkSize));
    }

    function recalcTotals() {
      Cart.recalcTotals(vm);
    }

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

    function makeJsFilter(filter) {

      var f = filter || vm.articleFilter;
      var jsFilter = f ? {
        where: _.mapValues(f, v => ({'==': v}))
      } : {};

      if (vm.search) {
        _.set(jsFilter, 'where.name', {
          'likei': `%${vm.search}%`
        });
      }
      return jsFilter;

    }

    function filterArticles(filter) {

      var f = filter || vm.articleFilter;
      var jsFilter = makeJsFilter(f);

      rebind(jsFilter);

      vm.rows = _.chunk(vm.articles, chunkSize);
      vm.filterLength = !!Object.keys(f).length;

      function getVisibleBy(prop) {

        var propFilter = makeJsFilter(_.pickBy(f, function (val, key) {
          return key !== prop;
        }));

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
      vm.search = '';
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

  }

  angular
    .module('vseramki')
    .controller('CatalogueController', CatalogueController);

}());
