'use strict';

(function () {

  angular
    .module('vseramki')
    .service('FrameSize', FrameSize)
    .run(function (FrameSize) {
      FrameSize.findAll();
    })
  ;

  function FrameSize(Schema) {

    return Schema.register({

      labels: {
        plural: 'Размеры',
        what: 'размер'
      },

      columns: [
        {
          name: 'name',
          title: 'Имя',
          validators: {
            'ng-pattern': /^[\d]{1,3}x[\d]{1,3}$/,
            maxlength: 7
          }
        },{
          name: 'isoCode',
          title: 'Код ISO',
          validators: {
            'ng-pattern': /^[ABCD]\d$/,
            maxlength: 2
          }
        }
      ],

      name: 'FrameSize',

      relations: {
        hasMany: {
          Article: {
            localField: 'articles',
            foreignKey: 'frameSizeId'
          },
          ArticleFrameSize: {
            localField: 'articleFrameSizes',
            foreignKey: 'frameSizeId'
          }
        }
      },

      nameFormatter: function(name) {
        return _.replace(name,'х','x');
      },

      sorter: function (a, b) {
        return a.split('x')[0] - b.split('x')[0] || a.split('x')[1] - b.split('x')[1];
      }

    });

  }

}());
