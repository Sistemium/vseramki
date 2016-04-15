(function () {
  'use strict';

  angular
    .module('vseramki')
    .controller('ArticlesController', ArticlesController)
  ;

  /** @ngInject */
  function ArticlesController($scope,Article) {

    var vm = this;

    Article.bindAll({},$scope,'vm.articles');
    Article.findAll({
      limit: 50
    });

    var groupSize = 3;

    var repeater = {
      getLength: function () {
        console.log (vm.articles.length);
        return Math.floor(vm.articles.length / groupSize);
      },
      getItemAtIndex: function(index) {
        if (!vm.articles.length) {
          return;
        }
        return vm.articles[index * groupSize];
      }
    };

    vm.repeater = repeater;

  }

}());
