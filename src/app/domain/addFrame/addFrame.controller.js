(function () {
  'use strict';

  angular
    .module('vseramki')
    .controller('AddFrameController', AddFrameController)
  ;

  function AddFrameController(Baguette, Schema, Article, $mdToast, $window, $scope) {

    var vm = this;

    var FrameSize = Schema.model('FrameSize');
    var el = $window.document.getElementsByClassName('toolbar-fixed-top');

    Baguette.findAll()
      .then(function (baguette) {
        vm.baguettes = baguette
      });

    Article.findAll()
      .then(function (frame) {
        vm.frames = frame
      });

    FrameSize.findAll()
      .then(function (fSize) {
        vm.frameSize = fSize
      });


    angular.extend(vm, {

      frame: Article.createInstance(),

      refreshName: function () {
        vm.frame.name =
          'Рамкa ' +
          vm.selectedBaguette.material.name + ' ' + '\"' + vm.selectedBaguette.brand.name + '\"' + ' ' +
          vm.selectedBaguette.colour.name + ' ' +
          (_.get(vm.frame, 'frameSize.name') || '') + ( _.get(vm.frame, 'packageRel') ? '/' + _.get(vm.frame, 'packageRel') : '');

        vm.paramsCheck = (vm.frame.frameSizeId && vm.frame.name && vm.frame.packageRel);
        vm.paramsCheck ? vm.checkAttrs() : angular.noop()
      },

      useClickedBaguette: function () {
        Baguette.find(vm.frame.baguetteId).then(function (data) {
          vm.selectedBaguette = data;
          vm.refreshName();
        });

      },

      deleteParams: function () {
        vm.frame = Article.createInstance();
      },

      checkAttrs: function () {
        var params = {};
        _.assign(params, {baguetteId: vm.frame.baguetteId}, {frameSizeId: vm.frame.frameSizeId});


        // vm.something && vm.frame.pieceWeight then save!!!!
        
        Article.findAll(params).then(function (a, b) {
          console.log(a, b);
        });

      },

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
            .hideDelay(2000)
            .theme(theme)
            .parent(el)
        );
      },

      saveFrame: function () {


        Article.create(vm.frame).then(function () {

          vm.showToast('Рамка сохранена', true);
          vm.deleteParams();

        }).catch(function (obj) {

          if (obj.status == '500') {
            vm.showToast('Ошибка. Рамка не сохранена', false);
          } else {
            vm.showToast('Ошибка. Обратитесь в тех. поддержку', false);
          }

        });

        $scope.frameAttrsForm.$setUntouched();
      }
    });
  }

}());
