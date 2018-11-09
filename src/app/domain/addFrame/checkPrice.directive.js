'use strict';

(function () {

  angular.module('vseramki')
    .directive('checkPrice', checkPrice);

  function checkPrice() {
    return {

      restrict: 'A',
      require: 'ngModel',

      link: function (scope, elem, attrs, ctrl) {

        const validate = function (lowPrice) {

          const highPrice = attrs.checkPrice;

          if (!lowPrice || !highPrice) {
            ctrl.$setValidity('checkPrice', true);
          } else {
            ctrl.$setValidity('checkPrice', parseFloat(lowPrice) <= parseFloat(highPrice));
          }

          return lowPrice;
        };

        ctrl.$parsers.unshift(validate);
        ctrl.$formatters.push(validate);

        attrs.$observe('checkPrice', function () {
          return validate(ctrl.$modelValue);
        });

      }

    };
  }

})();
