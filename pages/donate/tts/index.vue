<template>
  <div>
    <div class="block content" v-if="user">
      <h1>Все купленные предметы попадают в <router-link to="/inventory/tts">ТТС-инвентарь</router-link></h1>
    </div>
    <div class="columns is-multiline">
      <div
        v-for="(item, key) in items"
        :key="key"
        class="column is-half"
      >
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p class="title">
                <b>{{ item.name }}</b>
              </p>
              <p class="subtitle">
                {{ item.price_format }}
              </p>
              <!-- <div class="clear-flex" /> -->
              <div class="table-flex">
                <div class="left">
                  Category
                </div>
                <div class="right">
                  {{ item.category }}
                </div>
              </div>
              <div v-if="!item.is_global"  class="table-flex">
                <div class="left">
                  Servers
                </div>
                <div class="right">
                  {{ $_.values(item.servers).join(',') }}
                </div>
              </div>
              <div class="clear-flex">
                <b-tag
                  v-if="item.is_global"
                  rounded
                  class="is-primary"
                >
                  Активируется на всех ресурсах Шафта
                </b-tag>
                <b-tag
                  rounded
                  :class="item.is_tradable ? 'is-primary' : ''"
                >
                  {{
                    item.is_tradable
                      ? 'Передаваемый'
                      : 'Не передаваемый'
                  }}
                </b-tag>
                <b-tag
                  v-if="item.is_once"
                  rounded
                >
                  Купить можно только один раз
                </b-tag>
              </div>
              <div class="clear-flex">
                <b-button
                  type="is-primary"
                  @click="openModal(key)"
                >
                  Подробнее
                </b-button>
              </div>
              <!-- <code>{{item.category}}</code>
              <code>{{item.is_tradable}}</code>
              <code>{{item.is_hidden}}</code>
              <code>{{item.is_once}}</code>
              <code>{{item.servers.join(',')}}</code> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      v-model="modal.open"
      :width="640"
      scroll="keep"
      @close="closeModal"
    >
      <tts-donate-info
        :info="modal.selected"
        :show-actions="user != false"
        @close="closeModal"
      />
    </b-modal>
  </div>
</template>
<script>
/* eslint-disable vue/no-use-v-if-with-v-for */
export default {
  data: () => ({
    items: [],
    server: null,
    modal: {
      open: false,
      selected: null
    }
  }),
  computed: {
    servers () {
      return (this && this.$store && this.$store.getters['config/config'].servers) || ''
    },
    user () {
      return (this.$store.getters && this.$store.getters['auth/user']) || false
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.$axios.get('/api/tts/items')
        .then(({ data }) => {
          this.items = data.data
        })
        .catch(errors => this.$axios.errorHandler(errors))
    },
    openModal (key) {
      this.modal.open = true
      this.modal.selected = this.items[key]
    },
    closeModal () {
      this.modal.open = false
      this.modal.selected = null
      this.server = null
    }
  }
}
</script>
<style lang='scss' scoped>
  .clear-flex {
    padding-top: 15px;
    text-align: right;
    flex: 1;
  }
  .table-flex {
    // flex: 1;
    padding-top: 5px;
    padding-bottom: 5px;
    display: flex;
    .left {
      flex: 1;
      text-align: left;
      font-weight: bold;
    }
    .right {
      flex: 1;
      text-align: right;
    }
  }
</style>
