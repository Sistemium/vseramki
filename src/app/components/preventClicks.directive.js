'use strict';

(function () {

  angular.module('vseramki')
    .directive('preventClicks', function () {
      return {
        restrict: 'C',

        link: function ($scope, elem) {
          elem.bind('click', event => event.preventDefault());
        }
      }
    });

})();
