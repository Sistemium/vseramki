require('sistemium-gulp')
  .config({
    ngModule: 'vseramki',
    browserSync:{
      port: 3004,
      ui: {
        port: 3005
      }
    }
  })
  .run(require('gulp'));
