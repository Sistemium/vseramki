(function () {

  angular.module('vseramki').component('pictures', {


    bindings: {},

    controller: picturesController,

    templateUrl: 'app/domain/pictures/pictures.html',
    controllerAs: 'vm'

  });

  function picturesController($scope, ControllerHelper, Picturing) {

    const vm = ControllerHelper.setup(this, $scope);

    vm.use({

      pictures: [],
      search: '',

      $onInit() {

        this.setBusy(refresh());

        $scope.$watch('vm.search', onSearchChange);

      },

    });


    function refresh() {

      return Picturing.findAllPictures()
        .then(pictures => {
          vm.pictures = pictures;
          onSearchChange(vm.search);
        });

    }


    function onSearchChange(search) {

      const {pictures} = vm;

      if (!search) {
        vm.filteredPictures = pictures;
      }

      const re = new RegExp(_.escapeRegExp(search));

      vm.filteredPictures = _.filter(pictures, picture => {
        const {name} = picture;
        return re.test(name);
      });

    }


  }

})();
