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
        notAddable: '='
      },

      controllerAs: 'vm',

      controller: searchableSelectController

    });

  function searchableSelectController (Schema, $mdSelect, $mdToast, $window) {

    var vm = this;
    var el = $window.document.getElementsByClassName('toolbar-fixed-top');

    _.assign(vm, {

      inputReady: function (elem) {
        elem.on('keydown', function (ev) {
          vm.addingMode = false;
          ev.stopPropagation();
        });
      },

      onCloseFn: function () {
        vm.onClose();
      },

      addClick: function ($event) {
        $event.stopPropagation();
        if (!vm.addingMode) {
          vm.addingMode = true;
        } else {
          vm.addAttrs();
        }
      },

      addAttrs: function () {
        var foundModel = (Schema.model(vm.modelName));
        foundModel.findAll({name: vm.search.name}, {bypassCache: true}).then(function (item) {
          if (item.length) {
            vm.showToast('Такой атрибут уже сущетвует', false)
          } else {
            var formattedAttr = vm.search.name.slice(0, 1).toUpperCase() + vm.search.name.slice(1).toLowerCase();

            foundModel.create({name: formattedAttr}).then(function (data) {
              vm.showToast('Атрибут ' + vm.search.name + ' сохранен', true);
              $mdSelect.hide();
              vm.search = '';
              vm.model = data.id;
            });
          }
        });
      },
      showToast: function (resStr, status) {

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

    });

  }

})();
