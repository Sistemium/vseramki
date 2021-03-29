'use strict';

(function () {

  const basePath = window.localStorage.getItem('JSData.BasePath')
    || location.protocol === 'https:' && '/api/'
    || 'http://localhost:9300/api/';


  function Schema(saSchema, $http) {

    return saSchema({

      labelOf: function (count) {

        const labels = this.labels.count;

        if (_.inRange(count % 100, 9, 21)) {
          return labels['567890'];
        } else {
          const digit = count % 10;
          if (digit === 1) {
            return labels['1'];
          } else if (_.inRange(digit, 2, 5)) {
            return labels['234'];
          } else {
            return labels['567890'];
          }
        }

      },

      getCount: function (params) {
        return $http
          .get(
            basePath + this.endpoint,
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

  }

  angular.module('vseramki')

    .config(function (DSHttpAdapterProvider) {
      angular.extend(DSHttpAdapterProvider.defaults, {
        basePath: basePath
      });
    })

    .factory('Schema', Schema)

    .run(function (DS, $window) {
      $window.saDS = DS;
      const adapter = new $window.DSLocalStorageAdapter();
      DS.registerAdapter('localStorage', adapter);
    });

}());
