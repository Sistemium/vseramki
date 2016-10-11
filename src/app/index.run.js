'use strict';

(function () {


  angular
    .module('vseramki')
    .run(runBlock);

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

})();
