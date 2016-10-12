'use strict';

(function () {

  function ControllerHelper() {

    function setup(vm, $scope, callback) {

      var re = new RegExp(`${vm.rootState}\.([^\.]+)`);

      var stateChangeSuccessSubscription = $scope.$on('$stateChangeSuccess', (event, toState, toParams) => {

        vm.isRootState = /(table|tiles)$/.test(toState.name);
        vm.currentMode = _.last(toState.name.match(re));
        vm.currentState = _.first(toState.name.match(/[^.]+$/));

        if (_.isFunction(callback)) {
          callback(toState, toParams);
        }

      });

      var stateBarButtonClickSubscription = $scope.$on('stateBarButtonClick', (scopeEvent, domEvent) => {
        var fn = _.get(vm, `${_.camelCase(domEvent.target.textContent)}Click`);
        _.isFunction(fn) && fn(domEvent);
      });

      $scope.$on('$destroy', () => {
        stateChangeSuccessSubscription();
        stateBarButtonClickSubscription();
      });

      return _.assign(vm,{
        stateBarButtonClick: event => $scope.$broadcast('stateBarButtonClick', event)
      });

    }

    return {
      setup
    };

  }

  angular.module('vseramki')
    .service('ControllerHelper', ControllerHelper);

})();
