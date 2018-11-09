'use strict';

(function () {

  angular.module('vseramki')
    .component('propertyFilter', {

      templateUrl: 'app/components/propertyFilter/propertyFilter.html',

      bindings: {
        propertyName: '@',
        propertyLabel: '@',
        options: '=',
        currentOption: '=',
        setOptionFn: '&',
        clearFn: '&'
      },

      controllerAs: 'vm',

      controller: function () {

        const vm = this;

        _.assign(vm, {

          clearFilter: function () {
            vm.clearFn()(vm.propertyName);
          },

          optionClick: function (option) {
            vm.setOptionFn()(option, vm.propertyName);
          }

        });

      }

    });

})();
