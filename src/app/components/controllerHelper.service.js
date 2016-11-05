'use strict';

(function () {

  function ControllerHelper() {

    return {
      setup
    };

    function use(helper) {

      var me = this;

      if (!helper) return me;

      if (_.isFunction(helper.setup)) {
        helper.setup(me);
        return me;
      }

      return _.assign(me, helper);

    }

    function setup(vm, $scope, callback) {

      var re = new RegExp(`${vm.rootState}\.([^\.]+)`);

      var stateChangeSuccessSubscription = $scope.$on('$stateChangeSuccess', (event, toState, toParams) => {

        _.assign(vm, {
          isRootState: /(table|tiles)$/.test(toState.name) || toState.name === vm.rootState,
          currentMode: _.last(toState.name.match(re)),
          currentState: _.first(toState.name.match(/[^.]+$/)),
          id: toParams.id
        });

        if (_.isFunction(callback)) {
          callback(toState, toParams);
        }

      });

      var stateBarButtonClickSubscription = $scope.$on('stateBarButtonClick', (scopeEvent, domEvent, isFromChild) => {
        if (isFromChild) {
          $scope.$broadcast('stateBarButtonClick', domEvent);
        } else {
          var fn = _.get(vm, `${_.camelCase(domEvent.target.textContent)}Click`);
          _.isFunction(fn) && fn(domEvent);
        }
      });

      $scope.$on('$destroy', () => {
        stateChangeSuccessSubscription();
        stateBarButtonClickSubscription();
      });

      return _.assign(vm,{
        //stateBarButtonClick: event => $scope.$broadcast('stateBarButtonClick', event)
        use
      });

    }

  }

  angular.module('vseramki')
    .service('ControllerHelper', ControllerHelper);

})();
