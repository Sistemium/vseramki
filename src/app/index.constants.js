'use strict';
/* global moment:false XLSX:false */
(function() {

  const localDev = !!location.port;

  const authUrl = 'https://oauth.it';
  // authUrl = localDev ? 'http://localhost:9080' :  authUrl;

  angular.module('vseramki')

    .constant('moment', moment)
    .constant('XLSX',XLSX)

    .constant('saaAppConfig', {
      // ims: 'http://localhost:8080/api/image',
      loginState: 'login',
      authUrl: authUrl,
      authApiUrl: authUrl + '/api/',
      redirect_uri: localDev ? 'http://localhost:3004' : 'https://vr.sistemium.ru',
      orgAppId: localDev ? 'c6b1bc54-5a2a-11e6-8000-e188647b398f' : '4cb3ebb4-7f39-11e6-8000-e188647b398f'
    });

})();
