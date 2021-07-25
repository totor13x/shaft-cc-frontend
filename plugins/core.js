/* eslint-disable object-shorthand */
import Vue from 'vue'
import * as Vuesax from 'vuesax'
import Clipboard from 'v-clipboard'
import _ from 'lodash'

import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import ru from 'vee-validate/dist/locale/ru.json'

export const bus = new Vue()

Vue.use(Vuesax)
Vue.use(Clipboard)

export default ({ app, store, $moment }, inject) => {
  app.router.afterEach((to, from) => {
    const tooltip = document.querySelectorAll('.vs-tooltip')

    tooltip.forEach((nodeDOM) => {
      document.body.removeChild(nodeDOM)
    })
  })
  // console.log('321')
  // console.log(nuxt)
  $moment.defaultFormat = 'DD.MM.YYYY в HH:mm:ss'
  // defaultFormatUtc: 'DD.MM.YYYY в HH:mm:ss'

  const ws = (label, errors) => {
    const output = []
    errors.forEach((error) => {
      if (label === error.field) {
        output.push(error.message)
      }
    })
    return output
  }

  const errors = {
    ws: ws
  }

  Vue.component('ValidationProvider', ValidationProvider)
  Vue.component('ValidationObserver', ValidationObserver)
  localize('ru', ru)

  Object.keys(rules).forEach((rule) => {
    // eslint-disable-next-line import/namespace
    extend(rule, rules[rule])
  })

  inject('errors', errors)
  inject('bus', bus)
  inject('_', _)
}
