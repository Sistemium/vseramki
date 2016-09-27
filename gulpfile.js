require('sistemium-gulp')
  .config({
    ngModule: 'vseramki',
    browserSync: {
      port: 3004,
      ui: {
        port: 3005
      },
      ghostMode: false
    },
    build: {
      replace: {
        css: {
          'url(MaterialIcons': 'url(../fonts/MaterialIcons'
        }
      }
    }
  })
  .run(require('gulp'));
