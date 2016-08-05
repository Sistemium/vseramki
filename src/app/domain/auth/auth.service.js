'use strict';

(function () {

  angular.module('vseramki')
    .factory('Auth', Auth);

  function Auth (saAuth, saaAppConfig) {

    var config = {
      authUrl: saaAppConfig.authUrl
    };

    return saAuth(config);

  }

})();
