'use strict';

(function () {

  angular
    .module('vseramki')
    .controller('AdminController', AdminController);


  function AdminController($scope, Upload, ArticleImage, Article, $q, $state) {

    var vm = this;

    var stateFilter = {
      articleId: $state.params.articleId
    };

    function imageClick(item){
      vm.clickedImage = item;
    }

    function deletePhoto(photo){

      ArticleImage.destroy(photo).then(function(a){
        console.log(a, 'deleted.');
      });

    }

    function uploadFiles () {

      var promises = [];

      _.each(vm.files,function(f){

        var file = f.lfFile;  // for lf-ng-md-file-input. use  var file = files[i] for ng-file-upload

        console.log(file, 'file from UF function');

        if (!file.$error) {

          promises.push($q(function(resolve,reject) {

            Upload.upload({
              url: 'https://api.sistemium.com/ims/vr',
              data: {
                file: file,
                folder: 'Article'
              }
            }).then(function (resp) {

              console.log(resp);

              ArticleImage.create({
                  smallSrc: resp.data.pictures[0].src,
                  largeSrc: resp.data.pictures[1].src,
                  thumbnailSrc: resp.data.pictures[2].src,
                  articleId: vm.articleId
                })
                .then(function (res) {
                  console.log('ArticleImage saved', res);
                  resolve(res);
                },reject);

            },reject);

          }));

        }

      });

      $q.all(promises).then(function(pictures){
        console.log ('Saved pictires:', pictures.length);
        vm.files = [];
        vm.uploading = false;
      });

    }

    angular.extend(vm, {
      uploading: true,
      uploadFiles: uploadFiles,
      imageClick: imageClick,
      deletePhoto: deletePhoto
    },stateFilter);

    Article.find(vm.articleId).then(function(article){
      vm.article = article;
    });

    ArticleImage.findAll(stateFilter);

    ArticleImage.bindAll(stateFilter,$scope,'vm.articleImages');


  }

}());
