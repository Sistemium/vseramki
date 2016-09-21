'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('BaguetteEditController', BaguetteEditController);

  function BaguetteEditController(Schema, Baguette, $scope, $state, $window, ImageHelper, ToastHelper) {

    var vm = this;

    var keys = ['brandId', 'colourId', 'materialId'];

    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');
    var BaguetteImage = Schema.model('BaguetteImage');

    vm.id = $state.params.id;

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

    function hasChanges() {
      return vm.id && Baguette.hasChanges(vm.id);
    }

    function cancelChanges() {
      if (hasChanges()) {
        return Baguette.revert(vm.baguette);
      }
    }

    $scope.$on('$destroy', cancelChanges);

    angular.extend(vm, {

      attrsSearchMaterial: {},
      attrsSearchColour: {},
      attrsSearchBrand: {},
      selected: [],
      dupMessage: '',

      hasChanges: hasChanges,
      cancelChanges: cancelChanges,

      selectParamsChecker: selectParamsChecker,

      showImageDialog: ImageHelper.mdDialogHelper(
        function (imsImg, id) {
          BaguetteImage.create(
            angular.extend(imsImg, {
              baguetteId: id
            }));
        }),

      createBaguette: function () {
        Baguette.create(vm.baguette)
          .then(function () {
            ToastHelper.showToast('Багет сохранен', true);
            if (!vm.id) {
              vm.baguette = Baguette.createInstance();
            }
            $scope.widthForm.$setUntouched();
          })
          .catch(function (obj) {

            if (obj.status == '500') {
              ToastHelper.showToast('Ошибка. Багет не сохранен', false, vm);
            } else {
              ToastHelper.showToast('Ошибка. Обратитесь в тех. поддержку', false, vm);
            }

          });
      },

      saveClickedOption: function () {

        if (vm.baguette.material && vm.baguette.colour && vm.baguette.brand && (hasChanges() || vm.isCreateState)) {
          checkForDuplicates();
        }

        if (!vm.id) {
          $scope.$emit('baguetteRefresh', _.pick(vm.baguette, keys));
        }

      }

    });

    function checkForDuplicates() {

      var filter = _.pick(vm.baguette, keys);
      Baguette.findAll(filter, {bypassCache: true})
        .then(function (data) {

          if (data.length) {
            ToastHelper.showToast('Такой багет уже существует', false, vm);
            vm.unique = false;
          } else {
            vm.unique = true;
            vm.dupMessage = '';
          }
        });
    }

    vm.inputReady = function () {

      var elem = angular.element($window.document.getElementById('materialInput'));
      elem.on('keydown', function (ev) {
        ev.stopPropagation();
      });

    };

  }

}());
