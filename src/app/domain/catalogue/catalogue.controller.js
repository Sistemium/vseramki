'use strict';

(function () {

  function CatalogueController($scope, $q, $state, Schema, util,
                               VSHelper, AuthHelper, TableHelper, ControllerHelper, ExportExcel) {

    const vm = ControllerHelper.setup(this, $scope, onStateChange)
      .use(TableHelper)
      .use(AuthHelper);

    const {
      Article,
      Baguette,
      Cart,
      // ArticleImage,
      FrameSize,
      Brand,
      Material,
      Colour,
      // BaguetteImage
    } = Schema.models();

    let chunkSize = 3;
    let lockArticlesScroll;

    _.assign(vm, {

      rootState: 'catalogue',
      rows: [],
      rowsFlex: 33,
      articleFilter: {},
      currentFilter: {},
      filterLength: false,
      selected: [],
      lockArticlesScroll: false,
      allArticles: [],

      plusOne,
      minusOne,
      addToCart: Cart.addToCart,
      gotoItemView: onClickWithPrevent(gotoItemView),

      onEnter,
      onBlur,
      onCartChange,
      filterOptionClick,
      resetFilters,
      delCurrFilter,
      addClick,
      sideNavListItemClick: sideNavListItemClick,

      fileDownloadClick: function () {
        const {articles} = vm;
        ExportExcel.exportArrayWithConfig(articles, Article.meta.exportConfig, 'Рамки');
      },

      fileUploadClick: () => $state.go('import', {model: 'Article'})

    });

    /*

     Init

     */

    Cart.findAll();

    Article.findAll({limit: 3000})
      .then(() => {
        return $q.all([
          Colour.findAll(),
          Material.findAll(),
          FrameSize.findAll(),
          Brand.findAll(),
          Baguette.findAll({limit: 3000}),
          // BaguetteImage.findAll(),
          // ArticleImage.findAll()
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

    function onEnter() {
      $state.go('^');
    }

    function onStateChange(toState, toParams) {

      vm.id && scrollToIndex();

      if (toParams.id) {

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

      const re = new RegExp(`${vm.rootState}\.([^.]+)`);
      const currentState = _.last($state.current.name.match(re));
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

      const articles = filterArticlesBySearch(vm.allArticles, vm.search);

      vm.brands = getVisibleBy(Brand, 'brandId');
      vm.colours = getVisibleBy(Colour, 'colourId');
      vm.materials = getVisibleBy(Material, 'materialId');
      vm.frameSizes = getVisibleBy(FrameSize, 'frameSizeId');

      vm.articles = filterArticlesByFilters(articles, vm.articleFilter);

      scrollToIndex();
      setChunks(chunkSize);

      function getVisibleBy(model, prop) {
        const propFilter = _.pickBy(vm.articleFilter, (val, key) => key !== prop);
        const propArticles = filterArticlesByFilters(articles, propFilter);
        return model.getAll(_.keys(_.keyBy(propArticles, prop)));
      }

    }

    function filterArticlesBySearch(articles, search) {

      if (!search) {
        return articles;
      }

      const pattern = `^${_.escapeRegExp(search)}${/РП/i.test(search)?'':'(РП|$)'}`;
      const startsWithRe = new RegExp(pattern, 'i');

      const byCode = _.filter(articles, ({code}) => startsWithRe.test(code));

      if (byCode.length) {
        return byCode;
      }

      const re = util.searchRe(search);

      return _.filter(articles, article => {

        const {name, code, isValid} = article;

        if (search === '/invalid') {
          return !isValid;
        }

        return !vm.search || search === code || re.test(name);

      });

    }

    function filterArticlesByFilters(articles, filters) {
      return _.filter(articles, article => {

        let res = true;

        _.each(filters, (value, code) => {
          if (article[code] !== value) {
            res = false;
            return false;
          }
        });

        return res;

      })
    }

    function scrollToIndex() {
      const id = vm.id;
      if (!lockArticlesScroll && id) {
        vm.articlesListTopIndex = _.findIndex(vm.articles, {'id': id});
      }
    }

    function rebind(filter) {
      if (vm.unbind) {
        vm.unbind();
      }
      vm.unbind = Article.bindAll(filter, $scope, 'vm.allArticles', onArticleListChange);
    }

    function recalcTotals() {
      Cart.recalcTotals(vm);
    }

    function plusOne(item) {
      const cart = item.inCart;
      cart.count = (cart.count || 0) + 1;
      Cart.save(cart);
    }

    function minusOne(item) {

      const cart = item.inCart;
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

      const f = filter || vm.articleFilter;

      rebind();

      vm.rows = _.chunk(vm.articles, chunkSize);
      vm.filterLength = !!Object.keys(f).length;

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

      const fieldName = field + 'Id';

      if (item) {
        vm.articleFilter[fieldName] = item.id;
      } else if (vm.articleFilter[fieldName]) {
        delete vm.articleFilter[fieldName];
      }

      vm.currentFilter [field] = item;
      filterArticles();

    }

    function sideNavListItemClick(frame) {
      let newState = $state.current.name;

      if (vm.currentState === 'create') {
        newState = '^.item';
      } else if ($state.params.id === frame.id && $state.current.name.match(/edit/)) {
        newState = '^'
      }

      lockArticlesScroll = true;
      $state.go(newState, {id: frame.id})
        .then(() => lockArticlesScroll = false);
    }

  }

  angular
    .module('vseramki')
    .controller('CatalogueController', CatalogueController);

}());
