'use strict';

(function () {

  angular
    .module('vseramki')
    .service('FilteredArticle', FilteredArticle)
    .run(function (FilteredArticle) {
      FilteredArticle.findAll();
    })
  ;

  function FilteredArticle(Schema) {

    return Schema.register({

      name: 'FilteredArticle',
      defaultAdapter: 'localStorage'

    });

  }

}());

