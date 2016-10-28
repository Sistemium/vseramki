'use strict';
/* global moment:false */

(function() {

  var localDev = !!location.port;

  var authUrl = 'https://oauth.it';
  // authUrl = localDev ? 'http://localhost:9080' :  authUrl;

  angular
    .module('vseramki')
    .constant('moment', moment)

    .constant('saaAppConfig', {
      loginState: 'login',
      authUrl: authUrl,
      authApiUrl: authUrl + '/api/',
      redirect_uri: localDev ? 'http://localhost:3004' : 'https://vr.sistemium.com',
      orgAppId: localDev ? 'c6b1bc54-5a2a-11e6-8000-e188647b398f' : '4cb3ebb4-7f39-11e6-8000-e188647b398f'
    });

})();
