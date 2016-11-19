'use strict';

(function () {

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  /** @ngInject */
  function routerConfig(stateHelperProvider) {
    stateHelperProvider
      .state({
        name: 'info',
        url: '/info',
        templateUrl: 'app/domain/contacts/contacts.html',
        controller: 'СontactsController',
        controllerAs: 'vm',
        data: {
          title: 'Контакты'
        }
      });
  }

}());
