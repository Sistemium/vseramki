'use strict';

(function () {

  angular.module('vseramki')
    .component('stateBar', {

      bindings: {
        // showIf: '?='
        title: '@',
        rootState: '@'
      },

      /** @ngInject */
      controller: function ($state, $scope) {

        var vm = this;

        _.assign(vm, {

          showIf: true,
          changeView: to => $state.go(`${vm.rootState}.${to}`),
          addClick: () => $state.go(`${vm.rootState}.${vm.currentState}.create`),

        });

        $scope.$on('$destroy', $scope.$on('$stateChangeSuccess', (event, toState) => onStateChange(toState)));

        onStateChange($state.current);

        function onStateChange(toState) {

          var re = new RegExp(`${vm.rootState}\.([^.]+)`);

          vm.currentState = _.last($state.current.name.match(re));
          vm.isRoot = (new RegExp(`${vm.currentState}$`)).test(toState.name);

        }

      },

      templateUrl: 'app/components/stateBar/stateBar.html',
      controllerAs: 'vm'

    });

})();
