<template lang="pug">
  div
    .block(v-if="lastOnline !== null")
      .columns.is-multiline
        .column.is-6(v-for="(server, key) in lastOnline" :key="key")
          .box(v-if="server.online")
            .field
              center
                b {{ server.name }} - {{ server.online.players }} из {{ server.online.max_players }} игроков
            .field
              progress(
                class="progress"
                :class="server.online.class"
                :value="server.online.players / server.online.max_players * 100"
                max="100"
              )
            .field
              a(
                class="button is-fullwidth"
                target="_blank"
                :href="`steam://connect/${server.online.ip}`"
              ) Присоединиться к серверу
            .field(v-if="server.online.workshop")
              b Контент сервера
              .columns.is-mobile
                .column.is-half
                  a(
                    class="button is-fullwidth is-success is-light"
                    target="_blank"
                    :href="`https://steamcommunity.com/sharedfiles/filedetails/?id=${server.online.workshop.hd}`"
                  ) HD
                .column.is-half
                  a(
                    class="button is-fullwidth is-warning is-light"
                    target="_blank"
                    :href="`https://steamcommunity.com/sharedfiles/filedetails/?id=${server.online.workshop.low}`"
                  ) Standart
          .box(v-else)
            .field
              center
                b {{ server.name }} - информация недоступна
    .block
      .box(v-if="lastNews")
        div
          b {{ lastNews.title }}
        div
          i {{ $moment().local().to(lastNews.published_at) }}
</template>

<script>
import _ from 'lodash'

export default {
  name: 'HomePage',

  data: () => ({
    lastNews: false,
    lastOnline: null,
    timerOnline: null
  }),

  mounted () {
    this.$axios.get('/api/index')
      .then((res) => {
        this.lastNews = res.data.lastNews
      })
    this.online()
    this.timerOnline = setInterval(() => {
      this.online()
    }, 1000 * 60)
  },
  beforeDestroy () {
    clearInterval(this.timerOnline)
  },
  methods: {
    online () {
      this.$axios.get('/api/servers/online')
        .then(({ data }) => {
          this.lastOnline = []
          _.each(data, (server) => {
            this.lastOnline.push({
              name: server.name,
              online: server.online
            })
          })
        })
    }
  }
}
</script>
