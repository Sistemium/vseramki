'use strict';

(function () {

  angular.module('vseramki')
    .component('oauthButtons', {

      templateUrl: 'app/components/oauthButtons/oauthButtons.html',

      bindings: {
        buttonsConfig: '='
      },

      controller: oauthButtonsController
    });

  function oauthButtonsController ($window, saaAppConfig) {

    const vm = this;

    _.assign(vm, {

      loginOauth: function (url) {
        let href = saaAppConfig.authUrl + '/auth/' + url;
        href += '?redirect_uri=' + saaAppConfig.redirect_uri + '&orgAppId=' + saaAppConfig.orgAppId;
        $window.location.href = href;
      }

    });
  }

})();
