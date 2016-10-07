'use strict';

(function () {

  angular.module('vseramki')
    .component('error', {

      templateUrl: 'app/components/error/error.html',

      bindings: {
        errorText: '='
      },

      controllerAs: 'vm',

      controller: function () {

        var vm = this;

        vm.close = function () {
          vm.hidden = true;
        };

        console.error(vm.errorText || 'No error');

      }

    });

})();
