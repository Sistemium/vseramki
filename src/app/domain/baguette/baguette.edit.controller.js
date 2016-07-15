'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('BaguetteEditController', BaguetteEditController)
  ;

  function BaguetteEditController(Schema, Baguette, $mdToast, $scope, $state) {

    var vm = this;

    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');

    var id = $state.params.id;

    Colour.bindAll(false, $scope, 'vm.colours');
    Material.bindAll(false, $scope, 'vm.materials');
    Brand.bindAll(false, $scope, 'vm.brands');

    if (id) {
      Baguette.find(id);
      Baguette.bindOne(id, $scope, 'vm.baguette');
    } else {
      vm.baguette = Baguette.createInstance();
    }

    function selectParamsChecker() {
      return vm.baguette && vm.baguette.colour && vm.baguette.material && vm.baguette.brand && vm.baguette.borderWidth;
    }

    angular.extend(vm, {

      selectParamsChecker: selectParamsChecker,
      selected: [],

      showToast: function (resStr) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(resStr)
            .position('top right')
            .hideDelay(1500)
        );
      },

      createBaguette: function () {
        Baguette.create(vm.baguette)
          .then(function () {
            vm.showToast('Багет сохранен');
            vm.baguette = Baguette.createInstance();
            $scope.widthForm.$setUntouched();
          })
          .catch(function () {
            vm.showToast('Ошибка. Багет не сохранен');
          });
      },

      saveClickedOption: function (obj, name) {
        vm.baguette[name] = obj.id;
      }

    });


  }

}());
