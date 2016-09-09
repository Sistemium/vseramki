'use strict';

(function () {

  function AuthHelper(Auth, $q) {

    var currentUser;

    function isAdmin() {

      if (!currentUser) {
        return false;
      } else {
        return currentUser.name === 'Denis Mosin';
      }

    }

    function hasUser() {

      if (currentUser) {
        return $q.resolve(currentUser);
      } else if (Auth.getToken()) {
        return Auth.getCurrentUser(_.noop)
          .then(user => currentUser = user);
      }

    }

    return {
      isAdmin,
      hasUser
    }

  }

  angular.module('vseramki')
    .service('AuthHelper', AuthHelper);

})();
