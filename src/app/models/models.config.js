(function () {
  'use strict';

  var basePath = window.localStorage.getItem('JSData.BasePath')
    || location.protocol === 'https:' && '/api/'
    || 'https://api.sistemium.com/v4d/vr/';

  angular
    .module('vseramki')
    .config(function (DSHttpAdapterProvider) {
      angular.extend(DSHttpAdapterProvider.defaults, {
        basePath: basePath
      });
    })

    .factory('Schema', function(saSchema,$http) {

      return saSchema({
        getCount: function (params) {
          return $http
            .get(
              basePath + '/' + this.endpoint,
              {
                params: angular.extend({
                  'agg:': 'count'
                }, params || {})
              }
            )
            .then(function (res) {
              return parseInt(res.headers('x-aggregate-count'));
            });
        }
      });

    })

    .service('Models', function (Schema) {

      return Schema.models();

    })
  ;

}());
