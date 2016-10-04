'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('MainController', MainController);

  function MainController(toastr, Auth, $state, $timeout) {

    var vm = this;
    var accessToken = $state.params ['access-token'];

    _.assign(vm, {});

    if (accessToken) {
      vm.busy = Auth.login(accessToken)
        .then(() => {
          return $timeout(1000)
            .then(()=>{
              $state.go('catalogue', true, {inherit: false});
            });
        })
        .catch(err => {
          vm.ready = true;
          toastr.error('Ошибка авторизации', angular.toJson(err));
          console.error(err);
        });
    } else {
      vm.ready = true;
      $state.go('catalogue');
    }

  }

})();
