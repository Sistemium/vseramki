'use strict';

(function () {

  function resize($window, $uibPosition) {

    return (scope, element, attrs) => {

      var property = attrs.resize ? (scope[attrs.resize] = {}) : scope;

      function getWindowDimensions() {
        return {
          windowHeight: $window.innerHeight,
          windowWidth: $window.innerWidth,
          offsetTop: $uibPosition.offset(element).top
        };
      }

      scope.$watch(getWindowDimensions, newValue => {
        _.assign(property, newValue);
        scope.uibPosition = $uibPosition.offsetParent(element);
      }, true);

      angular.element($window).bind('resize', () => scope.$apply());

    }

  }

  angular.module('ui.bootstrap.position')
    .directive('resize', resize);

})();
