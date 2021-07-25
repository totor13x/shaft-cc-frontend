<template>
  <div>
    <b-field>
      <b-input v-model="name" />

      <b-button @click="newType()">
        Создать новый тип логов (аккуратнее)
      </b-button>
    </b-field>
    <b-table
      ref="childTable"
      :data="data"
      :show-detail-icon="true"
      :bordered="true"
      :hoverable="true"
      detailed
      @details-open="closeAllOthersRows"
    >
      <b-table-column v-slot="props" field="id" label="ID" width="40" numeric>
        {{ props.row.id }}
      </b-table-column>
      <b-table-column v-slot="props" field="name" label="Название" sortable>
        {{ props.row.name }}
      </b-table-column>
      <b-table-column v-slot="props" field="price" label="Формат">
        {{ props.row.string }}
      </b-table-column>
      <template slot="detail" slot-scope="props">
        <div class="columns">
          <div class="column">
            <b-field label="ID">
              <b-input v-model="props.row.id" />
            </b-field>
            <b-field label="Название">
              <b-input v-model="props.row.name" />
            </b-field>
            <b-field label="Формат">
              <b-input v-model="props.row.string" type="textarea" />
            </b-field>
          </div>
          <div class="column">
            <div class="field">
              <b-button type="is-success" expanded @click="saveType(props.row)">
                Сохранить
              </b-button>
            </div>
            <div class="field">
              <b-button type="is-danger" expanded @click="deleteType(props.row.id)">
                Удалить
              </b-button>
            </div>
          </div>
        </div>
      </template>
      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon
                icon="emoticon-sad"
                size="is-large"
              />
            </p>
            <p>Пусто</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>
<script>
// TODO: Доделать страницу
export default {
  middleware: 'can',
  meta: {
    permission: 'ap-mng-logs-types'
  },
  data: () => ({
    logs: false,
    name: '',
    data: []
  }),
  mounted () {
    this.logs = this.$ws.subscribe('client/logs')
    this.logs.on('typeList', (data) => {
      console.log('joinde', data)
      this.data = data
    })
    this.logs.on('ready', (data) => {
      this.logs.emit('typeList')
    })
    this.logs.on('typeUpdate', (data) => {
      this.logs.emit('typeList')
    })
  },
  destroyed () {
    this.logs.close()
  },
  methods: {
    closeAllOthersRows (obj) {
      const child = this.$refs.childTable
      child.visibleDetailRows.forEach((val, key) => {
        const found = child.isVisibleDetailRow(val)
        if (obj.id !== val.id && found) {
          child.closeDetailRow(val)
        }
      })
    },
    saveType (data) {
      this.logs.emit('typeSave', data)
    },
    newType () {
      if (this.name === '') {
        // TODO: Сделать уведомление здесь по поводу ошибки
        return
      }
      this.logs.emit('typeNew', this.name)
      this.name = ''
    },
    deleteType (id) {
      // TODO: Сделать снакбар здесь
      this.logs.emit('typeDelete', id)
    }
  }
}
</script>
