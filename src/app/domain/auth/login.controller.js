'use strict';

(function () {

  angular.module('vseramki')
    .controller('LoginController', LoginController);

  function LoginController($stateParams) {

    const vm = this;

    vm.buttons = [
      {
        url: 'facebook/vseramki',
        name: 'Facebook',
        class: 'facebook-official'
      },
      {
        url: 'google/vseramki',
        name: 'Google',
        class: 'google'
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
        name: 'ВКонтакте',
        class: 'vk'
      }
    ];

    vm.mobile = [{

      url: 'sms/vseramki',
      name: 'СМС-пароль',
      class: 'mobile'

    }];

    vm.error = $stateParams.error;

  }


})();
