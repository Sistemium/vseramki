'use strict';

(function () {

  angular.module('vseramki')
    .service('Auth', Auth);

  function Auth (saAuth, saaAppConfig) {

    var config = {
      authUrl: saaAppConfig.authUrl
    };

    return saAuth(config);

  }

})();
