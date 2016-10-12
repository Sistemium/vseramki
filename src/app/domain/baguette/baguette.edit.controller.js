'use strict';

(function () {

  const keys = ['brandId', 'colourId', 'materialId', 'surfaceId', 'lastName', 'code'];

  function BaguetteEditController(Schema, $scope, $state, Helpers, $q) {

    var {ImageHelper, ToastHelper, ControllerHelper} = Helpers;
    var {Entity, Brand, Baguette, Material, Colour, BaguetteImage, BaguetteColour, Surface} = Schema.models();

    var vm = ControllerHelper.setup(this, $scope);

    _.assign(vm, {

      id: $state.params.id,
      unique: true,

      attrsSearchMaterial: {},
      attrsSearchColour: {},
      attrsSearchBrand: {},
      selected: [],
      baguetteColours: [],
      dupMessage: '',
      saveLabel: 'Сохранить новый багет',

      hasChanges,
      cancelChanges,
      save,
      baguetteColourRemoveClick,

      addAPhotoClick: ImageHelper.mdDialogHelper(
        function (imsImg) {
          BaguetteImage.create(
            angular.extend(imsImg, {
              baguetteId: vm.baguette.id
            }));
        })

    });

    /*

     Init

     */

    if (vm.id) {
      Baguette.find(vm.id)
        .then(function (baguette) {
          vm.baguette = baguette;
          vm.saveLabel = 'Сохранить';
          initBaguetteColours();
        });
    } else {
      vm.isCreateState = true;
      vm.baguette = Baguette.createInstance({
        materialId: _.get(Entity.get('Material'), 'options.defaultId')
        //colourId: Entity.defaultId('Colour')
      });
    }


    /*

     Listeners

     */


    $scope.$watch(() => {
      return _.pick(vm.baguette, keys);
    }, checkForDuplicates, true);

    $scope.$watch('vm.extraBaguetteColourId', addBaguetteColour);

    Colour.bindAll(false, $scope, 'vm.colours');
    Material.bindAll(false, $scope, 'vm.materials');
    Brand.bindAll(false, $scope, 'vm.brands');
    Surface.bindAll(false, $scope, 'vm.surfaces');

    BaguetteImage.bindAll({
      baguetteId: vm.id
    }, $scope, 'vm.baguetteImages');

    $scope.$on('$destroy', cancelChanges);

    /*

     Functions

     */

    function refreshName() {
      vm.baguette.name = vm.baguette.stringName();
    }

    function checkParams() {
      vm.paramsCheck = vm.unique &&
        vm.baguette &&
        vm.baguette.material &&
        vm.baguette.borderWidth;
    }

    function initBaguetteColours() {
      vm.baguetteColours = vm.baguette.colours || [];
    }

    function hasChanges() {
      checkParams();
      return !vm.id
        ? _.get(vm, 'attrsForm.$dirty')
        : Baguette.hasChanges(vm.id) ||
      _.find(
        vm.baguetteColours,
        item => !item.id || BaguetteColour.hasChanges(item)
      );
    }

    function addBaguetteColour() {
      if (vm.extraBaguetteColourId) {

        var colourId = {colourId: vm.extraBaguetteColourId};

        var isDuplicate = _.find(vm.baguetteColours, colourId);

        if (!isDuplicate) {
          vm.baguetteColours.push(BaguetteColour.createInstance({
            colourId: vm.extraBaguetteColourId
          }));
        }

        vm.extraBaguetteColourId = null;

      }
    }

    function baguetteColourRemoveClick(chip) {
      if (chip.id) {
        if (chip.toRemove) {
          BaguetteColour.revert(chip.id);
        } else {
          chip.toRemove = true;
        }
      } else {
        _.remove(vm.baguetteColours, chip);
      }
    }

    function cancelChanges() {
      if (vm.id && hasChanges()) {

        Baguette.revert(vm.baguette);
        _.each(vm.baguette.colours, item => item.id && BaguetteColour.revert(item));
        initBaguetteColours();
        checkParams();

      }
    }

    function checkForDuplicates() {

      if (!vm.baguette) {
        return;
      }

      refreshName();

      var filter = {};

      _.each(keys, key => filter[key] = vm.baguette[key] || null);

      Baguette.findAll(filter, {bypassCache: true, cacheResponse: false})
        .then(function (data) {

          _.remove(data, {id: _.get(vm, 'baguette.id')});

          if (data.length) {
            vm.dupMessage = 'Такой багет уже существует';
            vm.unique = false;
          } else {
            vm.unique = true;
            vm.dupMessage = '';
          }

          checkParams();

        });
    }

    function save() {
      return Baguette.create(vm.baguette)
        .then(baguette => {

          return $q.all(_.map(vm.baguetteColours, item => {
            if (item.toRemove) {
              return item.id ? BaguetteColour.destroy(item) : $q.reject();
            }
            return BaguetteColour.create(_.assign(item, {baguetteId: baguette.id}));
          }));

        })
        .then(() => {

          ToastHelper.success('Багет сохранен');

          if (!vm.id) {
            $state.go('^.edit', {id: vm.baguette.id});
          }

          clearForm();

        })
        .catch(() => ToastHelper.error('Ошибка. Багет не сохранен'));
    }

    function clearForm() {
      if (!vm.id) {
        vm.baguette = Baguette.createInstance();
      }
      vm.dupMessage = false;
      vm.unique = true;
      vm.extraBaguetteColourId = false;
      _.result(vm, 'attrsForm.$setUntouched');
      _.result(vm, 'attrsForm.$setPristine');
      checkParams();
      initBaguetteColours();

    }

  }

  angular
    .module('vseramki')
    .controller('BaguetteEditController', BaguetteEditController);

}());
