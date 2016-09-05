'use strict';

(function () {

  function AuthHelper(Auth) {

    function isLoggedIn() {
      var token = Auth.getToken();
      return token ? true : false;
    }

    function isAdmin() {
      var promise = Auth.getCurrentUser();
      return promise.name == 'Denis Mosin';
    }


    return {
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin
    }

  }

  angular.module('vseramki')
    .service('AuthHelper', AuthHelper);

})();
