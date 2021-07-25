const json = (raw) => {
  try {
    return JSON.parse(raw)
  } catch (err) {
    return {}
  }
}

export default {
  config: [],

  tags_checksum: localStorage.getItem('tags_checksum') || 0,
  tags: json(localStorage.getItem('tags'))
}
