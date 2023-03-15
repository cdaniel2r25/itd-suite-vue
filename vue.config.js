module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: {
      '^/admin-bff': {
        target: process.env.VUE_APP_ADMIN_BFF_HOST,
        changeOrigin: true,
        logLevel: 'debug',
      },
      '^/mailing-bff': {
        target: process.env.VUE_APP_MAILING_BFF_HOST,
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
  },
}
