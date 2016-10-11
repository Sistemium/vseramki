'use strict';

(function () {

  function ControllerHelper() {

    function setup(vm, $scope, callback) {

      var re = new RegExp(`${vm.rootState}\.([^\.]+)`);

      var subscription = $scope.$on('$stateChangeSuccess', function (event, toState, toParams) {

        vm.isRootState = /(table|tiles)$/.test(toState.name);
        vm.currentMode = _.last(toState.name.match(re));
        vm.currentState = _.first(toState.name.match(/[^.]+$/));

        if (_.isFunction(callback)) {
          callback(toState, toParams);
        }

      });

      $scope.$on('$destroy', subscription);

    }

    return {
      setup
    };

  }

  angular.module('vseramki')
    .service('ControllerHelper', ControllerHelper);

})();
