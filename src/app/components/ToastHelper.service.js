'use strict';

(function () {

  function ToastHelper($mdToast, $window) {

    function showToast(resStr, status) {

      var parent = $window.document.getElementsByClassName('toolbar-fixed-top');
      var theme = 'success-toast';

      if (!status) {
        theme = 'fail-toast';
      }

      $mdToast.show(
        $mdToast.simple()
          .textContent(resStr)
          .position('top right')
          .hideDelay(1500)
          .theme(theme)
          .parent(parent)
      );
    }

    return {
      showToast,
      success: text => showToast(text, true),
      error: text => showToast(text, false)
    };

  }

  angular.module('vseramki')
    .service('ToastHelper', ToastHelper);

})();


