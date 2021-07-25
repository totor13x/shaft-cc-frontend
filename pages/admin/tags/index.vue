<template>
  <div>
    <b-table
      ref="childTable"
      :data="tagsList"
      :bordered="true"
      :hoverable="true"
    >
      <b-table-column v-slot="props" field="id" label="ID" width="40" numeric>
        {{ props.row.id }}
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="Название">
        {{ props.row.beautiful_text }}
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="Описание">
        {{ props.row.description }}
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="Скрытый">
        {{ props.row.is_hidden }}
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="Превью">
        <span
          v-for="(data, key) in props.row.generated"
          :key="key"
          v-html="data"
        />
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="">
        <b-button
          class="is-small"
          tag="router-link"
          :to="`/admin/tags/${props.row.id}`"
        >
          Открыть
        </b-button>
      </b-table-column>
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
export default {
  middleware: 'can',
  meta: {
    permission: 'ap-mng-tag'
  },
  data: () => ({
    tags: false,
    tagsList: []
  }),
  mounted () {
    this.tags = this.$ws.subscribe('client/admin/tags')
    this.tags.on('ready', (data) => {
      this.tags.emit('tagsList')
    })
    this.tags.on('error', (data) => {
      console.log(data)
    })
    this.tags.on('tagsList', (data) => {
      this.tagsList = data
      console.log(data)
    })
  },
  methods: {
  },
  destroyed () {
    this.tags.close()
  }
}
</script>
