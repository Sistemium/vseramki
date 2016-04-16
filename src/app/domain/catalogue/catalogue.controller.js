(function () {
  'use strict';

  angular
    .module('vseramki')
    .controller('CatalogueController', CatalogueController)
  ;

  /** @ngInject */
  function CatalogueController($scope, Article) {

    var vm = this;

    function setPage() {

      var page = vm.currentPage;

      //Article.ejectAll();

      Article.findAll({
          limit: vm.pageSize,
          offset: page * vm.pageSize
        }, {
          bypassCache: true
        })
        .then(function (data) {
          vm.articles = data;
        });

    }

    var groupSize = 3;

    var repeater = {
      getLength: function () {
        console.log(vm.articles.length);
        return Math.floor(vm.articles.length / groupSize);
      },
      getItemAtIndex: function (index) {
        if (!vm.articles.length) {
          return;
        }
        return vm.articles[index * groupSize];
      }
    };

    angular.extend(vm, {

      repeater: repeater,
      currentPage: 1,
      pages: 9,
      pageSize: 25,

      setPage: setPage
    });

    Article.getCount().then(function (res) {
      vm.ready = true;
      vm.total = Math.ceil(res / vm.pages);
    });

  }

}());
