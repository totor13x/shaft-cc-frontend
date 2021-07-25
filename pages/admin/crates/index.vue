<template>
  <div>
    <b-field>
      Привет, это страница кейсов. Можно добавить абсолютно любой предмет - будь-то слот музыки, предмет из ПШ или TTS.
    </b-field>
    <b-table
      ref="childTable"
      :data="crateList"
      :bordered="true"
      :hoverable="true"
    >
      <b-table-column v-slot="props" field="id" label="ID" width="40" numeric>
        {{ props.row.id }}
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="Название">
        {{ props.row.name }}
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="Покупка">
        {{ props.row.buy }}
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="Продажа">
        {{ props.row.sell }}
      </b-table-column>
      <b-table-column v-slot="props" field="id" label="">
        <b-button
          class="is-small"
          tag="router-link"
          :to="`/admin/crates/${props.row.id}`"
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
    <!-- <b-field v-for="(data, key) in crateList" :key="key">
      {{ data }}
    </b-field> -->
  </div>
</template>
<script>
export default {
  data: () => ({
    crate: false,
    crateList: []
  }),
  mounted () {
    this.crate = this.$ws.subscribe('client/admin/roulette')
    this.crate.on('ready', (data) => {
      this.crate.emit('crateList')
    })
    this.crate.on('error', (data) => {
      console.log(data)
    })
    this.crate.on('crateList', (data) => {
      this.crateList = data
      console.log(data)
    })
  },
  methods: {
  },
  destroyed () {
    this.crate.close()
  }
}
</script>
