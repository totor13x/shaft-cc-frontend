
export default {
  saveToken ({ commit, dispatch }, payload) {
    commit('SAVE_TOKEN', payload)
  },

  async fetchUser ({ commit }) {
    try {
      const { data } = await this.$axios.get('/api/user')
      commit('FETCH_USER_SUCCESS', { user: data })
    } catch (e) {
      console.log(e)
      commit('FETCH_USER_FAILURE')
    }
  },

  updateUser ({ commit }, payload) {
    commit('UPDATE_USER', payload)
  },

  async logout ({ commit }) {
    try {
      await this.$axios.post('/api/logout')
    } catch (e) { }

    commit('LOGOUT')
  },

  async fetchOauthUrl (ctx, { provider }) {
    const { data } = await this.$axios.post(`/api/oauth/${provider}`)

    return data.url
  }
}
