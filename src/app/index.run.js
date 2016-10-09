'use strict';

(function () {


  angular
    .module('vseramki')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state, AuthHelper, localStorageService, $window) {

    var loggedIn;
    var loggingIn;

    function checkIfDisableScroll (event, element) {
      if (element.nodeName === 'BODY' || event.touches.length > 1) {
        event.preventDefault();
        // console.error('Prevent drag on:', event.target);
      } else if (/md-select-menu-container|scroll-y/.test(element.classList)) {
        // event.stopPropagation();
      } else {
        element.parentElement && checkIfDisableScroll (event, element.parentElement);
      }
    }

    $window.addEventListener('touchmove', function(event) {
      checkIfDisableScroll(event, event.target);
    }, true);


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
            loggingIn = false;
            if (to.name === 'home') {
              $state.go('home');
            } else {
              $state.go(to, toParams);
            }
          });
      }

    });

    $rootScope.$on('$destroy', trt);

    $log.debug('runBlock end');

  }

})();
