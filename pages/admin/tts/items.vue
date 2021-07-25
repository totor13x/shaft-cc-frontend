<template>
  <div>
    <b-button @click="createItem()">
      Создать новый предмет (изначально скрытый)
    </b-button>
    <b-table
      ref="childTable"
      :data="computedData"
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
      <b-table-column v-slot="props" field="price" label="Цена" sortable>
        {{ props.row.price }}
      </b-table-column>
      <b-table-column v-slot="props" field="category" label="Категория" sortable>
        {{ props.row.category }}
      </b-table-column>
      <b-table-column v-slot="props" field="servers_ids" label="Сервер" sortable>
        <span>
          <span v-for="data in props.row.servers_ids" :key="data" v-html="computedTag(data)" />
        </span>
      </b-table-column>
      <b-table-column v-slot="props" field="is_hidden" label="Скрытый" sortable>
        <span v-if="props.row.is_hidden" class="tag is-danger">
          Да
        </span>
        <span v-else class="tag is-success">
          Нет
        </span>
      </b-table-column>
      <b-table-column v-slot="props" field="is_tradable" label="Передаваемый" sortable>
        <span v-if="props.row.is_tradable" class="tag is-success">
          Да
        </span>
        <span v-else class="tag is-danger">
          Нет
        </span>
      </b-table-column>
      <template slot="detail" slot-scope="props">
        <div class="columns">
          <div class="column">
            <b-field label="Название">
              <b-input v-model="props.row.name" />
            </b-field>
            <b-field label="Описание">
              <b-input v-model="props.row.description" type="textarea"/>
            </b-field>

            <b-field label="Цена">
              <b-numberinput v-model="props.row.price" min="0" />
            </b-field>
            <b-field label="Скрытый">
              <b-switch
                v-model="props.row.is_hidden"
                :true-value="1"
                :false-value="0"
              />
            </b-field>
            <b-field label="Категория">
              <b-autocomplete
                v-model="props.row.category"
                placeholder="Вбейте категорию"
                open-on-focus
                keep-first
                :data="filteredCategories(data)"
                @select="option => selected = option"
              />
            </b-field>
            <b-field label="Передаваемый">
              <b-switch
                v-model="props.row.is_tradable"
                :true-value="1"
                :false-value="0"
              />
            </b-field>
            <b-field label="Одноразовый">
              <b-switch
                v-model="props.row.is_once"
                :true-value="1"
                :false-value="0"
              />
            </b-field>
            <b-field label="Глобален?">
              <b-switch
                v-model="props.row.is_global"
                :true-value="true"
                :false-value="false"
              />
            </b-field>
            <b-field label="Доступен серверам, если не глобален">
              <b-dropdown
                v-model="props.row.servers_ids"
                multiple
                aria-role="list"
              >
                <button slot="trigger" class="button is-primary" type="button">
                  <span>{{ computedSrvForDragnDrop(props.row.servers_ids) }}</span>
                  <b-icon icon="menu-down" />
                </button>

                <b-dropdown-item v-for="data in srv" :key="data.id" :value="data.id" aria-role="listitem">
                  <span>{{ data.beautiful_name }}</span>
                </b-dropdown-item>
              </b-dropdown>
              {{ props.row.data }}
            </b-field>
            <b-field label="Конфигурация предмета">
              <b-dropdown v-model="props.row.type" aria-role="list">
                <button slot="trigger" class="button is-info">
                  <span>
                    {{ modal.text[props.row.type]?modal.text[props.row.type]:'Не выбрано' }}
                  </span>
                  <b-icon icon="menu-down" />
                </button>

                <b-dropdown-item aria-role="listitem" value="points" @click="openModal('modalOpenPoints')">
                  Поинты
                </b-dropdown-item>

                <b-dropdown-item aria-role="listitem" value="pointshop_item" @click="openModal('modalOpenPointshopItem')">
                  Предмет поинтшопа
                </b-dropdown-item>
              </b-dropdown>
            </b-field>
            <b-field label="Привязанный предмет">
              <div v-if="props.row.type == 'points'">
                <div v-if="props.row.data && props.row.data.points">
                  <b>Поинты:</b> {{ props.row.data.points }}
                </div>
                <div v-else>
                  Не задано
                </div>
              </div>
              <div v-if="props.row.type == 'pointshop_item'">
                <div v-if="props.row.itemable">
                  <b>Предмет поинтшопа:</b> {{ props.row.itemable.name }}
                </div>
                <div v-else>
                  Не задано
                </div>
              </div>
            </b-field>
            <b-modal
              :active.sync="modal.modalOpenPoints"
              has-modal-card
              trap-focus
              aria-role="dialog"
              aria-modal
            >
              <type-points v-model="props.row.data" />
            </b-modal>
            <b-modal
              :active.sync="modal.modalOpenPointshopItem"
              has-modal-card
              trap-focus
              aria-role="dialog"
              aria-modal
            >
              <type-pointshop-item
                v-model="props.row.data"
                :server_id="props.row.servers_ids"
                :item_id="props.row.id"
                :type="props.row.type"
                @updateItems="updateItems()"
              />
            </b-modal>
          </div>
          <div class="column">
            <!-- <b-field label="Скрипт, отвечающий за надевание">
              <b-input v-model="props.row.compile_string_equip" type="textarea" />
            </b-field>
            <b-field label="Скрипт, отвечающий за снятие">
              <b-input v-model="props.row.compile_string_holster" type="textarea" />
            </b-field> -->
            <div class="field">
              <b-button expanded @click="saveItem(props.row)">
                Сохранить
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
import axios from 'axios'
import TypePoints from '~/components/admin/tts/items/types/Points'
import TypePointshopItem from '~/components/admin/tts/items/types/PointshopItem'
export default {
  middleware: 'can',
  meta: {
    permission: 'ap-mng-tts-items'
  },
  components: {
    TypePoints,
    TypePointshopItem
  },
  data: () => ({
    modal: {
      modalOpenPoints: false,
      modalOpenPointshopItem: false,
      text: {
        points: 'Поинты',
        pointshop_item: 'Предмет поинтшопа'
      }
    },
    data: [],
    activeRows: [],
    dataForSelectedUniversal: []
  }),
  metaInfo () {
    return { title: 'Home123' }
  },
  computed: {
    srv () {
      return (this && this.$store && this.$store.getters['config/config'].servers) || ''
    },
    filteredCategories () {
      return (data) => {
        const out = []
        data.map((element) => {
          if (!out.includes(element.category)) {
            out.push(element.category)
          }
        })
        return out
        // return []
      }
    },
    computedSrvForDragnDrop () {
      return (data) => {
        const out = []
        console.log(data)
        if (data === null || data === undefined) {
          return 'Пусто'
        }
        if (data.length === 0) {
          return 'Пусто'
        }
        data.map((element) => {
          if (this.srv[element]) {
            out.push(this.srv[element].short_name)
          }
        })
        return out.join(',')
      }
    },
    computedTag () {
      return (data) => {
        if (this.srv[data]) {
          const clr = this.srv[data]
          return '<span class="tag" style="background: rgb(' + clr.color.r + ',' + clr.color.g + ',' + clr.color.b + ')">' + clr.short_name + '</span>'
        } else {
          return data
        }
      }
    },
    computedData () {
      return this.data
    }
  },
  mounted () {
    this.updateItems()
  },
  methods: {
    updateItems () {
      axios.get('/api/admin/tts/items')
        .then((response) => {
          this.data = response.data
        })
        .catch(errors => this.$axios.errorHandler(errors))
    },
    openModal (type) {
      this.modal[type] = true
    },
    closeAllOthersRows (obj) {
      const child = this.$refs.childTable
      child.visibleDetailRows.forEach((val, key) => {
        const found = child.isVisibleDetailRow(val)
        if (obj.id !== val.id && found) {
          child.closeDetailRow(val)
        }
      })
    },
    saveItem (data) {
      console.log(data)
      axios.post(`/api/admin/tts/items/${data.id}/save`, { ...data })
        .then((res) => {
          console.log(res)
        })
        .catch(errors => this.$axios.errorHandler(errors))
    },
    createItem () {
      axios.post('/api/admin/tts/items/create')
        .then((res) => {
          // console.log(res)
          this.data.push(res.data)
        })
        .catch(errors => this.$axios.errorHandler(errors))
    },
    changeCategory () {

    }
  }
}
</script>
