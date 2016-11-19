'use strict';

(function () {

  angular.module('vseramki')
    .component('formEdit', {

      transclude: {
        fields: '?formFields',
        footer: '?formFooter'
      },

      bindings: {
        formTitle: '@',
        item: '=',
        vm: '=',
        nameField: '@',
        showButtons: '=?'
      },

      /** @ngInject */
      controller: function ($scope) {

        var vm$ = this;

        _.assign(vm$, {
          nameField: vm$.nameField !== '' && 'name',
          showButtons: vm$.showButtons !== false
        });

        $scope.vm = vm$.vm;

      },

      templateUrl: 'app/components/formEdit/formEdit.html',
      controllerAs: 'vm$'

    });

})();
