<template lang="pug">
  div(v-if="data")
    .block
      .columns.has-text-centered
        .column
          .has-text-weight-bold STEAMID64
          div {{ data.steamid }}
        .column
          .has-text-weight-bold STEAMID32
          div {{ data.steam_id32 }}
    .block(v-if="data.locks_count != 0")
      .notification.is-danger.is-light(v-for="(lock, key) in data.locks" :key="key")
        | Имеет блокировку&nbsp;
        b {{lock.type}}&nbsp;
        span(v-if="lock.length == 0") навсегда&nbsp;
        span(v-else) {{ $moment().local().to(lock.unlocked_at) }}&nbsp;
    .block(v-if="data.roles_count != 0")
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
    .block
      .columns
        .column.is-4
          nav.panel.field
            p.panel-heading Список команд
            a.panel-block(@click="openTab(false)") Блокировки

            a.panel-block(
              v-for="(tab, key) in tabs"
              :key="`tab-${key}`"
              v-permission="tab.permission"
              @click="openTab(tab.slug)"
            ) {{tab.name}}
        .column
          .box(v-if="!isComponent") 123
          .box(v-else)
            component(
              :is="isComponent"
              :user-id="$route.params.id"
              :v-permission="permission"
            )
  div(v-else) loadinfo
  //- div {{ $route.params.id }}
</template>
<script>
/* eslint-disable no-unused-vars */
import _ from 'lodash'

const tabs = {
  roles: {
    component: () => import('~/components/admin/user/roles'),
    name: 'Выдача ролей',
    slug: 'roles',
    permission: 'ap-mng-user-role'
  },
  ips: {
    component: () => import('~/components/admin/user/ips'),
    name: 'Все IP',
    slug: 'ips',
    permission: null
  }
}

export default {
  components: _.mapValues(tabs, 'component'),
  data: () => ({
    data: false,
    tabs,
    isComponent: false
  }),
  mounted () {
    this.$axios.get(`/api/admin/user/${this.$route.params.id}`)
      .then(({ data }) => {
        this.data = data.data
      })
  },
  methods: {
    openTab (tab) {
      this.isComponent = tab
    }
  }
}
</script>
