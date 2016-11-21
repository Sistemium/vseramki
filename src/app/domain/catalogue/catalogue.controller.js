'use strict';

(function () {

  function CatalogueController($scope, $q, $state, Schema, VSHelper, AuthHelper, TableHelper, ControllerHelper, ExportExcel) {

    var vm = ControllerHelper.setup(this, $scope, onStateChange)
      .use(TableHelper)
      .use(AuthHelper);

    var {
      Article,
      Baguette,
      Cart,
      ArticleImage,
      FrameSize,
      Brand,
      Material,
      Colour,
      BaguetteImage
    } = Schema.models();

    var chunkSize = 3;
    var lockArticlesScroll;

    _.assign(vm, {

      rootState: 'catalogue',
      rows: [],
      rowsFlex: 33,
      articleFilter: {},
      currentFilter: {},
      filterLength: false,
      selected: [],
      lockArticlesScroll: false,

      plusOne,
      minusOne,
      addToCart: Cart.addToCart,
      gotoItemView: onClickWithPrevent(gotoItemView),

      onBlur,
      onCartChange,
      filterOptionClick,
      resetFilters,
      delCurrFilter,
      addClick,
      sideNavListItemClick: sideNavListItemClick,

      fileDownloadClick: function () {
        var articles = vm.articles;
        ExportExcel.exportArrayWithConfig(articles, Article.meta.exportConfig, 'Рамки');
      },

      fileUploadClick: () => $state.go('import', {model: 'Article'})

    });

    /*

     Init

     */

    Cart.findAll();

    Article.findAll({limit: 1000})
      .then(() => {

        return $q.all([
          Colour.findAll(),
          Material.findAll(),
          FrameSize.findAll(),
          Brand.findAll(),
          Baguette.findAll(),
          BaguetteImage.findAll(),
          ArticleImage.findAll()
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

    Cart.bindAll({}, $scope, 'vm.cart', recalcTotals);
    // Baguette.bindAll({}, $scope, 'vm.baguette');
    // BaguetteImage.bindAll({}, $scope, 'vm.baguetteImage');
    // ArticleImage.bindAll({}, $scope, 'vm.images');


    $scope.$watch('vm.search', () => {
      filterArticles();
    });

    $scope.$watch(() => Article.lastModified(), () => filterArticles());

    /*

     Functions

     */

    function onStateChange(toState, toParams) {

      vm.id && scrollToIndex();

      if (/\.edit$/.test(toState.name)) {

        return Article.find(toParams.id).then(function (item) {
          vm.currentItem = item;
          //scrollToIndex();
          //lockArticlesScroll = false;
        });
      } else {
        vm.currentItem = false;
      }

    }

    function addClick() {

      var re = new RegExp(`${vm.rootState}\.([^.]+)`);
      var currentState = _.last($state.current.name.match(re));
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

    function onArticleListChange() {
      scrollToIndex();
      setChunks(chunkSize);
    }

    function scrollToIndex() {
      var id = vm.id;
      if (!lockArticlesScroll && id) {
        vm.articlesListTopIndex = _.findIndex(vm.articles, {'id': id});
      }
    }

    function rebind(filter) {
      if (vm.unbind) {
        vm.unbind();
      }
      vm.unbind = Article.bindAll(filter, $scope, 'vm.articles', onArticleListChange);
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
        if (vm.search == 'invalid') {
          _.set(jsFilter, 'where.isValid', {
            'likei': 'false'
          });
        } else {
          _.set(jsFilter, 'where.name', {
            'likei': `%${vm.search}%`
          });
        }
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

    function sideNavListItemClick(frame) {
      var newState = $state.current.name;

      if (vm.currentState === 'create') {
        newState = '^.item';
      } else if ($state.params.id === frame.id && $state.current.name.match(/edit/)) {
        newState = '^'
      }

      lockArticlesScroll = true;
      $state.go(newState, {id: frame.id})
        .then(()=> lockArticlesScroll = false);
    }

  }

  angular
    .module('vseramki')
    .controller('CatalogueController', CatalogueController);

}());
