'use strict';

(function () {

  angular.module('vseramki')
    .component('busyLinear', {

      bindings: {
        promise: '=',
        minTime: '=?'
      },

      /** @ngInject */
      controller: function ($q, $scope) {

        var vm = this;

        $scope.$watch('vm.promise', promise => {
          vm.busy = () => vm.busy = false;
          $q.when(promise)
            .then(vm.busy, vm.busy);
        })

      },

      template: '<md-progress-linear ng-if="vm.busy" md-diameter="vm.diameter" md-mode="indeterminate"></md-progress-linear>',
      controllerAs: 'vm'

    });

})();
