'use strict';

(function () {

  function AuthHelper(Auth, $q) {

    var currentUser;
    var currentUserRoles;

    function isAdmin() {

      if (!currentUser) {
        return false;
      } else {
        return !!(currentUserRoles.admin || currentUserRoles.manager);
      }

    }

    function hasUser() {

      if (currentUser) {

        return $q.resolve(currentUser);

      } else if (Auth.getToken()) {

        currentUser = Auth.getCurrentUser(_.noop)
          .then(user => {

            currentUser = user;
            currentUserRoles = {};

            _.each(user.orgAccounts, orgAccount => {
              _.each(orgAccount.orgAccountRoles, orgAccountRole => {
                currentUserRoles[_.lowerCase(_.get(orgAccountRole, 'role.code'))] = true;
              });
            });

            return currentUser;
          });

        return currentUser;
      }

    }

    function setup(controller) {
      _.assign(controller, {
        isAdmin: isAdmin()
      });
    }

    return {
      setup,
      isAdmin,
      hasUser,
      userRoles: () => currentUserRoles,
      getUser: () => currentUser
    }

  }

  angular.module('vseramki')
    .service('AuthHelper', AuthHelper);

})();
