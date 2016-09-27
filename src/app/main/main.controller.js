'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('MainController', MainController);

  function MainController(toastr, Auth, $state) {

    var vm = this;
    var accessToken = $state.params ['access-token'];

    if (accessToken) {
      Auth.login(accessToken, function (err) {
        if (!err) {
          $state.go('home', false, {inherit: false});
        } else {
          toastr.error('Ошибка авторизации');
        }
      });
    }

    _.assign(vm, {});

  }

})();
