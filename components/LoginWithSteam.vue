
<template>
  <div>
    <!-- {{ url }} -->
    <button v-if="url" class="btn btn-dark ml-auto" type="button" @click="login">
      Login with
      <b-icon
        icon="account"
        size="is-small"
      />
    </button>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
export default {
  name: 'LoginWithSteam',

  computed: {
    url () {
      // console.log()
      return (this && this.$store && this.$store.getters['config/config'].steamAuth) || ''
    }
    // url: () => (this && this.$store && this.$store.getters['config/config'].steamAuth) || '' // window.config ? window.config.steamAuth : ''
    // url: () => 'https://shaft.cc'
  },

  mounted () {
    window.addEventListener('message', this.onMessage, false)
  },

  beforeDestroy () {
    window.removeEventListener('message', this.onMessage)
  },

  methods: {
    // eslint-disable-next-line require-await
    async login () {
      // const newWindow = openWindow('', 'Login')

      // const newWin = window.open('', 'hello', 'width=200,height=200')

      window.location.href = this.url
    },

    /**
     * @param {MessageEvent} e
     */
    onMessage (e) {
      if (e.origin !== window.origin || !e.data.token) {
        return
      }

      this.$store.dispatch('auth/saveToken', {
        token: e.data.token,
        remember: true
      })
      // console.log(e)
      // this.$router.push({ name: '/' })
    }
  }
}

/**
 * @param  {Object} options
 * @return {Window}
 */
function openWindow (url, title, options = {}) {
  if (typeof url === 'object') {
    options = url
    url = ''
  }

  options = { title, url, width: 600, height: 720, ...options }

  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top
  const width = window.innerWidth || document.documentElement.clientWidth || window.screen.width
  const height = window.innerHeight || document.documentElement.clientHeight || window.screen.height

  options.left = ((width / 2) - (options.width / 2)) + dualScreenLeft
  options.top = ((height / 2) - (options.height / 2)) + dualScreenTop

  const optionsStr = Object.keys(options).reduce((acc, key) => {
    acc.push(`${key}=${options[key]}`)
    return acc
  }, []).join(',')
  // console.log(optionsStr, url, title)
  const newWindow = window.open(url, title, optionsStr)
  // console.log(newWindow)
  if (window.focus) {
    newWindow.focus()
  }

  return newWindow
}
</script>
