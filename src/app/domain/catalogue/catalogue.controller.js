(function () {
  'use strict';

  angular
    .module('vseramki')
    .controller('CatalogueController', CatalogueController)
  ;

  function CatalogueController($scope, Article, DEBUG) {

    var vm = this;
    var groupSize = 3;

    function setPage (direction) {

      var page = vm.currentPage + direction;

      //Article.ejectAll();

      vm.busy = true;

      return Article.findAll({
          limit: vm.pageSize,
          offset: page * vm.pageSize
        }, {
          bypassCache: true
        })
        .then(function (data) {

          vm.articles = data;
          vm.currentPage = page;

          var rows = _.chunk(data, groupSize);

          if (direction>0 || !vm.rows.length) {
            Array.prototype.push.apply (vm.rows, rows);
          } else if (direction<0) {
            vm.rows = Array.prototype.push.apply (rows, vm.rows);
          }/* else {
            vm.rows = rows;
          }*/

        })
        .finally(function(){
          vm.busy = false;
        });

    }

    function nextPage () {
      if (vm.busy) {
        return DEBUG ('vb.busy')
      }
      DEBUG ('nextPage',vm.currentPage);
      setPage(1);
    }

    function prevPage () {
      if (vm.busy) {
        return DEBUG ('vb.busy')
      }
      DEBUG ('prevPage',vm.currentPage);
      setPage(-1);
    }

    angular.extend(vm, {

      currentPage: 1,
      pages: 9,
      pageSize: 36,
      rows: [],
      rowsFlex: 33,

      setPage: function () {
        DEBUG('setPage', vm.currentPage);
        setPage (0);
      },
      nextPage: nextPage,
      prevPage: prevPage

    });

    Article.getCount().then(function (res) {
      vm.ready = true;
      vm.total = Math.ceil(res / vm.pageSize);
    });

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
        groupSize = 5;
        vm.rowsFlex = 20
      } else if (windowWidth > 950) {
        groupSize = 4;
        vm.rowsFlex = 25
      } else if (windowWidth > 730) {
        groupSize = 3;
        vm.rowsFlex = 33
      } else if (windowWidth > 550) {
        groupSize = 2;
        vm.rowsFlex = 50
      } else {
        groupSize = 1;
        vm.rowsFlex = 100
      }

      vm.groupSize = groupSize;

    });

    $scope.$watch ('vm.groupSize', function (nw,o) {

      if (nw||0!==o||0) {
        vm.rows = _.chunk(vm.articles, groupSize)
      }

    });

     //$scope.$on ('vsRepeatInnerCollectionUpdated', function (e,a,b,c,d) {
     //  DEBUG (e.name, a,':', b, '-', c, ':', d);
     //});

  }

}());
