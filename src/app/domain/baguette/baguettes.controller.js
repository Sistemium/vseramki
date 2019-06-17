'use strict';

(function () {

  function BaguettesController(Schema, $filter, $scope, $q, $state, Helpers, ExportExcel) {

    const filter = $filter('filter');
    const orderBy = $filter('orderBy');

    const {VSHelper, ToastHelper, AlertHelper, ControllerHelper, util} = Helpers;

    const vm = ControllerHelper.setup(this, $scope, onStateChange)
      .use(Helpers.TableHelper)
      .use(Helpers.AuthHelper);

    const {
      Brand,
      Material,
      Colour,
      // BaguetteImage,
      Baguette,
      Article,
    } = Schema.models();

    let chunkSize;
    let unbindBaguettes;
    let lockArticlesScroll;

    const baguetteFilter = {
      orderBy: [
        ['ts', 'DESC']
      ]
    };

    vm.use({

      filteredBaguettes: [],
      rootState: 'baguettes',
      selected: [],

      onEnter,
      deleteClick,
      addClick,
      sideNavListItemClick: changeBaguette,
      editClick: () => $state.go(`${$state.current.parent.name}.edit`, {id: vm.currentItem.id}),

      resetFilters: () => vm.search = '',
      resetCheckedBaguette: () => vm.selected = [],
      showBaguette: item => $state.go('.view', {id: item.id}),
      editBaguette: item => $state.go('.edit', {id: item.id}),
      fileUploadClick: () => $state.go('import', {model: 'Baguette'}),
      fileDownloadClick: () => {
        const baguettes = orderBy(vm.filteredBaguettes, vm.orderBy);
        ExportExcel.exportArrayWithConfig(baguettes, Baguette.meta.exportConfig, 'Багеты');
      }

    });

    /*

     Init

     */

    Baguette.findAll({limit: 3000})
      .then(baguettes => {
        vm.baguettes = baguettes;
        return $q.all([
          Colour.findAll(),
          Material.findAll(),
          Brand.findAll(),
          // BaguetteImage.findAll(),
          Article.findAll({limit: 3000}),
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

    const un = $scope.$on('baguetteRefresh', function (e, a) {
      rebind(_.assign({}, baguetteFilter, a));
    });

    $scope.$on('$destroy', un);


    VSHelper.watchForGroupSize($scope, 50, 250, setChunks);

    /*

     Functions

     */

    function onEnter() {
      $state.go('^');
    }

    function onStateChange(toState, toParams) {

      if (vm.isRootState || !unbindBaguettes) {
        rebind(baguetteFilter);
      }

      if (/\.(edit|view)$/.test(toState.name)) {
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

        const re = util.searchRe(search);
        const codeRe = new RegExp(`^${_.escapeRegExp(search)}$`, 'i');

        vm.filteredBaguettes = filter(vm.baguettes, baguette => {

          if (search === '/invalid') {
            return !baguette.isValid;
          }

          if (search === '/no_picture') {
            return !baguette.pictures;
          }

          return re.test(baguette.name)
            || codeRe.test(baguette.code)
            || codeRe.test(baguette.codeExternal)
            || re.test(_.get(baguette, 'material.name'))
            || re.test(_.get(baguette, 'colour.name'))
            || baguette.id === search;

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
      const id = vm.id;
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

      const item = vm.currentItem;

      const promise = AlertHelper.showConfirm($event);

      promise.then(function (answer) {
        if (answer) {
          const itemIndex = _.findIndex(vm.filteredBaguettes, item);
          const q = _.isArray(item)
            ? $q.all(_.map(item, itm => Baguette.destroy(itm)))
            : Baguette.destroy(item).then(() => {
              const newItem = _.get(vm.filteredBaguettes, (itemIndex || 2) - 1);
              if (newItem) {
                $state.go('.', {id: newItem.id});
              } else {
                $state.go('^');
              }
            })
          ;
          q.then(() => {
            ToastHelper.success('Багет удален');
          }, () => {
            ToastHelper.error('Ошибка. Не удалось удалить');
          });
        }
      });

    }

    function addClick() {
      const re = new RegExp(`${vm.rootState}\.([^.]+)`);
      const currentState = _.last($state.current.name.match(re));
      $state.go(`${vm.rootState}.${currentState}.create`);
    }

    function changeBaguette(bag) {
      const {name} = $state.current;
      const newState = name.replace(/\.(edit|create|view)$/, '') + '.view';
      lockArticlesScroll = true;
      $state.go(newState, {id: bag.id});
    }
  }

  angular
    .module('vseramki')
    .controller('BaguettesController', BaguettesController);

}());
