'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('AddFrameController', AddFrameController)
  ;

  function AddFrameController(Baguette, Schema, Article, $scope, $state, ToastHelper, $q) {

    var vm = this;
    var FrameSize = Schema.model('FrameSize');
    var BackMount = Schema.model('BackMount');
    var Screening = Schema.model('Screening');
    var ArticleFrameSize = Schema.model('ArticleFrameSize');

    var unique = true;

    angular.extend(vm, {

      frame: Article.createInstance(),
      saved: false,
      articleFrameSizes: [],
      saveLabel: 'Сохранить новую рамку',

      multiTypes: [
        {id: 'passePartout', name: 'Мульти-паспарту'},
        {id: 'multiFrame', name: 'Мульти-Багет'}
      ],

      save,
      checkAttrs,
      hasChanges,
      cancelChanges,
      addArticleFrameSize,
      articleFrameSizeDecrement,
      clearForm

    });

    if ($state.params.id) {
      var reverted = false;
      vm.id = $state.params.id;
      vm.editState = true;

      Article.find(vm.id)
        .then(function (frame) {
          vm.frame = frame;
          initArticleFrameSizes();
        });

      vm.saveLabel = 'Сохранить';
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


    if (vm.id) {
      $scope.$on('$destroy', cancelChanges);
    }

    $scope.$watch('vm.extraFrameSizeId', addArticleFrameSize);
    $scope.$watchGroup(['vm.frame.frameSizeId', 'vm.frame.baguetteId'], function (nv, ov) {

      if ((nv != ov) && hasChanges() && !reverted) {
        vm.checkAttrs();
      } else {
        reverted = false;
      }

    });

    $scope.$watch('vm.frame', function () {
      checkParams();
      // refreshName();
    }, true);

    function initArticleFrameSizes() {
      vm.articleFrameSizes = vm.frame.articleFrameSizes || [];
    }

    function checkParams() {
      vm.paramsCheck = vm.frame.frameSizeId &&
        vm.frame.name &&
        vm.frame.packageRel &&
        unique &&
        vm.frame.highPrice &&
        (!vm.frame.multiType || _.find(vm.articleFrameSizes, afs => afs.count))
      ;
    }

    function hasChanges() {
      checkParams();
      return !vm.id ? _.get($scope,'frameAttrsForm.$dirty') :
        Article.hasChanges(vm.id) ||
        _.find(vm.articleFrameSizes, afs => !afs.id || ArticleFrameSize.hasChanges(afs.id));
    }

    function cancelChanges() {
      if (vm.id && hasChanges()) {
        unique = reverted = true;
        vm.dupMessage = false;
        initArticleFrameSizes();
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
      afs.count = afs.count - 1;
      if (afs.count < 1 && !afs.id) {
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
            frameSizeId: vm.extraFrameSizeId,
            count: 1
          });
          vm.articleFrameSizes.push(afs);
        }

        vm.extraFrameSizeId = null;

      }
    }

    function save () {

      Article.create(vm.frame)
        .then(article => {
          return $q.all(_.map(vm.articleFrameSizes,afs => {

            if (!vm.frame.multiType) {
              return afs.id ? ArticleFrameSize.destroy(afs.id) : $q.resolve();
            } else if (afs.count && (!afs.id || ArticleFrameSize.hasChanges(afs.id))) {
              return ArticleFrameSize.create(_.assign(afs, {articleId: article.id}));
            } else if (afs.id) {
              return ArticleFrameSize.destroy(afs.id);
            }

            return $q.reject('Invalid articleFrameSizes');

          }));
        })
        .then(function () {
          clearForm();
          ToastHelper.success('Рамка сохранена');
        })
        .catch(() => ToastHelper.error('Ошибка. Рамка не сохранена'));
    }

    function checkAttrs() {
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
    }

    function clearForm () {
      if (!vm.editState) {
        vm.frame = Article.createInstance();
      }
      vm.dupMessage = false;
      unique = true;
      initArticleFrameSizes();
      $scope.frameAttrsForm.$setUntouched();
      $scope.frameAttrsForm.$setPristine();
      checkParams();
    }

  }

}());
