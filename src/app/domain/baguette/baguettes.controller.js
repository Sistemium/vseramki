'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('BaguettesController', BaguettesController)
  ;

  function BaguettesController(Schema, Baguette, $mdToast, $scope, $q, $state, $window, ImageHelper) {

    var vm = this;
    var el = $window.document.getElementsByClassName('toolbar-fixed-top');

    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');
    var BaguetteImage = Schema.model('BaguetteImage');

    var currentState = $state.current.url;

    $q.all([
      Colour.findAll(),
      Material.findAll(),
      Brand.findAll(),
      BaguetteImage.findAll()
    ]);

    Baguette.findAll();

    var baguetteFilter = {
      orderBy: [
        ['ts', 'DESC']
      ]
    };

    var unbindBaguettes;

    function rebind(filter) {
      if (unbindBaguettes) {
        unbindBaguettes();
      }
      unbindBaguettes = Baguette.bindAll(filter, $scope, 'vm.baguettes');
    }

    vm.switchPosition = /tiles/g.test(currentState);

    var un = $scope.$on('baguetteRefresh', function (e, a) {
      rebind(_.assign({}, baguetteFilter, a));
    });

    $scope.$on('$destroy', un);

    angular.extend(vm, {

      selected: [],

      pagination: {
        labels: {
          page: 'Страница:',
          rowsPerPage: 'Кол-во элементов: ',
          of: 'из'
        },
        query: {
          limit: 5,
          page: 1
        },
        limitOptions: [5, 10, 20, 40]
      },

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

      editBaguette: function (item) {
        $state.go('.edit', {id: item.id});
      },


      deleteBaguette: function (item) {

        if (item.length) {
          _(item).forEach(function (item) {
            Baguette.destroy(item);
          });
          vm.showToast('Багет удален', true);
          vm.selected = [];
        }
        else {
          Baguette.destroy(item);
          vm.showToast('Багет удален', true);
        }

      },

      resetCheckedBaguette: function () {
        vm.selected = [];
      },


      ///???????????????????????????????????????////

      saveClickedOption: function (obj, name) {
        console.log('sfsdfsdf');
        console.log(obj, name);
        vm.baguette[name] = obj.id;
      },

      changeBaguette: function (bag) {
        $state.go($state.current.name, {id: bag.id});
      },

      goToCreateBaguette: function () {
        $state.go('.create');
      },

      backToList: function () {
        $state.go($state.current.parent.name);
      }

    });

    var subscription = $scope.$on('$stateChangeSuccess', function (event, toState, toParams) {

      vm.isRoot = /(table|tiles)$/.test(toState.name);

      if (vm.isRoot || !unbindBaguettes) {
        rebind(baguetteFilter);
      }

      if (/\.edit$/.test(toState.name)) {
        Baguette.find(toParams.id)
          .then(function (item) {
            vm.currId = item.id;
          });
      }

    });

    $scope.$watch('windowWidth', function (windowWidth) {

      windowWidth < 800 ? vm.hideBaguetteList = true : vm.hideBaguetteList = false;
      windowWidth < 600 ? vm.useMobile = true : vm.useMobile = false;

    });


    $scope.$on('$destroy', subscription);

    $scope.$watch('vm.switchPosition', function (o, n) {
      if (o === n) {
        return;
      }
      if (vm.switchPosition == true) {
        $state.go('baguettes.tiles');
      } else {
        $state.go('baguettes.table');
      }
    });

  }

}());
