
export default {
  saveConfig ({ commit, dispatch }, payload) {
    commit('SAVE_CONFIG', payload)
  },
  async fetchTags ({ commit }) {
    try {
      const { data: dataChecksum } = await this.$axios.get('/api/cache/tags_checksum')
      if (localStorage.getItem('tags_checksum') !== dataChecksum) {
        const { data: dataTags } = await this.$axios.get('/api/cache/tags')
        localStorage.setItem('tags', JSON.stringify(dataTags))
        localStorage.setItem('tags_checksum', dataChecksum)
        commit('SAVE_TAGS', {
          tags: dataTags,
          checksum: dataChecksum
        })
      }
    } catch (e) {
      console.log('Unkn err')
    }
  }
}
