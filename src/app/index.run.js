'use strict';

(function () {


  angular
    .module('vseramki')
    .run(runBlock)
    .run(makeMeasureDigest)
    .run(function(amMoment) {
      amMoment.changeLocale('ru');
    });

  /** @ngInject */
  function runBlock($log, $window) {

    function checkIfDisableScroll (event, element) {
      if (element.nodeName === 'BODY' || event.touches.length > 1) {
        event.preventDefault();
        // console.error('Prevent drag on:', event.target);
      } else if (/md-select-menu-container|scroll-y/.test(element.classList)) {
        // event.stopPropagation();
      } else {
        element.parentElement && checkIfDisableScroll (event, element.parentElement);
      }
    }

    $window.addEventListener('touchmove', function(event) {
      checkIfDisableScroll(event, event.target);
    }, true);

    $log.debug('runBlock end');

  }

  /** @ngInject */
  function performancer($rootScope) {
    var a = performance.now();
    $rootScope.$apply();
    console.log('Digest length:', Math.round(performance.now() - a));
  }

  /** @ngInject */
  function makeMeasureDigest($window) {
    $window.measureDigest = () =>
      angular.element($window.document.querySelector('[ng-app]'))
        .injector()
        .invoke(performancer);
  }

})();
