'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('BaguettesController', BaguettesController)
  ;

  function BaguettesController(Schema, Baguette, $mdToast, $scope, $q, $state) {

    var vm = this;

    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');

    $q.all([
      Colour.findAll(),
      Material.findAll({}),
      Brand.findAll({})
    ]);

    Baguette.findAll({});

    Baguette.bindAll({
      orderBy: [
        ['ts', 'DESC']
      ]
    }, $scope, 'vm.baguettes');

    angular.extend(vm, {

      baguette: Baguette.createInstance(),
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

      editBaguette: function (item) {
        $state.go('.edit', {id: item.id});
      },

      deleteBaguette: function (item) {

        if (item.length) {
          _(item).forEach(function (item) {
            Baguette.destroy(item);
          });
          vm.selected = [];
        }
        else {
          Baguette.destroy(item);
        }

      },

      saveClickedOption: function (obj, name) {
        vm.baguette[name] = obj.id;
      }

    });

    var subscription = $scope.$on('$stateChangeSuccess', function (event, toState) {

      vm.isRoot = /(table|tiles)$/.test(toState.name);

    });

    $scope.$on('$destroy', subscription);


  }

}());
