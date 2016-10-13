'use strict';

(function () {

  const DEFAULT_COLUMNS = [
    {
      name: 'name',
      title: 'Имя'
    }
  ];

<<<<<<< HEAD
  function DictionaryController($scope, $state, Schema, AuthHelper, AlertHelper, $mdEditDialog, Entity, ToastHelper) {
=======
  function DictionaryController($scope, $state, Schema, AuthHelper, AlertHelper, $mdEditDialog, Entity) {
>>>>>>> origin/frameview

    var vm = this;
    var unbind;


    _.assign(vm, {

      rootState: 'dictionary',
      isAdmin: AuthHelper.isAdmin(),

      optionClick,
      editCell,

      onClickOptions: [
        {name: 'Удалить', fn: deleteItem},
<<<<<<< HEAD
        {name: 'Сделать основным', fn: makeDefault},
        {name: 'Удалить основной', fn: deleteDefault}
=======
        {name: 'Сделать основным', fn: makeDefault}
>>>>>>> origin/frameview
      ],

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

      model.findAll().then(function () {

        vm.modelDefaultId = Entity.getDefault(item.name);

      });

      if (unbind) {
        unbind();
      }

      model.bindAll({
        orderBy: ['name']
      }, $scope, 'vm.data');

      vm.columns = model.columns || DEFAULT_COLUMNS;
      vm.model = model;
    }

    function deleteItem(item, $event) {
      AlertHelper.showConfirm($event, `Удалить ${vm.option.labels.what} "${item.name}"?`)
        .then(confirmed => confirmed && vm.model.destroy(item));
    }

    function makeDefault(item) {
<<<<<<< HEAD
      var name = vm.model.name;
      Entity.setDefault(vm.model.name, item.id)
        .then(() => {
          if (vm.model.name === name) {
            vm.modelDefaultId = item.id;
          }
        }).catch(()=> {
        ToastHelper.error('Не удалось сохранить значение по-умолчанию');
      });
    }
=======
      console.log(item);
      Entity.create({
        id: vm.model.name,
        options: {
          defaultId: item.id
        }
      }).catch(err=>{console.log (err)});
    }

>>>>>>> origin/frameview

    function deleteDefault() {

    }
  }

  angular
    .module('vseramki')
    .controller('DictionaryController', DictionaryController);

}());
