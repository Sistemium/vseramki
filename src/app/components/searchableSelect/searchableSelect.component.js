'use strict';

(function () {

  angular.module('vseramki')
    .component('searchableSelect', {

      templateUrl: 'app/components/searchableSelect/searchableSelect.html',

      bindings: {
        model: '=',
        modelName: '@',
        options: '=',
        label: '@',
        onClose: '&',
        notAddable: '=',
        labelOf: '@',
        searchable: '=',
        placeholder: '@',
        pattern: '=',
        formatter: '&'
      },

      controllerAs: 'vm',

      controller: searchableSelectController

    });

  function searchableSelectController(Schema, $mdSelect, $mdToast, $window) {

    var vm = this;
    var el = $window.document.getElementsByClassName('toolbar-fixed-top');
    var addPattern = vm.pattern || /.*/;

    if (!vm.labelOf) {
      vm.labelOf = `${_.lowerCase(vm.label)}а`;
    }

    _.assign(vm, {

      isSearchable: vm.searchable !== false,
      onCloseFn: () => vm.onClose(),
      formatterFn: () => _.isFunction(vm.formatter()) ? vm.formatter() : defaultFormatter,

      inputReady,
      addClick,
      addAttrs,
      showToast,
      onSearchChange

    });

    function onSearchChange(value) {
      vm.isValidToAdd = addPattern.test(value);
    }

    function addClick($event) {
      $event.stopPropagation();
      if (!vm.addingMode) {
        vm.addingMode = true;
      } else {
        vm.addAttrs();
      }
    }

    function inputReady(elem) {
      elem.on('keydown', function (ev) {
        vm.addingMode = false;
        ev.stopPropagation();
      });
    }

    function addAttrs() {
      var foundModel = (Schema.model(vm.modelName));
      foundModel.findAll({name: vm.search.name}, {bypassCache: true}).then(function (item) {
        if (item.length) {
          vm.showToast('Такой атрибут уже сущетвует', false)
        } else {

          var formattedAttr = vm.formatterFn()(vm.search.name);

          foundModel.create({name: formattedAttr})
            .then(function (data) {
              vm.showToast(`Добавлен ${_.lowerCase(vm.label)} "${data.name}"`, true);
              vm.model = data.id;
              $mdSelect.hide();
              vm.search = '';
            });
        }
      });
    }

    function defaultFormatter(name) {
      return _.upperFirst(name);
    }

    function showToast(resStr, status) {

      var theme;

      if (status) {
        theme = 'success-toast';
      } else {
        theme = 'fail-toast';
      }

      $mdToast.show(
        $mdToast.simple()
          .textContent(resStr)
          .position('top right')
          .hideDelay(1500)
          .theme(theme)
          .parent(el)
      );
    }

  }

})();
