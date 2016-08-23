require('sistemium-gulp')
  .config({
    ngModule: 'vseramki',
    port: 3004,
    ui: {
      port: 3005
    }
  })
  .run(require('gulp'));
