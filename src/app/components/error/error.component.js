'use strict';

(function () {

  angular.module('vseramki')
    .component('error', {

      //templateUrl: 'app/components/error/error.html',

      bindings: {
        errorText: '='
      },

      controllerAs: 'vm',

      controller: function (ToastHelper, $state) {

        var vm = this;

        if (vm.errorText) {
          ToastHelper.error('Ошибка авторизации')
            .then(function () {
              $state.go('login', {}, {inherit: false});
            })
        }

      }

    });

})();
