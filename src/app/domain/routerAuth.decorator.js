(function(){

  function routerAuth($state, AuthHelper, $rootScope) {

    var loggedIn;
    var loggingIn;

    var trt = $rootScope.$on('$stateChangeStart', function (event, to, toParams) {

      function checkRoles() {

        var needRoles = _.get(to, 'data.needRoles');
        var needAdmin =  needRoles === 'admin' || /(edit|add)/g.test(to.name);

        // TODO: check needRoles value
        if (needAdmin && !AuthHelper.isAdmin() || needRoles && !AuthHelper.getUser()) {
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
  }

  angular.module('vseramki')
    .run(routerAuth);

})();
