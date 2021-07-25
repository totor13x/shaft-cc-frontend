import Ws from '@adonisjs/websocket-client'
import { ToastProgrammatic as Toast } from 'buefy'

export default ({ $bus, store, env }, inject) => {
  console.log(env.ADONIS_URL, env)
  const ws = Ws(env.ADONIS_URL, {
    path: env.ADONIS_PATH || 'ws'
  })

  ws._extendedQuery.api_token = store.getters['auth/token']

  ws.connect()
  ws.on('open', (me) => {
    ws.global = ws.subscribe('global')
    ws.global.on('error', (message) => {
      console.log(message)
    })
    ws.global.on('user:online', (data) => {
      // $bus.$nextTick(() => {
      $bus.$emit('user:online', data)
      //   console.log(data, '--')
      // })
      // this.$nuxt
    })
    ws.global.on('user:notify', (data) => {
      Toast.open({
        duration: 5000,
        message: data.message,
        position: 'is-bottom',
        queue: false,
        type: data.type || 'is-info'
      })
    })
  })
  ws.on('close', () => {
    ws.global.close()
  })
  inject('ws', ws)
}
