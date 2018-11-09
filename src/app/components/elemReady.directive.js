'use strict';

(function () {

  angular.module('vseramki')
    .directive('elemReady', function ($parse) {
      return {
        restrict: 'A',

        link: function ($scope, elem, attrs) {

          elem.ready(function () {
            $scope.$apply(function () {
              const func = $parse(attrs.elemReady);
              func($scope)(elem);
            });
          });

        }
      }
    });

})();
