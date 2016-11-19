'use strict';

(function () {

  function stateBarButton() {
    return {

      restrict: 'ACE',
      templateUrl: 'app/components/stateBarButton/stateBarButton.html',

      scope: {
        icon: '@',
        title: '@',
        cls: '@class',
        disabledIf: '=?',
        iconXs: '=?'
      },

      controller: function ($scope) {

        var vm = this;

        _.assign(vm, {
          onClick: event => {
            $scope.$emit('stateBarButtonClick', event, $scope.icon, true);
          },
          iconXs: $scope.iconXs === true
        });

        vm.buttonCls = vm.iconXs && 'hide-gt-xs';

      },

      controllerAs: 'vm'

    };
  }

  angular.module('vseramki')
    .directive('stateBarButton', stateBarButton);

})();
