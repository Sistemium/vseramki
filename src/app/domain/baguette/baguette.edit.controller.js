'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('BaguetteEditController', BaguetteEditController)
  ;

  function BaguetteEditController(Schema, Baguette, $mdToast, $scope, $state) {

    var vm = this;
    var keys = ['brandId', 'colourId', 'materialId'];

    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');

    vm.id = $state.params.id;
    var el = angular.element(document.getElementsByClassName('toolbar-fixed-top'));
    vm.unique = true;

    Colour.bindAll(false, $scope, 'vm.colours');
    Material.bindAll(false, $scope, 'vm.materials');
    Brand.bindAll(false, $scope, 'vm.brands');

    if (vm.id) {
      Baguette.find(vm.id);
      Baguette.bindOne(vm.id, $scope, 'vm.baguette');
      //$scope.$emit('BaguetteEditController', id);
    } else {
      vm.isCreateState = true;
      vm.baguette = Baguette.createInstance();
      Baguette.bindAll('', $scope, 'vm.baguetteTest');
    }

    function selectParamsChecker() {
      return vm.unique && vm.baguette && vm.baguette.colour && vm.baguette.material && vm.baguette.brand && vm.baguette.borderWidth;
    }


    angular.extend(vm, {

      selectParamsChecker: selectParamsChecker,
      selected: [],

      showToast: function (resStr, status) {
        var theme;

        if (status) {
          theme = 'success-toast';
        } else {
          theme = 'fail-toast';
        }

        $mdToast.show(
          $mdToast.simple()
            .textContent(resStr)
            .position('top right')
            .hideDelay(1500)
            .theme(theme)
            .parent(el)
        );
      },

      createBaguette: function () {

        Baguette.create(vm.baguette)
          .then(function () {
            vm.showToast('Багет сохранен', true);
            vm.baguette = Baguette.createInstance();
            $scope.widthForm.$setUntouched();
          })
          .catch(function (obj) {

            if (obj.status == '500') {
              vm.showToast('Ошибка. Багет не сохранен', false);
            } else {
              vm.showToast('Ошибка. Обратитесь в тех. поддержку', false);
            }

          });
      },

      saveClickedOption: function (obj, name) {

        vm.baguette[name] = obj.id;

        if (vm.baguette.material && vm.baguette.colour && vm.baguette.brand) {
          vm.toCheckForDuplicates = true + obj.id;
        } else {
          vm.toCheckForDuplicates = false;
        }

      }

    });

    $scope.$watch('vm.toCheckForDuplicates', function () {

      if (vm.baguette.material && vm.baguette.colour && vm.baguette.brand) {

        var filter = _.pick(vm.baguette, keys);

        Baguette.findAll(filter, {bypassCache: true}).then(function (data) {

          if (data.length) {
            vm.showToast('Такой багет уже существует', false);
            vm.unique = false;
          } else {
            vm.unique = true;
          }
        });


      }
    })


  }

}());
