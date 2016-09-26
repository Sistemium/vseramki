'use strict';

(function () {

  function ToastHelper($mdToast, $window) {

    function showToast(resStr, status) {

      var theme;
      var sidenavElem = $window.document.getElementsByClassName('toolbar-fixed-top');

      if (status) {
        theme = 'success-toast';
      } else {
        theme = 'fail-toast';
      }

      $mdToast.show(
        $mdToast.simple()
          .textContent(resStr)
          .position('top right')
          .hideDelay(1500)
          .theme(theme)
          .parent(sidenavElem)
      );
    }

    return {
      showToast: showToast
    };
  }

  angular.module('vseramki')
    .service('ToastHelper', ToastHelper);

})();


