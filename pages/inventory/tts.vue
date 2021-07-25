<template lang="pug">
  div
    .columns.is-multiline
      .column.is-half(
        v-for="(item, key) in data"
        :key="key"
      )
        .block.box
          .is-size-4.field(@click="openModal(item.item)")
            | {{ item.item.name }}
            b-icon.is-pulled-right(icon="information-outline")
          .field(v-if="item.item.is_global")
            b Активируется на всех ресурсах Шафта
          .field(v-else)
            b Сервер:&nbsp;
            span(v-if="item.server") {{ item.server.short_name }}
            span(v-else) Не привязан
          .field
            b Статус:&nbsp;
            span(v-if="item.is_activated") Активирован
            span(v-else) Не активирован
          .field
            b Добавлено:
            span  {{ item.created_at }}
          .field(v-if="!item.is_activated")
            b-button(type="is-primary" @click="openModalActivate(item)") Активировать
    b-modal(
      v-model="modal.open"
      :width="640"
      scroll="keep"
      @close="closeModal"
    )
      tts-donate-info(
        :info="modal.selected"
        :show-actions="false"
        @close="closeModal"
      )
    b-modal(
      v-model="modalActivate.open"
      :width="640"
      scroll="keep"
      @close="closeModalActivate"
    )
      .card(v-if="modalActivate.selected && modalActivate.selected.item")
        .card-content
          .title {{ modalActivate.selected.item.name }}
          //- .subtitle {{ modalActivate.selected.item.price_format }}
          .content
            .block(v-if="modalActivate.selected.item.is_global")
              | Активируется на всех ресурсах Шафта
            .block(v-else-if="!modalActivate.selected.server")
              b-field(v-for="(srv, key) in servers" :key="key")
                b-radio(
                  v-model="server"
                  :native-value="key"
                ) {{ srv.beautiful_name }}
            .block(v-else)
                | Активация происходит на сервере {{ modalActivate.selected.server.short_name }}
            b-button.has-text-centered(
              type="is-primary"
              @click="active"
            ) Активировать
            //- div {{ modalActivate.selected }}
</template>
<script>
export default {
  data: () => ({
    data: [],
    server: null,
    modalActivate: {
      open: false,
      selected: null
    },
    modal: {
      open: false,
      selected: null
    }
  }),

  computed: {
    servers () {
      return (this && this.$store && this.$store.getters['config/config'].servers) || ''
    }
  },

  mounted () {
    this.load()
  },
  methods: {
    openModal (data) {
      this.modal.open = true
      this.modal.selected = data
    },
    closeModal () {
      this.modal.open = false
      this.modal.selected = null
      this.server = null
    },
    openModalActivate (data) {
      this.modalActivate.open = true
      this.modalActivate.selected = data
    },
    closeModalActivate () {
      this.modalActivate.open = false
      this.modalActivate.selected = null
      this.server = null
    },
    active () {
      const item = this.modalActivate.selected
      let servSelect = null
      if (item.server) {
        servSelect = item.server.id
      } else {
        servSelect = this.server
      }
      this.$axios.post(`/api/tts/item/${item.id}/activate`, {
        server_id: servSelect
      })
        .then(({ data }) => {
          this.$buefy.toast.open({
            message: 'Предмет активирован',
            duration: 5000,
            position: 'is-bottom',
            type: 'is-success',
            queue: false
          })
        })
        .catch(this.$axios.errorHandler)
      // this.$buefy.toast.open({
      //   message: 'Функционал отключен в целях сохранности целостности данных',
      //   duration: 5000,
      //   position: 'is-bottom',
      //   type: 'is-danger',
      //   queue: false
      // })
    },
    load () {
      this.$axios.get('/api/inventory/tts_items')
        .then(({ data }) => {
          this.data = data.data
        })
    }
  }
}
</script>
