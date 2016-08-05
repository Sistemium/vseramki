(function () {

  'use strict';
  angular.module('vseramki')
    .component('oauthButtons', {

      templateUrl: 'app/components/oauthButtons/oauthButtons.html',

      bindings: {
        buttonsConfig: '='
      },

      controller: function ($window, saaAppConfig) {

        var vm = this;

        _.assign(vm, {

          loginOauth: function (url) {
            var href = saaAppConfig.authUrl + '/auth/' + url;
            href += '?redirect_uri=' + saaAppConfig.redirect_uri + '&orgAppId=' + saaAppConfig.orgAppId;
            $window.location.href = href;
          }

        });
      }
    })

})();
