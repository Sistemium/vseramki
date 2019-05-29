'use strict';

(function () {

  function resize($window, $uibPosition, $timeout) {

    return (scope, element, attrs) => {

      const property = attrs.resize ? (scope[attrs.resize] = {}) : scope;

      function getWindowDimensions() {
        const offset = $uibPosition.offset(element);
        return {
          windowHeight: $window.innerHeight,
          windowWidth: $window.innerWidth,
          offsetTop: offset ? offset.top : 0
        };
      }

      function setValues(newValue) {
        _.assign(property, newValue);
      }

      const un = scope.$watch(getWindowDimensions, setValues, true);

      function apply() {
        scope.$apply();
      }

      angular.element($window)
        .bind('resize', apply);

      scope.$on('$destroy', ()=> {
        un();
        angular.element($window)
          .unbind('resize', apply);
      });

      $timeout(setValues);
    }

  }

  angular.module('vseramki')
    .directive('resize', resize);

})();
