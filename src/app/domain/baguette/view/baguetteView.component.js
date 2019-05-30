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

    const {Baguette, BaguetteImage} = Schema.models();

    vm.use({

      $onInit() {

        refresh();

      },

    });

    function refresh() {
      const {baguetteId} = vm;
      Baguette.bindOne(baguetteId, $scope, 'vm.baguette');
      BaguetteImage.bindAll({baguetteId}, $scope, 'vm.images');
    }

  }

})();
