'use strict';

(function () {

  function BaguettesController(Schema, $filter, AuthHelper, $scope, $q, $state, Helpers) {

    const filter = $filter('filter');

    var vm = this;

    var {ImageHelper, VSHelper, ToastHelper, AlertHelper, TableHelper, ControllerHelper} = Helpers;

    var {
      Brand,
      Material,
      Colour,
      BaguetteImage,
      Baguette
    } = Schema.models();

    var chunkSize;
    var unbindBaguettes;

    var baguetteFilter = {
      orderBy: [
        ['ts', 'DESC']
      ]
    };

    _.assign(vm, {

      filteredBaguettes: [],
      rootState: 'baguettes',
      selected: [],
      pagination: TableHelper.pagination(),
      onPaginate: TableHelper.setPagination,

      isAdmin: AuthHelper.isAdmin(),

      showImageDialog: ImageHelper.mdDialogHelper(
        function (imsImg, id) {
          BaguetteImage.create(
            angular.extend(imsImg, {
              baguetteId: id
            }));
        }),

      deleteBaguette,
      goToCreateBaguette,
      changeBaguette,
      addPhotoClick,

      resetFilters: () => vm.search = '',
      resetCheckedBaguette: () => vm.selected = [],
      editBaguette: item => $state.go('.edit', {id: item.id})

    });

    /*

     Init

     */

    $q.all([
      Colour.findAll(),
      Material.findAll(),
      Brand.findAll(),
      BaguetteImage.findAll()
    ]);

    Baguette.findAll()
      .then(function (baguettes) {
        vm.baguettes = baguettes;
        setFiltered();
      });

    /*

     Listeners

     */

    $scope.$watch('vm.search', setFiltered);

    var un = $scope.$on('baguetteRefresh', function (e, a) {
      rebind(_.assign({}, baguetteFilter, a));
    });

    $scope.$on('$destroy', un);

    ControllerHelper.setup(vm, $scope, (toState, toParams) => {

      if (vm.isRootState || !unbindBaguettes) {
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

    VSHelper.watchForGroupSize($scope, 50, 250, setChunks);

    /*

     Functions

     */

    function addPhotoClick(event) {
      $scope.$broadcast('addPhotoClick', event);
    }


    function setFiltered(search) {

      if (!search) {
        vm.filteredBaguettes = vm.baguettes;
      } else {
        var re = new RegExp(_.escapeRegExp(search), 'ig');
        vm.filteredBaguettes = filter(vm.baguettes, (value) => {
          return re.test(value.name) || re.test(value.code) || value.id === search;
        });
      }

      setChunks(chunkSize);
    }

    function setChunks(nv) {
      chunkSize = nv;
      vm.chunked = _.chunk(vm.filteredBaguettes, nv);
    }

    function rebind(filter) {
      if (unbindBaguettes) {
        unbindBaguettes();
      }
      // TODO: check tiles flickering after nth delete
      unbindBaguettes = Baguette.bindAll(filter, $scope, 'vm.baguettes', () => {
        setFiltered(vm.search);
      });
    }

    function deleteBaguette(item, $event) {

      var promise = AlertHelper.showConfirm($event);

      promise.then(function (answer) {
        if (answer) {
          var itemIndex = _.findIndex(vm.filteredBaguettes, item);
          var q = _.isArray(item)
            ? $q.all(_.map(item, itm => Baguette.destroy(itm)))
            : Baguette.destroy(item).then(()=>{
                var newItem = _.get(vm.filteredBaguettes, (itemIndex || 2) - 1);
                if (newItem) {
                  $state.go('.', {id: newItem.id});
                } else {
                  $state.go('^');
                }
              })
            ;
          q.then(()=> {
            ToastHelper.success('Багет удален');
          }, () => {
            ToastHelper.error('Ошибка. Не удалось удалить');
          });
        }
      });

    }

    function goToCreateBaguette(parent) {
      var re = new RegExp(`${vm.rootState}\.([^.]+)`);
      var currentState = parent || _.last($state.current.name.match(re));
      $state.go(`${vm.rootState}.${currentState}.create`);
    }

    function changeBaguette(bag) {
      var newState = $state.current.name;

      newState = newState.replace(/\.(edit|create)$/, '') + '.edit';

      $state.go(newState, {id: bag.id});
    }

  }

  angular
    .module('vseramki')
    .controller('BaguettesController', BaguettesController);

}());
