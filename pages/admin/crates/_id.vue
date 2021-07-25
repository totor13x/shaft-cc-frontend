<template>
  <div v-if="crateOpen">
    <div class="columns">
      <div class="column">
        <b-field label="ID">
          {{ $route.params.id }}
        </b-field>
        <b-field label="Название">
          <!--
          this.crateUpdate.buy = data.crate.buy
          this.crateUpdate.sell = data.crate.sell
          this.crateUpdate.hoci = data.crate.hoci
          this.crateUpdate.cost_type = data.crate.cost_type
          this.crateUpdate.servers = data.crate.servers
          -->
          <b-input
            v-model="crateUpdate.name"
          />
        </b-field>
        <b-field label="Стоимость покупки кейса">
          <!--
          this.crateUpdate.sell = data.crate.sell
          this.crateUpdate.hoci = data.crate.hoci
          this.crateUpdate.cost_type = data.crate.cost_type
          this.crateUpdate.servers = data.crate.servers

          this.crateUpdate.buy_key = data.crate.buy_key
          this.crateUpdate.sell_key = data.crate.sell_key
          this.crateUpdate.buy_case = data.crate.buy_case
          this.crateUpdate.sell_case = data.crate.sell_case
          -->
          <b-input
            v-model="crateUpdate.buy_case"
          />
        </b-field>
        <b-field label="Стоимость продажи кейса">
          <!--
          this.crateUpdate.hoci = data.crate.hoci
          this.crateUpdate.cost_type = data.crate.cost_type
          this.crateUpdate.servers = data.crate.servers
          -->
          <b-input
            v-model="crateUpdate.sell_case"
          />
        </b-field>
        <b-field label="Стоимость покупки ключа">
          <!--
          this.crateUpdate.sell = data.crate.sell
          this.crateUpdate.hoci = data.crate.hoci
          this.crateUpdate.cost_type = data.crate.cost_type
          this.crateUpdate.servers = data.crate.servers

          this.crateUpdate.buy_key = data.crate.buy_key
          this.crateUpdate.sell_key = data.crate.sell_key
          this.crateUpdate.buy_case = data.crate.buy_case
          this.crateUpdate.sell_case = data.crate.sell_case
          -->
          <b-input
            v-model="crateUpdate.buy_key"
          />
        </b-field>
        <b-field label="Стоимость продажи ключа">
          <!--
          this.crateUpdate.hoci = data.crate.hoci
          this.crateUpdate.cost_type = data.crate.cost_type
          this.crateUpdate.servers = data.crate.servers
          -->
          <b-input
            v-model="crateUpdate.sell_key"
          />
        </b-field>
        <b-field label="К каким серверам привязать? (зависит какие предметы будут и, если не указывать, то на всех серверах)">
          <b-taginput
            ref="taginput"
            v-model="crateUpdate.servers"
            :data="filteredServers"
            autocomplete
            open-on-focus
            icon="label"
            label="beautiful_name"
            placeholder="Добавить сервер"
            @typing="getFilteredServers"
          >
            <template slot-scope="props">
              <strong>{{ props.option.id }}</strong>: {{ props.option.beautiful_name }}
            </template>
            <template slot="selected" slot-scope="props">
              <b-tag
                v-for="(tag, index) in props.tags"
                :key="index"
                rounded
                :tabstop="false"
                ellipsis
                closable
                @close="$refs.taginput.removeTag(index, $event)"
              >
                {{ tag.beautiful_name }}
              </b-tag>
            </template>
          </b-taginput>
        </b-field>
        <b-field label="Валюта">
          <b-dropdown
            v-model="crateUpdate.cost_type"
            scrollable
            :max-height="200"
            aria-role="list"
          >
            <button slot="trigger" class="button is-primary" type="button">
              <template>
                <span>{{ getFormatCostType[crateUpdate.cost_type].name }}</span>
              </template>
              <b-icon icon="menu-down" />
            </button>

            <b-dropdown-item
              v-for="(type, index) in crateOpen.types"
              :key="index"
              :value="type.type" aria-role="listitem"
            >
              <div class="media">
                <div class="media-content">
                  <h3>{{ getFormatCostType[type.type].name }}</h3>
                </div>
              </div>
            </b-dropdown-item>
          </b-dropdown>
        </b-field>
        <b-field>
          <b-button
            @click="saveConfig"
          >
            Сохранить
          </b-button>
        </b-field>
      </div>
      <div class="column is-5">
        <nav class="panel block">
          <p class="panel-heading">
            Предметы
          </p>
          <a
            v-for="(data, key) in crateOpen.crate.items"
            :key="key"
            class="panel-block"
            @click="openItem(data)"
          >
            <!-- {{ crateOpen.morphs }} -->
            <div class="format-block">
              <div class="format-color" />
              <div v-if="crateOpen.morphs.find(x => x.namespace === data.itemable_type)" class="ml-1">
                [{{ crateOpen.morphs.find(x => x.namespace === data.itemable_type).name }}]
              </div>
              <div class="ml-1">
                {{ data.itemable ? data.itemable.name : `ID: ${data.itemable_id}` }}
              </div>
            </div>
            <small>
              {{ data.change }} - {{ ((data.change / allCharge) * 100).toFixed(3) }}%
            </small>
            <!-- {{ data }} -->
          </a>
          <div class="panel-block">
            <button
              class="button is-link is-outlined is-fullwidth"
              @click="modal.open = true"
            >
              Добавить
            </button>
          </div>
        </nav>
        <nav class="panel">
          <p class="panel-heading">
            Шансы генерации
          </p>
          <div v-if="!crateTest.servers" class="panel-block">
            Функционал использовать очень редко, он весь сервер начинает сжигать циклом. Проще говоря используй, только когда сервера пустуют и на сайте людей нет - например ночью.<br><br>После нажатия на генерацию нужно немного подождать.
          </div>
          <div
            v-for="(items, server) in crateTest.servers"
            :key="server"
          >
            <b
              class="panel-block"
            >
              <b>{{ findServerById(server).beautiful_name }}</b>
            </b>
            <div
              v-for="(kek, lol) in items"
              :key="`item-${lol}`"
              class="panel-block"
            >
              {{ lol }} - {{ kek }}
            </div>
          </div>
          <div v-if="crateTest.data" class="panel-block">
            <b>Всего прокруток: {{ crateTest.data.loops }}</b>
          </div>
          <div v-if="crateTest.data" class="panel-block">
            Стоимость кейсов: {{ crateTest.data.cost_common }}
          </div>
          <div v-if="crateTest.data" class="panel-block">
            Дропнуто поинтов: {{ crateTest.data.dropped_common }}
          </div>
          <div v-if="crateTest.data" class="panel-block">
            Окуп:
            <span v-if="crateTest.data.cost_common - crateTest.data.dropped_common < 0">
              +
            </span>
            {{ ((crateTest.data.cost_common-crateTest.data.dropped_common)*-1) + "(" +(1-(crateTest.data.cost_common-crateTest.data.dropped_common)/crateTest.data.cost_common).toFixed(1) *100 + "%)" }}
          </div>
          <div class="panel-block">
            <button
              class="button is-link is-outlined is-fullwidth"
              @click="testCrates"
            >
              Генерация
            </button>
          </div>
        </nav>
      </div>
    </div>
    <b-modal
      v-model="modalEdit.open"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
    >
      <div class="modal-card" style="width: 500px; height:500px">
        <header class="modal-card-head">
          <p class="modal-card-title">
            Редактирование {{ modalEdit.item.itemable ? modalEdit.item.itemable.name : `ID: ${modalEdit.item.itemable_id}` }}
          </p>
          <button
            type="button"
            class="delete"
            @click="modalEdit.open = false"
          />
        </header>
        <section class="modal-card-body">
          <b-field
            label="Шанс (чем больше число, тем больше шанс)"
            message="Сори, здесь вычислять сложнее, так что предварительного не будет"
          >
            <b-input
              v-model="modalEdit.item.change"
              type="number"
            />
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button"
            type="button"
            @click="modalEdit.open = false"
          >
            Отменить
          </button>
          <button class="button is-primary" @click="editItem">
            Сохранить
          </button>
          <button class="button is-danger" @click="deleteItem(modalEdit.item.id)">
            Удалить
          </button>
        </footer>
      </div>
    </b-modal>
    <b-modal
      v-model="modal.open"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
    >
      <div class="modal-card" style="width: 500px; height:500px">
        <header class="modal-card-head">
          <p class="modal-card-title">
            Добавить новый предмет в кейс
          </p>
          <button
            type="button"
            class="delete"
            @click="modal.open = false"
          />
        </header>
        <section class="modal-card-body">
          <b-tabs
            v-model="modal.tabIndex"
            type="is-toggle-rounded"
            position="is-centered"
          >
            <b-tab-item
              v-for="(data, key) in crateOpen.morphs"
              :key="key"
              :label="data.full_name"
              :value="data.namespace"
            />
          </b-tabs>
          <div v-if="modal.loadedList" class="field">
            <b-dropdown
              v-model="modal.currentCategory"
              scrollable
              :max-height="200"
              aria-role="list"
            >
              <button slot="trigger" class="button is-primary" type="button">
                <template>
                  <span>{{ modal.currentCategory ? modal.currentCategory : 'Выбери категорию' }}</span>
                </template>
                <b-icon icon="menu-down" />
              </button>

              <b-dropdown-item
                v-for="(category, index) in allCategories"
                :key="index"
                :value="category"
                aria-role="listitem"
              >
                <div class="media">
                  <div class="media-content">
                    <h3>{{ category }}</h3>
                  </div>
                </div>
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown
              v-model="modal.currentItem"
              scrollable
              :max-height="200"
              aria-role="list"
            >
              <button slot="trigger" class="button is-primary" type="button">
                <template>
                  <span>{{ modal.currentItem ? modal.currentItem.name : 'Выбери предмет' }}</span>
                </template>
                <b-icon icon="menu-down" />
              </button>

              <b-dropdown-item
                v-for="(item, index) in allItemsInCategories"
                :key="index"
                :value="item"
                aria-role="listitem"
                :disabled="crateOpen.crate.items.find(x => x.itemable_id === item.id && x.itemable_type === item.itemable_type) !== undefined"
              >
                <div class="media">
                  <div class="media-content">
                    <h3>{{ item.name }}</h3>
                  </div>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div v-if="modal.currentItem" class="field">
            <b-field label="ID">
              {{ modal.currentItem.id }}
            </b-field>
            <b-field label="Название">
              {{ modal.currentItem.name }}
            </b-field>
            <b-field
              label="Шанс (чем больше число, тем больше шанс)"
              :message=" ((modal.itemToAdd.change / ( parseInt(allCharge) + parseInt(modal.itemToAdd.change) )) * 100 ).toFixed(7) + '%'"
            >
              <b-input
                v-model="modal.itemToAdd.change"
                type="number"
              />
            </b-field>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button"
            type="button"
            @click="modal.open = false"
          >
            Отменить
          </button>
          <button class="button is-primary" @click="addItem">
            Добавить
          </button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>
<script>
/* eslint-disable unicorn/prefer-includes */
import _ from 'lodash'
export default {
  data: () => ({
    crate: false,
    crateOpen: false,
    crateUpdate: {
      name: null,
      buy: null,
      sell: null,
      hoci: null,
      cost_type: null
    },

    crateTest: [],

    filteredServers: [],
    loadedFilteredServers: false,

    modalEdit: {
      open: false,
      item: {}
    },

    modal: {
      open: false,
      tabIndex: null,
      loadedList: false,
      currentCategory: null,
      currentItem: null,
      itemToAdd: {
        change: 0
      }
    }
  }),
  computed: {
    servers () {
      return (this && this.$store && this.$store.getters['config/config'].servers) || []
    },
    allCharge () {
      if (this.crateOpen) {
        return this.crateOpen.crate.items.reduce((a, b) => a + b.change, 0)
      }
      return 0
    },
    allCategories () {
      if (this.modal.loadedList) {
        const array = []
        this.modal.loadedList.forEach((item) => {
          if (!array.includes(item.category)) {
            array.push(item.category)
          }
        })
        return array
        // return words.filter(word => word.length > 6)
      }
      return []
    },
    allItemsInCategories () {
      if (this.modal.currentCategory) {
        // const array = []
        // this.modal.loadedList.forEach((item) => {
        //   if (!array.includes(item.category)) {
        //     array.push(item.category)
        //   }
        // })
        return this.modal.loadedList.filter(item => item.category === this.modal.currentCategory)
        // return words.filter(word => word.length > 6)
      }
      return this.modal.loadedList
    },
    getFormatCostType () {
      const x = {}
      this.crateOpen.types.forEach((type) => {
        x[type.type] = type
      })
      return x
    }
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    'modal.tabIndex': function (newVal, oldVal) {
      if (newVal !== null) {
        this.crate.emit('loadItems', {
          crate_id: this.$route.params.id,
          namespace: newVal
        })
      }
    },
    // eslint-disable-next-line object-shorthand
    'modal.open': function (newVal) {
      console.log(newVal)
      if (!newVal) {
        this.modal.tabIndex = null
      }
    },
    // eslint-disable-next-line object-shorthand
    servers: function (newVal) {
      console.log(newVal, 'servers')
      this.loadedFilteredServers = true
      if (this.filteredServers.length === 0) {
        this.getFilteredServers('')
      }
    }
  },
  mounted () {
    this.crate = this.$ws.subscribe('client/admin/roulette')
    this.crate.on('ready', (data) => {
      this.crate.emit('crateOpen', this.$route.params.id)
    })
    this.crate.on('error', (data) => {
      console.log(data)
    })
    this.crate.on('crateOpen', (data) => {
      this.crateOpen = data

      this.crateUpdate.name = data.crate.name
      this.crateUpdate.buy_key = data.crate.buy_key
      this.crateUpdate.sell_key = data.crate.sell_key
      this.crateUpdate.buy_case = data.crate.buy_case
      this.crateUpdate.sell_case = data.crate.sell_case
      // this.crateUpdate.hoci = data.crate.hoci // TODO: Здесь Hoci надо будет доработать
      this.crateUpdate.cost_type = data.crate.cost_type
      this.crateUpdate.servers = [] // data.crate.servers

      const intervalCheck = setInterval(() => {
        // if (this.loadedFilteredServers) {
        //   loadedFilteredServers = true
        // }

        if (this.loadedFilteredServers) {
          this.crateOpen.crate.servers.forEach((id) => {
            const srv = this.filteredServers.find(x => x.id === id)
            if (srv) {
              this.$refs.taginput.addTag(srv)
            }
          })
          clearInterval(intervalCheck)
        }
      }, 100)

      console.log(data)
    })
    this.crate.on('loadItems', (data) => {
      this.modal.loadedList = data
      console.log(data)
    })
    this.crate.on('testOpenConfig', (data) => {
      this.crateTest = data.results
    })
  },
  destroyed () {
    this.crate.close()
  },
  methods: {
    testCrates () {
      this.crate.emit('testOpenConfig', {
        id: this.$route.params.id
      })
    },
    saveConfig () {
      this.crate.emit('saveConfig', {
        id: this.$route.params.id,
        ...this.crateUpdate
      })
      this.modal.tabIndex = null
    },
    openItem (item) {
      this.$set(this.modalEdit, 'item', Object.assign({}, item))
      this.modalEdit.open = true
    },
    deleteItem (id) {
      this.crate.emit('deleteItem', {
        crate_id: this.$route.params.id,
        item_id: this.modalEdit.item.id
      })
      this.modalEdit.open = false
    },
    editItem () {
      this.crate.emit('editItem', {
        crate_id: this.$route.params.id,
        ...this.modalEdit.item
      })
      this.modalEdit.open = false
    },
    addItem () {
      const data = {
        change: this.modal.itemToAdd.change,
        namespace: this.modal.tabIndex,
        crate_id: this.$route.params.id,
        item_id: this.modal.currentItem.id
      }

      console.log(data)

      this.crate.emit('addItem', data)
      this.modal.open = false
    },
    findServerById (id) {
      return _.find(this.servers, (o) => { console.log(o.id, id); return o.id === Number(id) })
    },
    getFilteredServers (text) {
      console.log(this.servers, text)
      // let keys = Object.keys(this.servers)
      const servers = []
      Object.keys(this.servers).forEach((srvId) => {
        const data = this.servers[srvId]
        servers.push(data)
      })

      this.filteredServers = servers

      this.filteredServers = servers.filter((srv) => {
        return srv.beautiful_name
          .toLowerCase()
          .indexOf(text.toLowerCase()) >= 0
      })
      // this.servers.filter((server) => {
      //   return server.id_name
      //     .toString()
      //     .toLowerCase()
      //     .includes(text.toLowerCase())
      // })
    }
  }
}
</script>
<style scoped>
  .format-block {
    flex: 1;
    display: inline-flex;
  }
  .format-color {
    padding: 2px;
    background: #333;
  }
</style>
