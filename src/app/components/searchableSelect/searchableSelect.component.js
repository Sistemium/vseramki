'use strict';

(function () {

  angular.module('vseramki')
    .component('searchableSelect', {

      templateUrl: 'app/components/searchableSelect/searchableSelect.html',

      bindings: {
        model: '=',
        options: '=',
        label: '@',
        onClose: '&'
      },

      controllerAs: 'vm',

      controller: function () {

        var vm = this;

        _.assign(vm, {

          inputReady: function(elem) {
            elem.on('keydown', function (ev) {
              ev.stopPropagation();
            });
          },

          onCloseFn: function() {
            vm.onClose();
          }

        });

      }

    });

})();
