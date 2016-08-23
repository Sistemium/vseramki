(function () {
  'use strict';

  angular.module('vseramki')
    .directive('inputClear', inputClear);

  function inputClear($compile) {
    return {

      restrict: 'A',
      scope: {
        inputClearValue: '='
      },

      link: function (scope, element, attrs) {
        var color = attrs.inputClear;
        var style = color ? "color:" + color + ";" : "";

        var template = angular.element('<md-button class="md-icon-button input-clear-button"' +
          ' ng-show="$parent.' + attrs.ngModel + '"'+
          ' ng-click="clearModel()" ' +
          '>' +
          '<i style="' + style + '" class="material-icons">close</i>' +
          '</md-button>'
        );

        $compile (template)(scope);
        element.after(template);

        scope.clearModel = function () {
          _.set(scope.$parent, attrs.ngModel, scope.inputClearValue);
          angular.element(element).focus();
        };

      }

    };
  }

})();
