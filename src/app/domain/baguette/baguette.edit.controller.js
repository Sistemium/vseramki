'use strict';

(function () {

  function BaguetteEditController(Schema, Baguette, $scope, $state, ImageHelper, ToastHelper, $q) {

    var vm = this;

    var keys = ['brandId', 'colourId', 'materialId'];

    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');
    var BaguetteImage = Schema.model('BaguetteImage');
    var BaguetteColour = Schema.model('BaguetteColour');
    var Surface = Schema.model('Surface');


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
      saveClickedOption,
      deleteColour,

      quit: () => $state.go('^'),

      showImageDialog: ImageHelper.mdDialogHelper(
        function (imsImg, id) {
          BaguetteImage.create(
            angular.extend(imsImg, {
              baguetteId: id
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
        });
    } else {
      vm.isCreateState = true;
      vm.baguette = Baguette.createInstance();
    }

    /*

     Listeners

     */


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

    function selectParamsChecker() {
      vm.paramsCheck = vm.unique &&
        vm.baguette && vm.baguette.colour &&
        vm.baguette.material && vm.baguette.brand &&
        vm.baguette.borderWidth;
    }

    function initBaguetteColours() {
      vm.baguetteColours = vm.baguette.colour || [];
    }

    function hasChanges() {
      selectParamsChecker();
      return vm.id ? Baguette.hasChanges(vm.id) : _.get(vm, 'attrsForm.$dirty');
    }

    function addBaguetteColour() {
      if (vm.extraBaguetteColourId) {

        var colourId = {colourId: vm.extraBaguetteColourId};

        var isDuplicate = _.find(vm.baguetteColours, colourId);

        if (!isDuplicate) {
          isDuplicate = BaguetteColour.createInstance({
            colourId: vm.extraBaguetteColourId
          });
          vm.baguetteColours.push(isDuplicate);
        }

      }
    }

    function deleteColour(chip) {
      console.log(chip);
    }

    function cancelChanges() {
      if (vm.id && hasChanges()) {
        selectParamsChecker();
        return Baguette.revert(vm.baguette);
      }
    }

    function checkForDuplicates() {

      var filter = _.pick(vm.baguette, keys);

      Baguette.findAll(filter, {bypassCache: true})
        .then(function (data) {

          if (data.length) {
            vm.dupMessage = 'Такой багет уже существует';
            vm.unique = false;
          } else {
            vm.unique = true;
            vm.dupMessage = '';
          }
          selectParamsChecker();
        });
    }

    function save() {
      Baguette.create(vm.baguette)
        .then(baguette => {
          return $q.all(_.map(vm.baguetteColours, colour => {
            return BaguetteColour.create(_.assign(colour, {baguetteId: baguette.id}));
          }));

        }).then(function () {
          ToastHelper.showToast('Багет сохранен', true);
          if (!vm.id) {
            vm.baguette = Baguette.createInstance();
          }
          clearForm();
        })
        .catch(function (obj) {

          if (obj.status == '500') {
            ToastHelper.showToast('Ошибка. Багет не сохранен', false, vm);
          } else {
            ToastHelper.showToast('Ошибка. Обратитесь в тех. поддержку', false, vm);
          }

        });
    }

    function saveClickedOption() {

      if (vm.baguette.material && vm.baguette.colour && vm.baguette.brand && (hasChanges() || vm.isCreateState)) {
        checkForDuplicates();
      }

      if (!vm.id) {
        $scope.$emit('baguetteRefresh', _.pick(vm.baguette, keys));
      }

    }

    function clearForm() {
      if (!vm.id) {
        vm.baguette = Baguette.createInstance();
      }
      vm.dupMessage = false;
      vm.unique = true;
      vm.extraBaguetteColourId = false;
      //initArticleFrameSizes();
      _.result(vm, 'attrsForm.$setUntouched');
      _.result(vm, 'attrsForm.$setPristine');
      selectParamsChecker();
      initBaguetteColours();

    }

  }

  angular
    .module('vseramki')
    .controller('BaguetteEditController', BaguetteEditController);

}());
