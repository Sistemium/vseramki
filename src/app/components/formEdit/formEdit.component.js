'use strict';

(function () {

  angular.module('vseramki')
    .component('formEdit', {

      transclude: {
        fields: '?formFields',
        footer: '?formFooter'
      },

      bindings: {
        title: '@',
        item: '=',
        vm: '='
      },

      /** @ngInject */
      controller: function ($scope) {

        var vm$ = this;

        _.assign(vm$, {
        });

        $scope.vm = vm$.vm;

      },

      templateUrl: 'app/components/formEdit/formEdit.html',
      controllerAs: 'vm$'

    });

})();
