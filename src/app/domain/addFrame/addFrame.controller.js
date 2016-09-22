'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('AddFrameController', AddFrameController)
  ;

  function AddFrameController(Baguette, Schema, Article, $scope, $state, ToastHelper) {

    var vm = this;
    var FrameSize = Schema.model('FrameSize');
    var unique = true;

    if ($state.params.id) {
      var reverted = false;
      vm.id = $state.params.id;
      vm.editState = true;

      Article.find(vm.id).then(function (frame) {
        vm.frame = frame;
        Baguette.find(vm.frame.baguetteId).then(function (data) {
          vm.selectedBaguette = data;
        });
      });

    }

    Baguette.findAll();
    Baguette.bindAll({}, $scope, 'vm.baguettes');

    Article.findAll();
    Article.bindAll({}, $scope, 'vm.frames');

    FrameSize.findAll();
    FrameSize.bindAll({}, $scope, 'vm.frameSizes');

    function checkParams () {
      vm.paramsCheck = vm.frame.frameSizeId && vm.frame.name && vm.frame.packageRel && unique && vm.frame.highPrice;
    }

    function hasChanges() {
      if (!vm.id) {
        return;
      }
      checkParams();
      return Article.hasChanges(vm.id);
    }

    function cancelChanges() {
      if (hasChanges()) {
        unique = reverted = true;
        return Article.revert(vm.frame);
      }
    }

    $scope.$on('$destroy', cancelChanges);

    angular.extend(vm, {

      frame: Article.createInstance(),
      saved: false,
      hasChanges,
      cancelChanges,

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
        });

      },

      clearForm: function () {
        vm.selectedBaguette = '';
        vm.frame = Article.createInstance();
        vm.dupMessage = '';
        checkParams();
      },

      checkAttrs: function () {
        var params = {};

        _.assign(params, {baguetteId: vm.frame.baguetteId}, {frameSizeId: vm.frame.frameSizeId});

        if (params.baguetteId && params.frameSizeId) {
          Article.findAll(params).then(function (data) {

            if (data.length) {
              ToastHelper.showToast('Такая рамка уже существует', false, vm);
              unique = false;
            } else {
              vm.dupMessage = '';
              unique = true;
            }

            checkParams();

          });
        }
      },

      saveFrame: function () {

        Article.create(vm.frame).then(function () {
          ToastHelper.showToast('Рамка сохранена', true);
          if (!vm.editState) {
            vm.clearForm();
          }

        }).catch(function (obj) {

          if (obj.status == '500') {
            ToastHelper.showToast('Ошибка. Рамка не сохранена', false, vm);
          } else {
            ToastHelper.showToast('Ошибка. Обратитесь в тех. поддержку', false, vm);
          }

        });

        $scope.frameAttrsForm.$setUntouched();
      }

    });

    $scope.$watchGroup(['vm.frame.frameSizeId', 'vm.frame.baguetteId'], function (nv, ov) {

      if ((nv != ov) && hasChanges() && !reverted) {
        vm.checkAttrs();
      } else {
        reverted = false;
      }

    });

    $scope.$watch('vm.frame', function () {

      checkParams();

      if (vm.selectedBaguette) {
        vm.refreshName();
      }
    }, true);

  }

}());
