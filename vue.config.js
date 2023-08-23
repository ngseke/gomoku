const webpack = require('webpack')
const autoprefixer = require('autoprefixer');

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        data: `@import '@/assets/css/global.sass'`,
        implementation: require('sass'),
      },
    }
  },
}
