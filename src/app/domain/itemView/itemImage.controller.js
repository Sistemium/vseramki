'use strict';

(function () {

    function ItemImageController($state, Schema) {

      var vm = this;
      var id = $state.params.imageId;
      var ArticleImage = Schema.model('ArticleImage');

      ArticleImage.find(id)
        .then(function(img){
          vm.src = img.largeSrc;
        });

    }

    angular.module('vseramki')
        .controller('ItemImageController', ItemImageController);

})();
