<template>
  <div>
    <div v-for="crate in crateList" :key="crate.id" class="field notification is-primary roulette">
      <div class="start">
        <b class="item">
          {{ crate.name }}
        </b>
      </div>
      <div class="middle">
        <small>
          покупка: {{ crate.buy }}
        </small>
        <small>
          продажа: {{ crate.sell }}
        </small>
      </div>
      <b-button
        tag="router-link"
        type="is-primary"
        inverted
        class="end"
        :to="`/roulette/${crate.id}`"
      >
        Открыть
      </b-button>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    crate: false,
    crateList: []
  }),
  computed: {
    servers () {
      // return
      return (this && this.$store && this.$store.getters['config/config'].servers) || []
    }
  },
  mounted () {
    this.crate = this.$ws.subscribe('client/roulette')
    this.crate.on('ready', (data) => {
      this.crate.emit('crateList', 1)
    })
    this.crate.on('error', (data) => {
      console.log(data)
    })
    this.crate.on('crateList', (data) => {
      this.crateList = data
    })
  },
  methods: {
  },
  destroyed () {
    this.crate.close()
  }
}
</script>

<style lang="scss" scoped>
  .roulette {
    display: flex;
    padding: 1em;
    .start {
      flex: 0.4;
      align-items:center;
      display: flex;
      .item {
        align-self: center;
      }
    }
    .middle {
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .end {
      justify-content: flex-end;
    }
  }
</style>
