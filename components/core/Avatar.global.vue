<template>
  <vs-tooltip
    v-model="activeTooltip"
    :not-hover="clickOnly"
    bottom
    :interactivity="!clickOnly"
    border
    color="#EEEEEE"
    :class="username ? 'is-inline-block' : ''"
  >
    <span v-if="username" @click="clickOnly ? activeTooltip=!activeTooltip : null">
      {{ user.username }}
    </span>
    <vs-avatar
      v-else
      circle
      :size="size"
      :badge="user.online != 'offline'"
      :badge-color="getColor"
      @click="clickOnly ? activeTooltip=!activeTooltip : null"
    >
      <img :src="user.avatar" :alt="user.username +' avatar'">
    </vs-avatar>

    <template #tooltip>
      <div class="content-tooltip">
        <!-- {{ tooltip }}
        {{ user.online }} -->
        <div>
          <div v-if="tooltip != ''" class="field">
            <!-- {{ tooltip }} -->
            <span
              class="tag has-text-white"
              :style="{ background: getColor }"
            >
              {{ tooltip }}
            </span>
          </div>
          <div class="field">
            <vs-button transparent block style="margin:0">
              Сообщение
            </vs-button>
            <!-- <b-button
              type="is-small"
            >
              Сообщение
            </b-button> -->
          </div>
        </div>
        <slot name="extra" />
        <!-- <div class="body">
          <div class="text">
            Cosed Tasks
            <span>
              89
            </span>
          </div>
          <vs-avatar circle size="80" @click="activeTooltip1=!activeTooltip1">
            <img :src="user.avatar" :alt="user.username +' avatar'">
          </vs-avatar>
          <div class="text">
            Open Tasks
            <span>
              8
            </span>
          </div>
        </div> -->
        <!-- <footer>
          <vs-button circle icon border>
            <b-icon
              icon="account"
              size="is-small"
            />
          </vs-button>
          <vs-button circle>
            Message
          </vs-button>
          <vs-button circle icon border>
            <b-icon
              icon="account"
              size="is-small"
            />
          </vs-button>
        </footer> -->
      </div>
    </template>
  <!-- </b-tooltip> -->
  </vs-tooltip>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    size: {
      type: String,
      default: '32'
    },
    username: {
      type: Boolean,
      default: false
    },
    clickOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // cached: window.dataTables.servers,
      // onlineColor: '#e22c2c',
      tooltip: '',
      activeTooltip: false
    }
  },
  computed: {
    cached () {
      // return
      return (this && this.$store && this.$store.getters['config/config'].servers) || ''
    },
    getColor () {
      let color = '#333333'
      if (this.user) {
        if (this.user.online === 'online') {
          color = '#0278c8'
        }
        if (this.cached[this.user.online]) {
          const c = this.cached[this.user.online].color
          color = `rgb(${c.r},${c.g},${c.b})`
        }
      }
      // console.log(color, this.user.online, this.tooltip)
      return color
    }
  },
  watch: {
    getColor () {
      this.setTooltip()
      // console.log(this.user.online, this.tooltip)
    }
  },
  mounted () {
    this.$bus.$on('user:online', (data) => {
      // console.log(this.user, data)
      if (this.user && this.user.id === Number(data.user_id)) {
        this.user.online = data.on
        this.setTooltip()
      }
    })
    this.setTooltip()
  },
  beforeDestroy () {
    this.$bus.$off('user:online')
    this.activeTooltip = false
  },
  methods: {
    setTooltip () {
      this.tooltip = this.cached[this.user.online]
        ? this.cached[this.user.online].beautiful_name
        : 'Online'
      if (this.user.online === 'online') {
        this.tooltip = 'Online'
      }
      if (this.user.online === 'offline') {
        this.tooltip = ''
      }
      if (this.user.online === null || this.user.online === undefined) {
        this.tooltip = ''
      }
    }
  }
}
</script>
