(function(){

  function routerAuth($state, AuthHelper, $rootScope) {

    let loggedIn;
    let loggingIn;

    const trt = $rootScope.$on('$stateChangeStart', function (event, to, toParams) {

      function checkRoles() {

        const needRoles = _.get(to, 'data.needRoles');
        const needAdmin =  needRoles === 'admin';

        // TODO: check needRoles value
        if (needAdmin && !AuthHelper.isAdmin() || needRoles && !AuthHelper.getUser()) {
          event.preventDefault();
          $state.go('home');
        }
      }

      if (loggedIn) {
        return checkRoles();
      }

      const user = AuthHelper.hasUser();

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
  }

  angular.module('vseramki')
    .run(routerAuth);

})();
