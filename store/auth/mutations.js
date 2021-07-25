
export default {
  SAVE_TOKEN (state, { token, remember }) {
    state.token = token
    localStorage.setItem('token', token)
  },

  FETCH_USER_SUCCESS (state, { user }) {
    state.user = user
    // console.log(this)
    this.$laravel.setRoles(user.roles)
    this.$laravel.setPermissions(user.permissions)
  },

  FETCH_USER_FAILURE (state) {
    // state.token = null
    // Cookies.remove('token')
  },

  LOGOUT (state) {
    state.user = null
    state.token = null

    localStorage.remove('token')
  },

  UPDATE_USER (state, { user }) {
    state.user = user
  }
}
