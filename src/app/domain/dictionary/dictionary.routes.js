'use strict';

(function () {

  function routerConfig(stateHelperProvider) {

    // var children = [
    //
    //   {
    //     name: 'create',
    //     url: '/create',
    //     templateUrl: 'app/domain/addFrame/editFrame.html',
    //     controller: 'AddFrameController',
    //     controllerAs: 'vm'
    //   },
    //
    //   {
    //     name: 'item',
    //     url: '/:id',
    //     controller: 'ItemController',
    //     templateUrl: 'app/domain/itemView/item.html',
    //     controllerAs: 'vm',
    //     children: [
    //
    //       {
    //         name: 'edit',
    //         url: '/edit',
    //         templateUrl: 'app/domain/addFrame/editFrame.html',
    //         controller: 'AddFrameController',
    //         controllerAs: 'vm'
    //       }
    //
    //     ]
    //   }];

    stateHelperProvider
      .state({
        name: 'dictionary',
        url: '/dictionary',
        templateUrl: 'app/domain/dictionary/list.html',
        controller: 'DictionaryController',
        controllerAs: 'vm',
        // defaultChild: 'FrameSize',

        data: {
          needRoles: 'admin'
        },

        children: _.map(
          ['FrameSize', 'Colour', 'Brand', 'Surface', 'Material'], name => {
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
