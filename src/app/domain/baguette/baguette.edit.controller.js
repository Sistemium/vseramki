'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('BaguetteEditController', BaguetteEditController)
  ;

  function BaguetteEditController(Schema, Baguette, $mdToast, $scope, $state, $window, ImageHelper) {

    var vm = this;

    var keys = ['brandId', 'colourId', 'materialId'];

    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');
    var BaguetteImage = Schema.model('BaguetteImage');

    vm.id = $state.params.id;
    var el = $window.document.getElementsByClassName('toolbar-fixed-top');
    vm.unique = true;

    Colour.bindAll(false, $scope, 'vm.colours');
    Material.bindAll(false, $scope, 'vm.materials');
    Brand.bindAll(false, $scope, 'vm.brands');
    BaguetteImage.bindAll({
      baguetteId: vm.id
    }, $scope, 'vm.baguetteImages');

    if (vm.id) {
      Baguette.find(vm.id)
        .then(function (baguette) {
          vm.baguette = baguette;
        });
    } else {
      vm.isCreateState = true;
      vm.baguette = Baguette.createInstance();
    }


    function selectParamsChecker() {
      return vm.unique && vm.baguette && vm.baguette.colour && vm.baguette.material && vm.baguette.brand && vm.baguette.borderWidth;
    }

    angular.extend(vm, {

      selectParamsChecker: selectParamsChecker,
      selected: [],

      showImageDialog: ImageHelper.mdDialogHelper(
        function (imsImg, id) {
          BaguetteImage.create(
            angular.extend(imsImg, {
              baguetteId: id
            }));
        }),

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

        console.log(vm.baguette);

        if (obj && name) {
          vm.baguette[name] = obj.id;
        }

        if (vm.baguette.material && vm.baguette.colour && vm.baguette.brand) {
          vm.toCheckForDuplicates = true + (obj.id || vm.baguette[obj]);
        } else {
          vm.toCheckForDuplicates = false;
        }
      }
    });


    $scope.$watch('vm.toCheckForDuplicates', function () {

      if (vm.isCreateState || vm.id && (typeof(vm.toCheckForDuplicates) !== 'undefined')) {
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
      }

    });

  }

}());
