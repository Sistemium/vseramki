'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('UserInfoController', UserInfoController)
  ;

  function UserInfoController(AuthHelper, Auth) {

    var vm = this;

    function setUser() {
      AuthHelper.hasUser()
        .then(function (user) {
          vm.user = user;
          vm.roles = AuthHelper.userRoles();
        });
    }

    setUser();

    angular.extend(vm, {
      logout: Auth.logout
    });

  }

}());
