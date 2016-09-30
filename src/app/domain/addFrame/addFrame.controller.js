'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('AddFrameController', AddFrameController)
  ;

  function AddFrameController(Baguette, Schema, Article, $scope, $state, ToastHelper) {

    var vm = this;
    var FrameSize = Schema.model('FrameSize');
    var BackMount = Schema.model('BackMount');
    var Screening = Schema.model('Screening');
    var ArticleFrameSize = Schema.model('ArticleFrameSize');

    var unique = true;

    if ($state.params.id) {
      var reverted = false;
      vm.id = $state.params.id;
      vm.editState = true;

      Article.find(vm.id).then(function (frame) {
        vm.frame = frame;
        vm.articleFrameSizes = vm.frame.articleFrameSizes;
      });

    } else {
      vm.articleFrameSizes = [];
    }

    Baguette.findAll();
    Baguette.bindAll({}, $scope, 'vm.baguettes');

    Article.findAll();
    Article.bindAll({}, $scope, 'vm.frames');

    FrameSize.findAll();
    FrameSize.bindAll({}, $scope, 'vm.frameSizes');

    BackMount.findAll();
    BackMount.bindAll({}, $scope, 'vm.backMounts');

    Screening.findAll();
    Screening.bindAll({}, $scope, 'vm.screenings');

    function checkParams() {
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
        vm.dupMessage = false;
        return Article.revert(vm.id);
      }
    }

    function refreshName() {

      var baguette = vm.frame.baguette;

      vm.frame.name = !baguette ? null :
        `"${baguette.brand.name}" ${_.get(vm.frame, 'frameSize.name') || ''} ${baguette.colour.name} `
      //`${baguette.material.name}` +
      //`${ || ''}`
      ;
    }

    function articleFrameSizeDecrement(afs) {
      if (-- afs.count < 1 && !afs.articleId) {
        _.remove(vm.articleFrameSizes, afs);
      }
    }

    function addArticleFrameSize() {
      if (vm.extraFrameSizeId) {

        var efs = {frameSizeId: vm.extraFrameSizeId};
        var afs = _.find(vm.articleFrameSizes, efs);

        if (afs) {
          afs.count ++;
        } else {
          afs = ArticleFrameSize.createInstance({
            // article: vm.frame,
            frameSizeId: vm.extraFrameSizeId,
            count: 1
          });
          vm.articleFrameSizes.push(afs);
        }

        vm.extraFrameSizeId = null;

      }
    }

    $scope.$on('$destroy', cancelChanges);
    $scope.$watch('vm.extraFrameSizeId', addArticleFrameSize);

    angular.extend(vm, {

      frame: Article.createInstance(),
      saved: false,
      hasChanges,
      cancelChanges,
      addArticleFrameSize,
      articleFrameSizeDecrement,

      clearForm: function () {
        vm.frame = Article.createInstance();
        vm.dupMessage = false;
        unique = true;
        $scope.frameAttrsForm.$setUntouched();
        $scope.frameAttrsForm.$setPristine();
        checkParams();
      },

      checkAttrs: function () {
        var params = {};

        _.assign(params, {baguetteId: vm.frame.baguetteId}, {frameSizeId: vm.frame.frameSizeId});

        if (params.baguetteId && params.frameSizeId) {
          Article.findAll(params).then(function (data) {

            _.remove(data, {id: vm.id});

            if (data.length) {
              vm.dupMessage = 'Такая рамка уже существует';
              unique = false;
            } else {
              vm.dupMessage = false;
              unique = true;
            }

            checkParams();

          });
        }
      },

      save: function () {

        Article.create(vm.frame)
          .then(function () {
            ToastHelper.success('Рамка сохранена');
            if (!vm.editState) {
              vm.clearForm();
            }
          }).catch(() => ToastHelper.error('Ошибка. Рамка не сохранена'));
      }

    });

    $scope.$watchGroup(['vm.frame.frameSizeId', 'vm.frame.baguetteId'], function (nv, ov) {

      if ((nv != ov) && (hasChanges() || !vm.id) && !reverted) {
        vm.checkAttrs();
      } else {
        reverted = false;
      }

    });

    $scope.$watch('vm.frame', function () {
      checkParams();
      refreshName();
    }, true);

  }

}());
