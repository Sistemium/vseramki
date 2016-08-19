'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('BaguetteEditController', BaguetteEditController);

  function BaguetteEditController(Schema, Baguette, $mdToast, $scope, $state, $window, ImageHelper, ModalHelper, $timeout) {


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

      showToast: function (resStr, status) {
        var theme;

        if (status) {
          theme = 'success-toast';
        } else {
          theme = 'fail-toast';
          vm.dupMessage = '';
          $timeout(function () {
            vm.dupMessage = resStr;
          }, 2500);

        }

        $mdToast.show(
          $mdToast.simple()
            .textContent(resStr)
            .position('top right')
            .hideDelay(2000)
            .theme(theme)
            .parent(el)
        );
      },

      createBaguette: function () {
        Baguette.create(vm.baguette)
          .then(function () {
            vm.showToast('Багет сохранен', true);
            if (!vm.id) {
              vm.baguette = Baguette.createInstance();
            }
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

      saveClickedOption: function () {

        if (vm.baguette.material && vm.baguette.colour && vm.baguette.brand && (hasChanges() || vm.isCreateState)) {
          checkForDuplicates();
        }

        if (!vm.id) {
          $scope.$emit('baguetteRefresh', _.pick(vm.baguette, keys));
        }

      },

      addAttr: ModalHelper.showModal(
        function (answer, attr, model) {
          if (answer) {
            var foundModel = (Schema.model(model));
            foundModel.findAll({name: attr}, {bypassCache: true}).then(function (item) {
              if (item.length) {
                vm.showToast('Такой атрибут уже сущетвует', false)
              } else {
                var formatedAttr = attr.slice(0, 1).toUpperCase() + attr.slice(1).toLowerCase();

                foundModel.create({name: formatedAttr}).then(function (a) {
                  vm.showToast('Атрибут ' + a.name + ' сохранен', true);

                  var resetFiled = 'attrsSearch' + model;
                  vm[resetFiled].name = '';

                  var markAdded = model.toLowerCase() + 'Id';
                  vm.baguette[markAdded] = a.id;
                });
              }
            });

          }
        }
      )

    });

    function checkForDuplicates() {

      var filter = _.pick(vm.baguette, keys);
      Baguette.findAll(filter, {bypassCache: true})
        .then(function (data) {

          if (data.length) {
            vm.showToast('Такой багет уже существует', false);
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
