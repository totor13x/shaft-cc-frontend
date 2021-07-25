
export default {
  SAVE_CONFIG (state, { config }) {
    state.config = config
  },
  SAVE_TAGS (state, { tags, checksum }) {
    state.tags = tags
    state.tags_checksum = checksum
  }
}
