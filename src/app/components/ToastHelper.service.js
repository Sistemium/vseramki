'use strict';

(function () {

  function ToastHelper($mdToast, $window) {

    function showToast(resStr, status) {

      const parent = $window.document.getElementsByClassName('toolbar-fixed-top');
      let theme = 'success-toast';

      if (!status) {
        theme = 'fail-toast';
      }

      return $mdToast.show(
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


