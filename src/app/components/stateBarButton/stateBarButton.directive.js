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
        disabledIf: '=?'
      },

      controller: function ($scope) {

        var vm = this;

        _.assign(vm, {
          onClick: event => {
            $scope.$emit('stateBarButtonClick', event, true);
          }
        });

      },

      controllerAs: 'vm'

    };
  }

  angular.module('vseramki')
    .directive('stateBarButton', stateBarButton);

})();
