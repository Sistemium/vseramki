'use strict';

(function () {

  function DictionaryController($scope, $q, $state, Schema, AuthHelper, AlertHelper) {

    var vm = this;

    _.assign(vm, {

      rootState: 'dictionary',
      isAdmin: AuthHelper.isAdmin(),

      optionClick,
      deleteItem,

      options: _.map($state.current.data.options, o => Schema.model(o)),

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

    function deleteItem(item, $event) {
      AlertHelper.showConfirm($event, `Удалить ${vm.option.labels.what} ${item.name}"?`)
        .then(response => {
          if (response){
            vm.option.destroy(item)
              .then(()=>optionClick(vm.option));
          }
        });
    }


  }

  angular
    .module('vseramki')
    .controller('DictionaryController', DictionaryController);

}());
