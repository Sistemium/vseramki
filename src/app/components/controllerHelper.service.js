'use strict';

(function () {

  function ControllerHelper($q) {

    return {
      setup
    };

    function use(helper) {

      const me = this;

      if (!helper) return me;

      if (_.isFunction(helper.setup)) {
        helper.setup(me);
        return me;
      }

      return _.assign(me, helper);

    }

    function setup(vm, $scope, callback) {

      const re = new RegExp(`${vm.rootState}\.([^\.]+)`);

      const stateChangeSuccessSubscription = $scope.$on('$stateChangeSuccess', (event, toState, toParams) => {

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

      const stateBarButtonClickSubscription = $scope.$on('stateBarButtonClick', (scopeEvent, domEvent, icon, isFromChild) => {
        if (isFromChild) {
          $scope.$broadcast('stateBarButtonClick', domEvent, icon);
        } else {
          const fn = _.get(vm, `${_.camelCase(icon)}Click`);
          _.isFunction(fn) && fn(domEvent);
        }
      });

      $scope.$on('$destroy', () => {
        stateChangeSuccessSubscription();
        stateBarButtonClickSubscription();
      });

      return _.assign(vm,{
        //stateBarButtonClick: event => $scope.$broadcast('stateBarButtonClick', event)
        use,
        setBusy(promise, message) {

          if (_.isArray(promise)) {
            promise = $q.all(promise);
          }

          vm.busy = promise;

          vm.busy.finally(() => vm.busy = false);

          vm.cgBusy = {promise};

          if (message) {
            vm.cgBusy.message = message;
          }

          return promise;

        }
      });

    }

  }

  angular.module('vseramki')
    .service('ControllerHelper', ControllerHelper);

})();
