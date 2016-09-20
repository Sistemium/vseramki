'use strict';

(function () {

  angular.module('vseramki')
    .controller('LoginController', LoginController);

  function LoginController($stateParams) {

    var vm = this;

    vm.buttons = [
      // {
      //   url: 'sms/vseramki',
      //   name: 'Мобильный номер',
      //   class: 'mobile'
      // },
      {
        url: 'facebook/vseramki',
        name: 'Facebook',
        class: 'facebook-official'
      },
      {
        url: 'mailru/vseramki',
        name: 'Mail.ru',
        class: 'mailru'
      },
      {
        url: 'odnoklassniki/vseramki',
        name: 'Одноклассники',
        class: 'odnoklassniki'
      },
      {
        url: 'vk/vseramki',
        name: 'Вконтакте',
        class: 'vk'
      }
    ];

    vm.error = $stateParams.error;

  }


})();
