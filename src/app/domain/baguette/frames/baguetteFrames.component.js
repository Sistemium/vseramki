(function () {

  angular.module('vseramki').component('baguetteFrames', {

    bindings: {
      baguette: '<',
    },

    controller: baguetteFramesController,

    templateUrl: 'app/domain/baguette/frames/baguetteFrames.html',
    controllerAs: 'vm'

  });

  function baguetteFramesController($scope, Schema, ControllerHelper) {

    const vm = ControllerHelper.setup(this, $scope);

    // const {Article} = Schema.models();

    vm.use({

      $onInit() {

        // refresh();

      },

    });
  }

})();
