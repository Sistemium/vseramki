'use strict';

(function () {

  function DictionaryController($scope, $q, $state, Schema, AuthHelper) {

    var vm = this;

    var {
      FrameSize,
      Brand,
      Material,
      Colour,
      Surface
    } = Schema.models();

    _.assign(vm, {

      rootState: 'dictionary',
      isAdmin: AuthHelper.isAdmin(),

      optionClick,
      deleteItem,

      options: [
        FrameSize,
        Brand,
        Material,
        Colour,
        Surface
      ],

      columns: [
        {
          name: 'name',
          title: 'Имя'
        }
      ]

    });

    /*

     Init

     */

    vm.optionName = _.last($state.current.name.match(/dictionary\.([^.]+)/));
    optionClick(_.find(vm.options, vm.optionName));

    /*

     Listeners

     */


    /*

     Functions

     */

    function optionClick(item) {
      if (!item) {
        return;
      }
      $state.go('dictionary.' + item.name);
      vm.option = item;
      Schema.model(item.name).findAll()
        .then(data => vm.data = _.sortBy(data, 'name'));
    }

    function deleteItem(item) {
      vm.option.destroy(item)
        .then(()=>optionClick(vm.option));
    }


  }

  angular
    .module('vseramki')
    .controller('DictionaryController', DictionaryController);

}());
