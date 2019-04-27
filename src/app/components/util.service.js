(function () {

  function util() {
    return {
      searchRe(search) {
        let normalized = _.replace(_.toLower(search), /[ ]+/g, ' ');
        normalized = _.replace(normalized, /["']/g, '');
        const research = _.map(_.escapeRegExp(normalized), l => {
          switch (l) {
            case ' ':
              return '.+';
            case 'е':
            case 'ё':
              return '[её]';
            case 'и':
            case 'й':
              return '[ий]';
            default: return l;
          }
        }).join('');
        return new RegExp(research, 'i');
      }
    };
  }

  angular.module('vseramki')
    .service('util', util);

})();
