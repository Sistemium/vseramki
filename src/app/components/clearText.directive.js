(function () {
  'use strict';

  angular.module('vseramki')
    .directive('inputClear', inputClear);

  function inputClear() {
    return {
      restrict: 'A',
      compile: function (element, attrs) {
        var color = attrs.inputClear;
        var style = color ? "color:" + color + ";" : "";
        var action = attrs.ngModel + " = ''";
        element.after(
          '<md-button class="md-icon-button"' +
          'ng-show="' + attrs.ngModel + '" ng-click="' + action + '"' +
          'style="position: absolute; top: -3px; right: -9px">' +
          '<i style="' + style +'; font-size: 19px; background: white; padding-top: 4px; padding-left: 4px; padding-right: 4px" class="material-icons">close</i>' +
          '</md-button>');
      }
    };
  }

})();
