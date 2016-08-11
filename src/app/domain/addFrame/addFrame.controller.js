(function () {
  'use strict';

  angular
    .module('vseramki')
    .controller('AddFrameController', AddFrameController)
  ;

  function AddFrameController(Baguette, Schema, Article, $mdToast, $window) {

    var vm = this;

    var FrameSize = Schema.model('FrameSize');
    var el = $window.document.getElementsByClassName('toolbar-fixed-top');

    Baguette.findAll()
      .then(function (baguette) {
        vm.baguettes = baguette;
      });

    FrameSize.findAll().then(function (data) {
      vm.frameSizes = data
    });


    angular.extend(vm, {

      baguette: false,
      article: Article.createInstance(),

      selectBaguette: function (data) {
        vm.baguette = data;
        vm.article.baguetteId = data.id;
        vm.article.name = 'Рамкa ' + data.material.name + ' ' + '\"' + data.brand.name + '\"' + ' ' + data.colour.name + ' ';
      },

      saveClickedOption: function (obj, id) {
        vm.article[id] = obj.id;
        vm.article.name += obj.name;
      },

      deleteParams: function () {
        vm.baguette = false;
        vm.article = Article.createInstance();
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
        vm.article.name += '\/' + vm.article.packageRel;

        Article.create(vm.article).then(function () {

          vm.showToast('Рамка сохранена', true);
          vm.deleteParams();

        }).catch(function (obj) {

          if (obj.status == '500') {
            vm.showToast('Ошибка. Багет не сохранен', false);
          } else {
            vm.showToast('Ошибка. Обратитесь в тех. поддержку', false);
          }

        });
      }
    });
  }

}());
