'use strict';

(function () {

  angular.module('vseramki')
    .controller('LoginController', LoginController);

  function LoginController($stateParams) {

    var vm = this;

    vm.buttons = [
      {
        url: 'sms/vseramki',
        name: 'Мобильный номер'
      },
      {
        url: 'facebook/vseramki',
        name: 'Facebook'
      },
      {
        url: 'ok/vseramki',
        name: 'Одноклассники'
      },
      {
        url: 'vk/vseramki',
        name: 'Вконтакте'
      }
    ];

    vm.error = $stateParams.error;

  }


})();
