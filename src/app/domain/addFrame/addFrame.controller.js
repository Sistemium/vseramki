(function () {
  'use strict';

  angular
    .module('vseramki')
    .controller('AddFrameController', AddFrameController)
  ;

  function AddFrameController(Baguette, Schema, Article, $mdToast, $window, $scope, $timeout) {

    var vm = this;

    var FrameSize = Schema.model('FrameSize');
    var el = $window.document.getElementsByClassName('toolbar-fixed-top');

    Baguette.findAll();
    Baguette.bindAll({}, $scope, 'vm.baguettes');

    Article.findAll();
    Article.bindAll({}, $scope, 'vm.frames');

    FrameSize.findAll();
    FrameSize.bindAll({}, $scope, 'vm.frameSizes');

    angular.extend(vm, {

      frame: Article.createInstance(),
      saved: false,

      refreshName: function () {
        vm.frame.name =
          'Рамкa ' +
          vm.selectedBaguette.material.name + ' ' + '\"' + vm.selectedBaguette.brand.name + '\"' + ' ' +
          vm.selectedBaguette.colour.name + ' ' +
          (_.get(vm.frame, 'frameSize.name') || '') + ( _.get(vm.frame, 'packageRel') ? '/' + _.get(vm.frame, 'packageRel') : '');
      },

      useClickedBaguette: function () {
        Baguette.find(vm.frame.baguetteId).then(function (data) {
          vm.selectedBaguette = data;
          vm.refreshName();

          if (vm.frame.frameSizeId) {
            vm.checkAttrs();
          }

        });

      },

      deleteParams: function () {
        vm.selectedBaguette = '';
        vm.frame = Article.createInstance();
        vm.dupMessage = '';
        vm.paramsCheck = false;
      },

      checkAttrs: function () {
        var params = {};

        _.assign(params, {baguetteId: vm.frame.baguetteId}, {frameSizeId: vm.frame.frameSizeId});

        if (params.baguetteId) {
          Article.findAll(params).then(function (data) {
            if (data.length) {
              vm.paramsCheck = false;
              vm.dupMessage = 'Такая рамка уже существует';
              vm.showToast(vm.dupMessage, false);
              vm.unique = false;
            } else {
              vm.dupMessage = '';
              vm.paramsCheck = vm.frame.frameSizeId && vm.frame.name && vm.frame.packageRel;
              vm.unique = true;
            }
          });
        }
      },

      showToast: function (resStr, status) {
        var theme;

        if (status) {
          theme = 'success-toast';
        } else {
          theme = 'fail-toast';
          vm.dupMessage = '';
          $timeout(function () {
            vm.dupMessage = resStr;
          }, 2500);
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

    $scope.$watch('vm.frame.frameSizeId', function (nv, ov) {
      if (nv != ov) {
        vm.checkAttrs();
      }
    });

    $scope.$watch('vm.frame', function () {
      vm.paramsCheck = vm.frame.frameSizeId && vm.frame.name && vm.frame.packageRel && vm.unique;
      if (vm.selectedBaguette) {
        vm.refreshName()
      }
    }, true);

  }

}());
