'use strict';

(function () {

  angular
    .module('vseramki')
    .service('FilterCriteria', FilterCriteria)
    .run(function (FilterCriteria) {
      FilterCriteria.findAll();
    })
  ;

  function FilterCriteria(Schema) {

    return Schema.register({

      name: 'FilterCriteria',
      defaultAdapter: 'localStorage'

    });

  }

}());

