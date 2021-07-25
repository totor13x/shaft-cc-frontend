<template>
  <b-tooltip v-if="status != 'offline'" :label="tooltip!=''?tooltip:'Online'" :position="isMobile?'is-right':'is-top'">
    <span class="online" :style="{ background: getColor }" />
  </b-tooltip>
</template>
<script>
export default {
  name: 'OnlineStatus',
  props: {
    status: {
      type: String,
      default: 'offline'
    }
  },
  data () {
    return {
      // cached: window.dataTables.servers,
      onlineColor: '#e22c2c',
      tooltip: ''
    }
  },
  computed: {
    cached () {
      // return
      return (this && this.$store && this.$store.getters['config/config'].servers) || ''
    },
    isMobile () {
      // console.log(screen.width)
      if (screen.width <= 760) {
        return true
      } else {
        return false
      }
    },
    getColor () {
      let color = '#e22c2c'
      if (this.status === 'online') {
        color = '#29c711'
      }
      if (this.cached[this.status]) {
        const c = this.cached[this.status].color
        color = `rgb(${c.r},${c.g},${c.b})`
      }
      return color
    }
  },
  watch: {
    getColor () {
      if (this.status === null || this.status === undefined) {
        this.tooltip = 'Offline'
      } else {
        this.tooltip = this.cached[this.status]
          ? this.cached[this.status].beautiful_name
          : 'Online'
      }
    }
  }
}
</script>
<style>
  .online {
    border-radius: 100%;
    background: #000;
    width: 8px;
    height: 8px;
    margin-bottom: 8px;
    position: relative;
    display: inline-block;
    border: 1px #000 solid;
  }
</style>
