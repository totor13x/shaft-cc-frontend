<template lang="pug">
  div
    div.field.has-background-danger.has-text-white(
      style="padding: 10px;border-radius: 5px; text-transform: uppercase; font-weight: bold;"
    ) {{ type }}
    div.field.has-background-primary.has-text-white(
      style="padding: 10px;border-radius: 5px"
    ) Все изменения блокировки
    b-field(label="Выбери причины для блокировки")
      b-taginput(
        v-model="reasons"
        :data="filteredReasons"
        autocomplete
        field="slug"
        icon="label"
        placeholder="Add a tag"
        @typing="getFilteredReasons"
      )
        template(slot-scope="props")
          b {{ props.option.slug }}&nbsp;
          | {{ props.option.description }}
        template(slot="empty")
          | Не выбрана причина
    b-field(
      label="SteamID32"
      message="STEAM_0:0:0"
    )
      b-input(
        v-model="steamid"
      )
    b-field(
      label="Время наказания"
      message="Время указывается в минутах, 0 - навсегда"
    )
      b-input(
        v-model="length"
        type="number"
      )
    b-field(label="Комментарий")
      b-input(
        v-model="comment"
        type="textarea"
        maxlength="200"
      )
    b-field
      b-button(
        @click="sendToBan"
      ) Отправить на проверку
</template>
<script>
import _ from 'lodash'
export default {
  props: {
    lockId: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'ban'
    }
  },
  data: () => ({
    reasons: [],
    length: 0,
    comment: null,
    steamid: null,

    accepted: false,

    getReasons: [],
    filteredReasons: []
  }),
  mounted () {
    this.$axios.get('/api/admin/locks/reason/show')
      .then(({ data }) => {
        this.getReasons = data
      })
  },
  methods: {
    getFilteredReasons (text) {
      this.filteredReasons = this.getReasons.filter((option) => {
        if (option.type !== 'rule') {
          return false
        }
        return option.slug
          .toString()
          .toLowerCase()
          .includes(text.toLowerCase())
      })
    },
    sendToBan () {
      if (this.reasons.length === 0) {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Не выбраны причины блокировки',
          position: 'is-bottom',
          queue: false,
          type: 'is-danger'
        })
        return
      }

      this.$axios.post('/api/admin/locks/create', {
        type: this.type,
        reason: _.map(this.reasons, 'slug'),
        length: this.length,
        comment: this.comment,
        steamid: this.steamid,
        is_accepted: this.accepted
      })
        .then(({ data, status }) => {
          // console.log(data)
          if (status === 202) {
            this.$buefy.snackbar.open({
              message: data.message,
              type: 'is-warning',
              position: 'is-bottom',
              actionText: 'Подтвердить',
              queue: false,
              duration: 7000,
              onAction: () => {
                this.accepted = true
                this.sendToBan()
                // this.$buefy.toast.open({
                //   message: 'Action pressed',
                //   queue: false
                // })
              }
            })
            return
          }

          this.$buefy.toast.open({
            duration: 4000,
            message: data,
            position: 'is-bottom',
            queue: false,
            type: 'is-success'
          })

          this.$parent.close()
          // console.log(data)
          // this.getReasons = data
        })
        .catch(errors => this.$axios.errorHandler(errors))
    }
  }
}
</script>
