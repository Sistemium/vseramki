'use strict';

(function () {

  function BaguettesController(Schema, $filter, AuthHelper, $scope, $q, $state, Helpers) {

    const filter = $filter('filter');

    var {VSHelper, ToastHelper, AlertHelper, TableHelper, ControllerHelper} = Helpers;

    var vm = ControllerHelper.setup(this, $scope, onStateChange);

    var {
      Brand,
      Material,
      Colour,
      BaguetteImage,
      Baguette
      } = Schema.models();

    var chunkSize;
    var unbindBaguettes;
    var lockArticlesScroll;

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

      deleteClick,
      addClick,
      sideNavListItemClick: changeBaguette,

      resetFilters: () => vm.search = '',
      resetCheckedBaguette: () => vm.selected = [],
      editBaguette: item => $state.go('.edit', {id: item.id}),
      fileUploadClick: () => $state.go('import', {model: 'Baguette'})

    });

    /*

     Init

     */

    Baguette.findAll()
      .then(baguettes => {
        vm.baguettes = baguettes;
        return $q.all([
          Colour.findAll(),
          Material.findAll(),
          Brand.findAll(),
          BaguetteImage.findAll()
        ]);
      })
      .then(() => {
        setFiltered();
        vm.ready = true;
      });

    /*

     Listeners

     */

    $scope.$watch('vm.search', setFiltered);

    var un = $scope.$on('baguetteRefresh', function (e, a) {
      rebind(_.assign({}, baguetteFilter, a));
    });

    $scope.$on('$destroy', un);


    VSHelper.watchForGroupSize($scope, 50, 250, setChunks);

    /*

     Functions

     */

    function onStateChange(toState, toParams) {

      if (vm.isRootState || !unbindBaguettes) {
        rebind(baguetteFilter);
      }

      if (/\.edit$/.test(toState.name)) {
        return Baguette.find(toParams.id)
          .then(function (item) {
            vm.currentItem = item;
            scrollToIndex();
            lockArticlesScroll = false;
          });
      } else {
        vm.currentItem = false;
      }

    }

    function setFiltered(search) {

      if (!search) {
        vm.filteredBaguettes = vm.baguettes;
      } else {
        var re = new RegExp(_.escapeRegExp(search), 'ig');
        vm.filteredBaguettes = filter(vm.baguettes, baguette => {
          if (search === 'invalid') {
            return !baguette.isValid;
          }
          return re.test(baguette.name) || re.test(baguette.code) || baguette.id === search;
        });
      }

      setChunks(chunkSize);
      scrollToIndex();

    }

    function setChunks(nv) {
      chunkSize = nv;
      vm.chunked = _.chunk(vm.filteredBaguettes, nv);
    }

    function scrollToIndex() {
      var id = vm.id;
      if (!lockArticlesScroll && id) {
        vm.articlesListTopIndex = _.findIndex(vm.filteredBaguettes, {'id': id}) - 1;
      }
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

    function deleteClick($event) {

      var item = vm.currentItem;

      var promise = AlertHelper.showConfirm($event);

      promise.then(function (answer) {
        if (answer) {
          var itemIndex = _.findIndex(vm.filteredBaguettes, item);
          var q = _.isArray(item)
              ? $q.all(_.map(item, itm => Baguette.destroy(itm)))
              : Baguette.destroy(item).then(()=> {
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

    function addClick() {
      var re = new RegExp(`${vm.rootState}\.([^.]+)`);
      var currentState = _.last($state.current.name.match(re));
      $state.go(`${vm.rootState}.${currentState}.create`);
    }

    function changeBaguette(bag) {
      var newState = $state.current.name;
      newState = newState.replace(/\.(edit|create)$/, '') + '.edit';
      lockArticlesScroll = true;
      $state.go(newState, {id: bag.id});
    }
  }

  angular
    .module('vseramki')
    .controller('BaguettesController', BaguettesController);

}());
