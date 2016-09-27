'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('BaguettesController', BaguettesController)
  ;

  function BaguettesController(Schema, Baguette, AuthHelper, $scope, $q, $state, ImageHelper, VSHelper, ToastHelper, AlertHelper) {

    var vm = this;

    var Brand = Schema.model('Brand');
    var Material = Schema.model('Material');
    var Colour = Schema.model('Colour');
    var BaguetteImage = Schema.model('BaguetteImage');

    $q.all([
      Colour.findAll(),
      Material.findAll(),
      Brand.findAll(),
      BaguetteImage.findAll()
    ]);

    var chunkSize;

    vm.isAdmin = AuthHelper.isAdmin();

    function setChunks(nv) {
      chunkSize = nv;
      vm.chunked = _.chunk(vm.baguettes, nv);
    }

    Baguette.findAll()
      .then(function (baguettes) {
        vm.baguettes = baguettes;
        setChunks(chunkSize);
      })
    ;


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
      // TODO: check tiles flickering after nth delete
      unbindBaguettes = Baguette.bindAll(filter, $scope, 'vm.baguettes', () => setChunks(chunkSize));
    }

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
          limit: 10,
          page: 1
        },
        limitOptions: [10, 20, 40, 80]
      },

      showImageDialog: ImageHelper.mdDialogHelper(
        function (imsImg, id) {
          BaguetteImage.create(
            angular.extend(imsImg, {
              baguetteId: id
            }));
        }),


      editBaguette: function (item) {
        $state.go('.edit', {id: item.id});
      },


      deleteBaguette: function (item, $event) {

        var promise = AlertHelper.showConfirm($event);


        promise.then(function (answer) {
          if (answer) {
            if (item.length) {
              _(item).forEach(function (item) {
                Baguette.destroy(item);
              });
              ToastHelper.showToast('Багет удален', true);
              vm.selected = [];
            }
            else {
              Baguette.destroy(item);
              ToastHelper.showToast('Багет удален', true);
            }
          }
        }).catch(function () {
          vm.selected = [];
        });

      },

      resetCheckedBaguette: function () {
        vm.selected = [];
      },

      ///???????????????????????????????????????////
      saveClickedOption: function (obj, name) {
        vm.baguette[name] = obj.id;
      },

      changeBaguette: function (bag) {
        $state.go($state.current.name, {id: bag.id});
      },

      goToCreateBaguette: function (parent) {
        $state.go(`${parent || ''}.create`);
      },

      backToList: function () {
        $state.go($state.current.parent.name);
      },

      changeView: function (goTo) {
        $state.go(goTo);
      }

    });

    var subscription = $scope.$on('$stateChangeSuccess', function (event, toState, toParams) {

      vm.isRoot = /(table|tiles)$/.test(toState.name);
      vm.currentState = _.first($state.current.name.match(/[^\.]*$/));

      if (vm.isRoot || !unbindBaguettes) {
        rebind(baguetteFilter);
      }

      if (/\.edit$/.test(toState.name)) {
        Baguette.find(toParams.id)
          .then(function (item) {
            vm.currentItem = item;
          });
      } else {
        vm.currentItem = false;
      }

    });

    $scope.$watch('windowWidth', function (windowWidth) {

      windowWidth < 600 ? vm.useMobile = true : vm.useMobile = false;
      windowWidth < 800 ? vm.addButtonBreakPoint = true : vm.addButtonBreakPoint = false;

    });

    $scope.$on('$destroy', subscription);

    VSHelper.watchForGroupSize($scope, 50, 250, setChunks);

  }

}());
