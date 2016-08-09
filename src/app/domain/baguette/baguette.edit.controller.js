'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('BaguetteEditController', BaguetteEditController)
  ;

  function BaguetteEditController(Schema, Baguette, $mdToast, $scope, $state, $window, ImageHelper, ModalHelper) {


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

      attrsSearchMaterial: {},
      attrsSearchColour: {},
      attrsSearchBrand: {},
      selected: [],
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

      saveClickedOption: function (obj, name) {

        if (obj && name) {
          vm.baguette[name] = obj.id;
        }

        if (vm.baguette.material && vm.baguette.colour && vm.baguette.brand) {
          vm.toCheckForDuplicates = true + (obj.id || vm.baguette[obj]);
        } else {
          vm.toCheckForDuplicates = false;
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
