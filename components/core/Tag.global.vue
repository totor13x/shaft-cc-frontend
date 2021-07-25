<template>
  <span v-if="html != null" v-html="html" />
</template>

<script>
/* eslint-disable vue/no-v-html */
export default {
  name: 'Tag',
  props: {
    tagId: {
      type: String,
      default: null
    }
  },
  computed: {
    html () {
      return (this && this.$store && this.$store.getters['config/tags'][this.tagId]) || null
    }
  }
}
</script>
