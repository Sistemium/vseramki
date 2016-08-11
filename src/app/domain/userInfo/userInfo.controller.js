'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('UserInfoController', UserInfoController)
  ;

  function UserInfoController(Auth) {

    var vm = this;

    function setUser() {
      Auth.getCurrentUser(null)
        .then(function (user) {
          vm.user = user;
        });
    }

    setUser();

    angular.extend(vm, {
      logout: Auth.logout
    });

  }

}());
