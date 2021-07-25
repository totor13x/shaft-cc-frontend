<template>
  <div>
    <b-button @click="openModalCreate()">
      Кнопка №3
    </b-button>
    <b-modal
      :active.sync="modal.Create"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <modal-create v-model="modal.DataFrom" />
    </b-modal>

    <b-table
      ref="childTable"
      :data="taunts"
      :show-detail-icon="true"
      :bordered="true"
      :hoverable="true"
      detailed
      @details-open="closeAllOthersRows"
    >
      <b-table-column v-slot="props" field="id" label="ID" width="40" numeric>
        {{ props.row.id }}
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="slug">
        {{ props.row.slug }}
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="Name">
        {{ props.row.name }}
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="Enabled">
        <span v-if="props.row.is_enabled" class="tag is-success">
          Да
        </span>
        <span v-else class="tag is-danger">
          Нет
        </span>
      </b-table-column>
      <template slot="detail" slot-scope="props">
        <modal-create
          v-model="modal.DataFrom"
          :edit="true"
          :prop="props"
          @updated-taunt="updatedTaunt"
        />
        <!-- {{ props }} -->
      </template>
    </b-table>
  </div>
</template>
<script>
import ModalCreate from '~/components/admin/taunts/create'

export default {
  middleware: 'can',
  meta: {
    permission: 'ap-mng-taunts'
  },
  components: {
    ModalCreate
  },
  metaInfo () {
    return { title: 'Таунты' }
  },
  data: () => ({
    taunts: [],
    modal: {
      Create: false,
      DataFrom: ''
    }
  }),
  mounted () {
    this.$axios.get('/api/admin/taunts/show')
      .then((res) => {
        this.taunts = res.data
      })
  },
  methods: {
    openModalCreate () {
      this.modal.Create = true
    },
    updatedTaunt ({ data, index }) {
      this.$set(this.taunts, index, data)
      // console.log(data)
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
