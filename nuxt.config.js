// import hooks from './hooks'

export default {
  server: {
    port: 3000, // default: 3000
    host: process.env.BASE_URL || '127.0.0.1' // default: localhost
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    AXIOS_URL: process.env.AXIOS_URL,
    ADONIS_URL: process.env.ADONIS_URL,
    ADONIS_PATH: process.env.ADONIS_PATH
  },

  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Shaft.CC',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Global CSS
   */
  css: [

    // '~bulma/sass/utilities/_all',
    // 'variables',
    // 'bulma',
    // '@/assets/css/_import.scss',
    '@/assets/css/_variables.scss'
    // '@/assets/css/default-container.scss',
    // '@/assets/css/sidebar.scss'
  ],
  // styleResources: {
  //   scss: [
  //     '~assets/vars/*.scss',
  //     '~assets/abstracts/_mixins.scss'
  //   ]
  // },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '@/plugins/axios.js',
    '@/plugins/core.js',
    '@/plugins/plural.js',
    '@/plugins/permissions.core.js',
    '@/plugins/websocket.js'
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/global-components',
    '@nuxtjs/moment',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    [
      'nuxt-buefy',
      {
        materialDesignIconsHRef: '//cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css'
      }
    ]
    // '~/modules/userload.js',
    // '@nuxtjs/style-resources'
  ],

  moment: {
    locales: ['ru'],
    defaultLocale: 'ru',
    defaultTimezone: 'Europe/Moscow'
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {}
}
