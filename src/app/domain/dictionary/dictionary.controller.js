'use strict';

(function () {

  const DEFAULT_COLUMNS = [
    {
      name: 'name',
      title: 'Имя'
    }
  ];

  function DictionaryController($scope, $q, $state, Schema, AuthHelper, AlertHelper, $mdEditDialog) {

    var vm = this;

    _.assign(vm, {

      rootState: 'dictionary',
      isAdmin: AuthHelper.isAdmin(),

      optionClick,
      deleteItem,
      editCell,

      options: _.map($state.current.data.options, o => Schema.model(o)),

      columns: DEFAULT_COLUMNS

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


    function editCell(event, row, column) {

      event.stopPropagation();

      var editDialog = {
        modelValue: row[column.name],
        placeholder: column.title,

        save: function (input) {
          row[column.name] = input.$modelValue;
          vm.model.save(row)
            .catch(err => console.error(err));
        },

        targetEvent: event,
        title: column.title,
        validators: column.validators,
        type: 'text" autocomplete="off',
        ok: 'Сохранить',
        cancel: 'Отмена',
        messages: {
          pattern: 'Некорректный формат поля'
        }
      };

      $mdEditDialog.large(editDialog);

    }

    function optionClick(item) {
      if (!item) {
        return;
      }
      $state.go('dictionary.' + item.name);
      vm.option = item;
      var model = Schema.model(item.name);
      model.findAll()
        .then(data => vm.data = _.sortBy(data, 'name'));
      vm.columns = model.columns || DEFAULT_COLUMNS;
      vm.model = model;
    }

    function deleteItem(item, $event) {
      AlertHelper.showConfirm($event, `Удалить ${vm.option.labels.what} "${item.name}"?`)
        .then(response => {
          if (response) {
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
