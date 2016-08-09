(function () {
  'use strict';

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  /** @ngInject */
  function routerConfig(stateHelperProvider) {
    stateHelperProvider
      .state({
        name: 'addFrame',
        url: '/addFrame',
        templateUrl: 'app/domain/addFrame/addFrame.html',
        controller: 'AddFrame',
        controllerAs: 'vm'
      });
  }

}());
