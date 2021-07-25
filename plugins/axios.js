import axios from 'axios'
import { ToastProgrammatic as Toast } from 'buefy'

export default ({ store }, inject) => {
  axios.defaults.baseURL = process.env.AXIOS_URL // 'http://127.0.0.1:8000'
  // Request interceptor
  axios.interceptors.request.use((request) => {
    const token = store.getters['auth/token']
    if (token) {
      // eslint-disable-next-line dot-notation
      request.headers.common['Authorization'] = `Bearer ${token}`
    }

    const locale = store.getters['lang/locale']
    if (locale) {
      request.headers.common['Accept-Language'] = locale
    }

    return request
  })

  axios.errorHandler = (errors) => {
    errors = errors.response.data
    if (errors.errors) {
      // console.log(errors, errors.errors)
      const messages = Object.values(errors.errors)
      messages.forEach((array) => {
        array.forEach((message) => {
          Toast.open({
            duration: 5000,
            message,
            position: 'is-bottom',
            queue: false,
            type: 'is-danger'
          })
        })
      })
    } else {
      Toast.open({
        duration: 5000,
        message: errors.message,
        position: 'is-bottom',
        queue: false,
        type: 'is-danger'
      })
    }
  }

  inject('axios', axios)
}
