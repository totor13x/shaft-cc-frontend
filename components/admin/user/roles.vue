<template lang="pug">
  div
    .block
      div(v-for="(role, key) in gived" :key="key")
        .columns.is-mobile
          .column.is-narrow
            div(v-if="role.serverable")
              div(
                :style="{color: getColor(Number(role.serverable.server_id))}"
              ) {{ cached[role.serverable.server_id].beautiful_name }}
            div(v-else) NoSrv

            div {{role.role.name}}
          .column
            div
              b EndAt
            div(v-if="role.timeable")
              | {{$localTime($moment(role.timeable.ended_at))}}
            div(v-else) NoTimeEnd
          .column.is-narrow
            b-button(
              @click="removeRole(role.id)"
              icon-right="delete"
            )
        //- .media-content
        //-   div 321
        //- .media-right
          div 222
    //- b-field(label="Name")
    //-   b-input(v-model="name")
    b-field(label="Role")
      b-dropdown(
        v-model="role"
        aria-role="list"
      )
        template(#trigger)
          b-button(
            v-if="role"
            :label="role.name"
            type="is-primary"
          )
          b-button(
            v-else
            label="No role"
          )
        b-dropdown-item(
          v-for="(role, index) in roles"
          :key="index"
          :value="role"
          aria-role="listitem"
        ) {{role.name}}
    b-field(label="Server")
      b-dropdown(
        v-model="server"
        aria-role="list"
      )
        template(#trigger)
          b-button(
            v-if="server"
            :label="server.beautiful_name"
            type="is-primary"
          )
          b-button(
            v-else
            label="No server"
          )
        b-dropdown-item(
          v-for="(server, index) in servers"
          :key="index"
          :value="server"
          aria-role="listitem"
        ) {{server.beautiful_name}}
    b-field(label="AtEnded")
      b-datepicker(
        v-model="date"
        locale="ru-RU"
        placeholder="Click to select..."
        icon="calendar-today"
        trap-focus
        :first-day-of-week="1"
      )
    b-field
      .columns.is-mobile
        .column
          b-button(
            type="is-primary"
            expanded
            @click="addDate('days')"
          ) +1 day
        .column
          b-button(
            type="is-primary"
            expanded
            @click="addDate('months')"
          ) +1 mesyac
    .field
      b-button(
        type="is-primary"
        expanded
        @click="save()"
      ) Add
</template>
<script>
export default {
  props: {
    userId: {
      type: String,
      default: '0'
    }
  },
  data: () => ({
    gived: [],

    roles: [],
    servers: [],

    date: new Date(),
    role: null,
    server: null
  }),
  computed: {
    cached () {
      // return
      return (this && this.$store && this.$store.getters['config/config'].servers) || []
    }
  },
  mounted () {
    this.$axios.get('/api/admin/user/roles')
      .then(({ data }) => {
        this.roles = data
      })
    this.$axios.get('/api/admin/user/servers')
      .then(({ data }) => {
        this.servers = data
      })
    this.load()
  },
  methods: {
    load () {
      this.$axios.get(`/api/admin/user/${this.userId}/roles`)
        .then(({ data }) => {
          this.gived = data
        })
        .catch(errors => this.$axios.errorHandler(errors))
    },
    save () {
      this.$axios.post(`/api/admin/user/${this.userId}/roles/save`, {
        // user_id: this.userId,
        date: this.$moment(this.date).format('DD.MM.YYYY'),
        role_id: this.role.id,
        server_id: this.server.id
      })
        .then(() => {
          this.load()
        })
        .catch(errors => this.$axios.errorHandler(errors))
    },
    removeRole (id) {
      this.$axios.post(`/api/admin/user/${this.userId}/roles/delete`, {
        role_id: id
      })
        .then(() => {
          this.load()
        })
        .catch(errors => this.$axios.errorHandler(errors))
    },
    addDate (type) {
      this.date = this.$moment(this.date).add(1, type).toDate()
    },
    getColor (status) {
      let color = '#e22c2c'
      const id = this.$_.find(this.cached, { id: status })
      if (id) {
        const c = id.color
        color = `rgb(${c.r},${c.g},${c.b})`
      }
      return color
    }
  }
}
</script>
