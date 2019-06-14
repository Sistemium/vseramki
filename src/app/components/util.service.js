(function () {

  const PICTURE_TYPES = {
    sizes: 1,
    corner: 2,
    stick: 3,
  };

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
            default:
              return l;
          }
        }).join('');
        return new RegExp(research, 'i');
      },

      pictureSizeSrc(size) {
        return name => this.escapeUrl(`https://s3-eu-west-1.amazonaws.com/vseramki/${size}/${name}`);
      },

      pictureSrc(type, size = 'thumbnails') {
        return pictures => {
          if (!pictures) {
            return '/images/placeholder.png';
          }
          return this.pictureSizeSrc(size)(pictures[type]);
        }
      },

      escapeUrl(url) {
        return url.replace(/\+/g, '%2B');
      },

      pictureImages(pictures) {
        const res = _.map(pictures, (name, type) => {
          return {
            id: type,
            type,
            ord: PICTURE_TYPES[type] || 0,
            thumbnailSrc: this.pictureSizeSrc('thumbnails')(name),
            smallSrc: this.pictureSizeSrc('small')(name),
            largeSrc: this.pictureSizeSrc('large')(name),
          }
        });
        return _.orderBy(res, 'ord');
      },

    };
  }

  angular.module('vseramki')
    .service('util', util);

})();
