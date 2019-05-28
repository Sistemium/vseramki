(function () {

  angular
    .module('vseramki')
    .config(routerConfig)
  ;

  /** @ngInject */

  function routerConfig(stateHelperProvider) {

    stateHelperProvider.state({

      name: 'pictures',
      url: '/pictures?search',
      template: '<pictures></pictures>',
      controllerAs: 'vm',

      data: {
        title: 'Картинки'
      },

      children: [],

    });

  }

}());
