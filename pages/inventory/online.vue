<template lang="pug">
  div
    .columns
      .column.is-7
        article.panel.is-info
          p.panel-heading Последние сессии
          .panel-block(
            v-for="(data, key) in data.online"
            :key="key"
          )
            span.panel-icon.is-active
              i(class="mdi mdi-clock-outline")
            span
              | [
              span(:style="{color: getColor(data.server_id)}") {{ data.server_short_name }}
              | ]
            span
              | &nbsp;{{ data.start }}
              | -
              | {{ data.minutes }}
              | {{ $plural( 'минута_минуты_минут', data.minutes) }}
      .column
        .block.box.has-text-white.has-text-centered.has-background-info.is-size-5
          b Статистика за неделю
        .block.box.has-text-centered(v-if="data.week.length == 0")
          | Здесь как-то пусто :C
        .block.box(
          v-for="(srv, id) in data.week"
          :key="id"
        )
          div.block.has-text-centered(
            :style="{color: getColor(Number(id))}"
          )
            b.is-size-4 {{ servers[id].beautiful_name }}
          .block.has-text-weight-light.is-size-5.has-text-centered
            | {{ srv }} {{ $plural( 'час_часа_часов', srv) }}
    //- code {{ data }}
</template>
<script>
export default {
  data: () => ({
    data: {
      week: [],
      online: []
    }
  }),
  computed: {
    servers () {
      return (this && this.$store && this.$store.getters['config/config'].servers) || ''
    }
  },
  mounted () {
    this.$axios.get('/api/inventory/online')
      .then(({ data }) => {
        this.data = data
      })
  },
  methods: {
    getColor (status) {
      let color = '#e22c2c'
      const id = this.$_.find(this.servers, { id: status })
      console.log(id, status)
      if (id) {
        const c = id.color
        color = `rgb(${c.r},${c.g},${c.b})`
      }
      return color
    }
  }
}
</script>
