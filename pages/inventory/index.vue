<template lang="pug">
  div
    .tile.is-ancestor.block
      .tile.is-parent
        .tile.is-clickable.is-child.notification.p-5(@click="openLink('/inventory/online')")
          article.content.has-text-centered
            .is-size-5.has-text-weight-light
              | Последний вход
            .is-size-3.has-text-weight-bold(v-if="data.last_online")
              | [{{data.last_online.server_short_name}}] {{data.last_online.start}}
            .is-size-3.has-text-weight-bold(v-else)
              | Отсутствует
      .tile.is-parent
        .tile.is-clickable.is-child.notification.p-5(@click="openLink('/inventory/tts')")
          article.content.has-text-centered
            .is-size-5.has-text-weight-light
              | Плюшек
            .is-size-3.has-text-weight-bold
              | {{data.tts_balance}}
      .tile.is-parent
        .tile.is-clickable.is-child.notification.p-5(@click="openLink('/inventory/photos')")
          article.content.has-text-centered
            .is-size-5.has-text-weight-light
              | Изображений
            .is-size-3.has-text-weight-bold
              | {{ data.photos_count }}
    .block(v-if="data.is_premium")
      .notification.is-black.is-premium
        | У тебя есть&nbsp;
        b PREMIUM.&nbsp;
        | Он истекает&nbsp;
        b {{ $moment().local().to(data.premium_at) }}&nbsp;
        | Если хочешь его продлить, то стоит заглянуть в&nbsp;
        b
          router-link(to='/donate/tts') ТТС-магазин <3
    .block
      .notification.is-success.is-light(v-for="(role, key) in data.roles" :key="key")
        | Имеет роль&nbsp;
        b {{role.role.name}}&nbsp;
        span(v-if="role.serverable")
          | на сервере&nbsp;
          b {{ role.serverable.server.beautiful_name}}&nbsp;
        span(v-else)
          | без серверной принадлежности&nbsp;
        span(v-if="role.timeable")
          | до&nbsp;
          b {{ $moment().local().to(role.timeable.ended_at) }}&nbsp;
        span(v-else)
          | навсегда&nbsp;
      .notification.is-danger.is-light(
        v-for="(lock, key) in data.locks"
      )
        | У тебя блокировка <b>{{ lock.type }}</b> до <b>{{ $localTime(calculateTimeLocketAt(lock.locked_at, lock.length)) }}</b> - №{{ lock.lock_id }}
    .block
      router-link(to="/inventory/craft") Открыть страницу крафта
    .block
      router-link(to="/inventory/tracks") Количество треков - <b>{{ data.tracks_count }}</b>
    .block Количество тегов - <b>123</b>
</template>
<script>
export default {
  data: () => ({
    data: []
  }),
  computed: {
    calculateTimeLocketAt () {
      return (time, length) => this.$moment(time).add(length, 'seconds')
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.$axios.get('/api/inventory')
        .then(({ data }) => {
          this.data = data
        })
    },
    openLink (link) {
      this.$router.push(link)
    }
  }
}
</script>
<style lang="scss" scoped>
  .is-premium {
    background: rgba(116, 171, 196, 1);
    animation: background 5s infinite alternate;
  }

  @keyframes background {
    50% {
    background: rgba(116, 171, 196, 1);
      box-shadow: 0 -200px 100px -100px rgba(143, 217, 234, 1) inset;
    }
  }
</style>
