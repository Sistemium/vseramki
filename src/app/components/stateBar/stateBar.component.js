'use strict';

(function () {

  angular.module('vseramki')
    .component('stateBar', {

      transclude: true,

      bindings: {
        // showIf: '?='
        // TODO: remove deprecated title
        title: '@',
        barTitle: '@',
        rootState: '@',
        modeOptions: '=?'
      },

      /** @ngInject */
      controller: function ($state, $scope, AuthHelper) {

        var vm = this;

        _.assign(vm, {

          isAdmin: AuthHelper.isAdmin(),
          showIf: true,
          barTitle: vm.barTitle || vm.title,
          modeOptions: vm.rootState && vm.modeOptions !== false,
          changeView: to => $state.go(`${vm.rootState}.${to}`),
          addClick: () => $state.go(`${vm.rootState}.${vm.currentState}.create`)

        });

        $scope.$on('$destroy', $scope.$on('$stateChangeSuccess', (event, toState) => onStateChange(toState)));

        onStateChange($state.current);

        function onStateChange(toState) {

          var re = new RegExp(`${vm.rootState}\.([^.]+)`);

          vm.currentState = _.last($state.current.name.match(re));
          vm.isRootState = (new RegExp(`${vm.currentState}$`)).test(toState.name);

        }

      },

      templateUrl: 'app/components/stateBar/stateBar.html',
      controllerAs: 'vm'

    });

})();
