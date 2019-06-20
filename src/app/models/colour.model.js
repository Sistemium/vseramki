'use strict';

(function () {

  angular
    .module('vseramki')
    .service('Colour', Colour)
    .run(function (Colour) {
      Colour.findAll()
        .then(() => Colour.meta.setMatchers());
    })
  ;

  function Colour(Schema) {

    let matchers = [];

    const model = Schema.register({

      labels: {
        plural: 'Цвета',
        what: 'цвет'
      },

      name: 'Colour',

      relations: {
        hasMany: {
          Baguette: {
            localField: 'baguettes',
            foreignKey: 'colourId'
          }
        }
      },

      computed: {
        // matcher: ['name', ],
      },

      meta: {

        setMatchers() {

          const colours = model.getAll();

          matchers = _.map(colours, ({name}) => {
            const normalized = _.replace(_.escapeRegExp(name), /ё/ig, '[её]');
            return {
              re: new RegExp(`([^a-zа-я]|^)${normalized}([^a-zа-я]|$)`, 'i'),
              name,
            };
          });

        },

        matchesString(string) {
          return _.find(matchers, ({re}) => re.test(string));
        },

      },

    });

    return model;

  }

}());
