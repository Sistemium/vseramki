'use strict';

(function () {

  angular.module('vseramki')
    .directive('inputClear', inputClear);

  function inputClear($compile, $timeout) {
    return {

      restrict: 'A',
      scope: {
        inputClearValue: '='
      },

      link: function (scope, element, attrs) {
        const color = attrs.inputClear;
        const style = color ? "color:" + color + ";" : "";

        const template = angular.element(
          `<md-button class="md-icon-button input-clear-button" ng-click="clearModel()"`
          + ` ng-show="$parent.${attrs.ngModel}">`
          + `<i style="${style}" class="material-icons">close</i>`
          + `</md-button>`
        );

        $compile(template)(scope);
        element.after(template);

        scope.clearModel = function () {
          _.set(scope.$parent, attrs.ngModel, scope.inputClearValue);
          $timeout()
            .then(()=>angular.element(element).focus());
        };

      }

    };
  }

})();
