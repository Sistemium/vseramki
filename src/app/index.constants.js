'use strict';
/* global moment:false */

(function() {

  angular
    .module('vseramki')
    .constant('moment', moment)

    .constant('saaAppConfig', {
      authUrl: 'https://oauth.it',
      authApiUrl: 'https://oauth.it/api/',
      redirect_uri: 'http://localhost:3004',
      orgAppId: 'c6b1bc54-5a2a-11e6-8000-e188647b398f'
    })

})();
