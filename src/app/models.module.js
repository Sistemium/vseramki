'use strict';

(function () {

  angular
    .module('models', [
      'sistemium'
    ])
    .run(function (Article) {
      Article.findAll({limit: 1000});
    });

})();
