'use strict';

(function () {

  function VSHelper() {

    function watchForGroupSize($scope, sideNavWidth, cellWidth, onChange) {

      var lastGroupSize;

      var un = $scope.$watch('windowWidth', function (windowWidth) {

        var groupSize = Math.floor((windowWidth - sideNavWidth) / cellWidth);

        if (groupSize < 1) {
          groupSize = 1;
        }

        if (groupSize !== lastGroupSize) {
          lastGroupSize = groupSize;
          onChange(groupSize);
        }

      });

      $scope.$on('$destroy', un);

    }

    return {
      watchForGroupSize: watchForGroupSize
    };

  }

  angular.module('vseramki')
    .service('VSHelper', VSHelper);

})();
