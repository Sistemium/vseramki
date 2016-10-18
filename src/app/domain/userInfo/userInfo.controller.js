'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('UserInfoController', UserInfoController)
  ;

  function UserInfoController(AuthHelper, Auth, Schema, $q) {

    var vm = this;

    var User = Schema.model('User');

    _.assign(vm, {
      logout: Auth.logout
    });

    /*
    Init
     */

    setUser();

    /*
    Functions
     */

    function setUser() {
      var authUser = AuthHelper.getUser();
      vm.roles = AuthHelper.userRoles();

      User.find(authUser.id)
        .catch(err => {
          if (err.status == 404) {
            return User.create({
              id: authUser.id,
              name: authUser.name
              //TODO: try to get email and phone from saProviderAccount
            })
          }
          return $q.reject(err);
        })
        .then(user => vm.user = user)
        .catch(err => console.error(err));

    }

  }

}());
