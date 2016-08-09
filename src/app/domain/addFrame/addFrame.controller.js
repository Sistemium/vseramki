(function () {
  'use strict';

  angular
    .module('vseramki')
    .controller('AddFrame', AddFrame)
  ;

  function AddFrame(Baguette, Schema, Article, $mdToast, $window) {

    var vm = this;

    var FrameSize = Schema.model('FrameSize');
    var el = $window.document.getElementsByClassName('toolbar-fixed-top');

    Baguette.findAll()
      .then(function (baguette) {
        vm.baguettes = baguette;
      });

    FrameSize.findAll().then(function (frames) {
      vm.frameSize = frames
    });


    angular.extend(vm, {

      frameData: {},
      frameDataToWrite: {},

      selectBaguette: function (data) {
        vm.frameData = data;
        vm.bagSelected = true;
        vm.frameDataToWrite.baguetteId = data.id;
        vm.frameDataToWrite.name = 'Рамкa ' + data.material.name + ' ' + '\"' + data.brand.name + '\"' + ' ' + data.colour.name + ' ';
      },

      saveClickedOption: function (obj, id) {
        vm.frameDataToWrite[id] = obj.id;
        vm.frameDataToWrite.name += obj.name;

        vm.frameData.frameSize = obj.name;
      },

      deleteParams: function () {
        vm.frameData = {};
        vm.frameDataToWrite = {};
        vm.bagSelected = false;
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
            .hideDelay(1500)
            .theme(theme)
            .parent(el)
        );
      },

      saveFrame: function () {
        vm.frameDataToWrite.name += '\/' + vm.frameDataToWrite.packageRel;

        Article.create(vm.frameDataToWrite).then(function (article) {

          if (article) {
            vm.showToast('Рамка сохранена', true);
          }
          else {
            vm.showToast('Ошибка. Рамка не сохранена', false);
          }
          vm.deleteParams();

        }).catch(function (obj) {

          if (obj.status == '500') {
            vm.showToast('Ошибка. Багет не сохранен', false);
          } else {
            vm.showToast('Ошибка. Обратитесь в тех. поддержку', false);
          }

          vm.deleteParams();

        });
      }
    });
  }

}());
