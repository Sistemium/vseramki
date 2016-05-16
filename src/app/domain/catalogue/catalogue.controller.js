(function () {
  'use strict';

  angular
    .module('vseramki')
    .controller('CatalogueController', CatalogueController)
  ;

  function CatalogueController($scope, Article, Cart, Schema) {

    var FrameSize = Schema.model('FrameSize');
    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');

    var vm = this;
    var groupSize = 3;

    vm.pattern = '\\d+';

    FrameSize.bindAll({}, $scope, 'vm.frameSizes');
    Brand.bindAll({}, $scope, 'vm.brands');
    Material.bindAll({}, $scope, 'vm.materials');


    Cart.findAll();
    Cart.bindAll({}, $scope, 'vm.cart');

    //function setPage(direction) {
    //
    //  var page = vm.currentPage + direction;
    //
    //  //Article.ejectAll();
    //
    //  vm.busy = true;
    //
    //  return Article.findAll(angular.extend({
    //      limit: vm.pageSize,
    //      offset: page * vm.pageSize
    //    }, vm.articleFilter || {}), {
    //      bypassCache: true
    //    })
    //    .then(function (data) {
    //
    //      vm.articles = data;
    //      vm.currentPage = page;
    //
    //      var rows = _.chunk(data, groupSize);
    //
    //      if (direction > 0 || !vm.rows.length) {
    //        Array.prototype.push.apply (vm.rows, rows);
    //      } else if (direction < 0) {
    //        vm.rows = Array.prototype.push.apply (rows, vm.rows);
    //      } else {
    //        vm.rows = rows;
    //      }
    //
    //    })
    //    .finally(function () {
    //      vm.busy = false;
    //    });
    //
    //}

    function nextPage() {
      //if (vm.busy) {
      //  return DEBUG('vb.busy')
      //}
      //DEBUG('nextPage', vm.currentPage);
      //setPage(1);
    }

    function prevPage() {
      //if (vm.busy) {
      //  return DEBUG('vb.busy')
      //}
      //DEBUG('prevPage', vm.currentPage);
      //setPage(-1);
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
      console.log(article);
      if (!article.inCart.count) {
        Cart.destroy(article.inCart);
      }
    }

    function filterArticles(filter) {

      var f = filter || vm.articleFilter;

      vm.articles = Article.filter(f);
      vm.rows = _.chunk(vm.articles, groupSize);

      function getVisibleBy (prop) {

        var propFilter = _.pickBy(f, function(val,key){
          return key !== prop;
        });
        var articles = Article.filter(propFilter);

        return _.map(
          _.groupBy(articles, prop),
          function (val, key) {
            return key;
          }
        );

      }

      vm.colours = Colour.getAll(getVisibleBy('colourId'));

    }


    function resetFilters() {
      vm.articleFilter = {};
      vm.currentFilter = {};
      vm.filterChosen = false;
    }


    function filterOptionClick(item, field) {
      vm.filterChosen = true;
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

      //setPage: function () {
      //  DEBUG('setPage', vm.currentPage);
      //  setPage(0);
      //},


      nextPage: nextPage,
      prevPage: prevPage,
      plusOne: plusOne,
      minusOne: minusOne,
      onCartChange: onCartChange,
      onBlur: onBlur,
      filterOptionClick: filterOptionClick,
      resetFilters: resetFilters,
      addToCart: Cart.addToCart


    });

    Article.findAll({limit: 1000})
      .then(function (data) {

        vm.articles = data;
        vm.currentPage = 1;

        vm.rows = _.chunk(data, groupSize);

        vm.ready = true;
        vm.total = Math.ceil(data.length / vm.pageSize);

      })
    ;

    Colour.findAll()
      .then(function(data){
        vm.colours = data;
      })
    ;

    //Article.getCount().then(function (res) {
    //  vm.ready = true;
    //  vm.total = Math.ceil(res / vm.pageSize);
    //});

    $scope.$watch ('windowHeight', function (windowHeight) {

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

    $scope.$watch ('windowWidth', function (windowWidth) {

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

    $scope.$watch ('vm.groupSize', function (nw, o) {

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
