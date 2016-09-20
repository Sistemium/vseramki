'use strict';

(function () {


  angular
    .module('vseramki')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state, AuthHelper) {

    var loggedIn;
    var loggingIn;

    var trt = $rootScope.$on('$stateChangeStart', function (event, to, toParams) {

      function checkRoles() {

        var needAdmin = _.get(to, 'data.needRoles') || /(edit|add)/g.test(to.name);

        // TODO: check needRoles value
        if (needAdmin && !AuthHelper.isAdmin()) {
          event.preventDefault();
          $state.go('home');
        }
      }

      if (loggedIn) {
        return checkRoles();
      }

      var user = AuthHelper.hasUser();

      if (!user) {
        return checkRoles();
      }

      event.preventDefault();

      // TODO: render a view with a spinner while http checking token

      if (!loggingIn) {
        loggingIn = user
          .then(()=> {
            loggedIn = true;
            loggingIn=false;
            if (to.name === 'home') {
              $state.go('home');
            } else {
              $state.go(to, toParams);
            }
          });
      }

    });

    $rootScope.$on('$destroy', trt);

    var defaultChildHelperSubscription = $rootScope.$on('$stateChangeSuccess', function (event, toState) {

      if (toState.defaultChild) {
        $state.go('.' + toState.defaultChild);
      }

    });

    $rootScope.$on('$destroy', defaultChildHelperSubscription);

    $log.debug('runBlock end');

  }

})();
