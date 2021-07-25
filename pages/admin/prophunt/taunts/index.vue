<template lang="pug">
  div
    div(
      class="123",
      :a="taunts"
    ) 123

    b-button(
      @click="openModalCreate()"
    ) Кнопка №3

    b-modal(
      :active.sync="modalCreate"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    )
      modal-create

    b-table(
      ref="childTable"
      :data="taunts"
      :show-detail-icon="true"
      :bordered="true"
      :hoverable="true"
      detailed
      @details-open="closeAllOthersRows"
    )
      b-table-column(v-slot="props" field="id" label="ID" width="40" numeric)
        | {{ props.row.id }}
      b-table-column(v-slot="props" field="id" label="slug")
        | {{ props.row.slug }}
      b-table-column(v-slot="props" field="id" label="Name")
        | {{ props.row.name }}
      b-table-column(v-slot="props" field="id" label="Enabled")
        span.tag.is-success(v-if="props.row.is_enabled") Да
        span.tag.is-danger(v-else) Нет
      template(slot="detail" slot-scope="props")
        modal-create(
          :edit="true"
          :prop="props"
          @updated-taunt="updatedTaunt"
        )
</template>
<script>
import ModalCreate from '~/components/admin/prophunt/taunts/create'

export default {
  middleware: 'can',
  meta: {
    permission: 'ap-mng-taunts-ph'
  },
  components: {
    ModalCreate
  },
  data: () => ({
    taunts: [],
    modalCreate: false
  }),
  mounted () {
    this.$axios.get('/api/admin/prophunt/taunts/show')
      .then((res) => {
        this.taunts = res.data
      })
  },
  methods: {
    openModalCreate () {
      this.modalCreate = true
    },
    updatedTaunt ({ data, index }) {
      this.$set(this.taunts, index, data)
    },
    closeAllOthersRows (obj) {
      const child = this.$refs.childTable
      child.visibleDetailRows.forEach((val, key) => {
        const found = child.isVisibleDetailRow(val)
        if (obj.id !== val.id && found) {
          child.closeDetailRow(val)
        }
      })
    }
  }
}
</script>
