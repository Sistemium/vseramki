'use strict';

(function () {

  function ToastHelper($mdToast, $window, $timeout) {

    function showToast(resStr, status, vm) {

      var theme;
      var sidenavElem = $window.document.getElementsByClassName('toolbar-fixed-top');

      if (status) {
        theme = 'success-toast';
      } else {
        theme = 'fail-toast';
        vm.dupMessage = '';
        $timeout(function () {
          vm.dupMessage = resStr;
        }, 2500);
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

