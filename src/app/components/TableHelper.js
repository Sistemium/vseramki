'use strict';

(function () {

  angular.module('vseramki')
    .service('TableHelper', TableHelper);

  function TableHelper() {

    function pagination () {
      return {
        labels: {
          page: 'Страница:',
            rowsPerPage: 'Кол-во элементов: ',
            of: 'из'
        },
        query: {
          limit: 10,
            page: 1
        },
        limitOptions: [12, 24, 50, 100]
      };
    }

    return {
      pagination
    };

  }

})();
