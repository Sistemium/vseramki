(function () {

  angular.module('vseramki').component('baguetteView', {

    bindings: {
      baguetteId: '<',
    },

    controller: baguetteViewController,

    templateUrl: 'app/domain/baguette/view/baguetteView.html',
    controllerAs: 'vm'

  });

  function baguetteViewController($scope, ControllerHelper, Schema) {

    const vm = ControllerHelper.setup(this, $scope);

    const {Baguette} = Schema.models();

    vm.use({

      $onInit() {

        refresh();

      },

      previewClick() {
        if (!vm.images.length) {
          return;
        }
        $scope.$broadcast('openGallery', {index: 0});
      },

    });

    function refresh() {
      const {baguetteId} = vm;
      Baguette.bindOne(baguetteId, $scope, 'vm.baguette', onBaguette);
    }

    function onBaguette() {
      const {baguette} = vm;
      vm.images = baguette.pictureImages();
    }

  }

})();
