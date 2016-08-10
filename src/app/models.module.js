(function () {
  'use strict';

  angular
    .module('models', [
      'sistemium'
    ])
    .run(function(Article){
      Article.findAll({limit: 1000});
    });

})();
