'use strict';
/* global moment:false */

(function() {

  angular
    .module('vseramki')
    .constant('moment', moment)

    .constant('saaAppConfig', {
      authUrl: 'https://oauth.it',
      authApiUrl: 'https://oauth.it/api/',
      redirect_uri: location.port ? 'http://localhost:3004' : 'https://vr.sistemium.com',
      orgAppId: location.port ? 'c6b1bc54-5a2a-11e6-8000-e188647b398f' : '4cb3ebb4-7f39-11e6-8000-e188647b398f'
    })

})();
