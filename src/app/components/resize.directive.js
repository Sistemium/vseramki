'use strict';

(function () {

  function resize($window, $uibPosition, $timeout) {

    return (scope, element, attrs) => {

      var property = attrs.resize ? (scope[attrs.resize] = {}) : scope;

      function getWindowDimensions() {
        return {
          windowHeight: $window.innerHeight,
          windowWidth: $window.innerWidth
        };
      }

      function setValues (newValue) {
        var offset = $uibPosition.offset(element);
        _.assign(property, newValue);
        property.offsetTop = offset ? offset.top : 0;
      }

      var un = scope.$watch(getWindowDimensions, setValues, true);

      function apply () {
        scope.$apply();
      }

      angular.element($window)
        .bind('resize', apply);

      scope.$on('$destroy', ()=>{
        un();
        angular.element($window)
          .unbind('resize', apply);
      })

      $timeout(setValues);
    }

  }

  angular.module('ui.bootstrap.position')
    .directive('resize', resize);

})();
