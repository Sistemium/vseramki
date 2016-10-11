'use strict';

(function () {

  const options = [
    'FrameSize', 'Colour', 'Brand', 'Surface', 'Material', 'Screening', 'BackMount'
  ];

  function routerConfig(stateHelperProvider) {

    stateHelperProvider
      .state({
        name: 'dictionary',
        url: '/dictionary',
        templateUrl: 'app/domain/dictionary/list.html',
        controller: 'DictionaryController',
        controllerAs: 'vm',
        defaultChild: 'FrameSize',

        data: {
          needRoles: 'admin',
          options
        },

        children: _.map(
          options, name => {
            return {
              name,
              url: `/${name}`
            }
          }
        )

      });
  }

  angular
    .module('vseramki')
    .config(routerConfig);

}());
