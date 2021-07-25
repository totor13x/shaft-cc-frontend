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
      <b-table-column v-slot="props" field="is_tradable" label="Трейд" sortable>
        <span v-if="props.row.is_tradable" class="tag is-success">
          Да
        </span>
        <span v-else class="tag is-danger">
          Нет
        </span>
      </b-table-column>
      <b-table-column v-slot="props" field="is_premium" label="Премиум" sortable>
        <span v-if="props.row.is_premium" class="tag is-success">
          Да
        </span>
        <span v-else class="tag is-danger">
          Нет
        </span>
      </b-table-column>
      <b-table-column v-slot="props" field="user_id" label="Приват?" sortable>
        <span v-if="props.row.user_id" class="tag is-warning">
          {{ props.row.owner.username }}
        </span>
        <span v-else class="tag is-success">
          Нет
        </span>
      </b-table-column>
      <template slot="detail" slot-scope="props">
        <div class="columns">
          <div class="column">
            <b-field label="Название">
              <b-input v-model="props.row.name" />
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
            <b-field label="Hoe (категоризация самих предметов, при снятии предмета hoe в категории, где нет ограничений, снимаются все остальные hoe. По техническим возможностям - экипирован может быть только один hoe)">
              <b-autocomplete
                v-model="props.row.hoe"
                placeholder="Вбейте hoe - пустое, если не нужно"
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
                v-model="props.row.once"
                :true-value="1"
                :false-value="0"
              />
            </b-field>
            <b-field label="Только для премиума">
              <b-switch
                v-model="props.row.is_premium"
                :true-value="true"
                :false-value="false"
              />
            </b-field>
            <b-field label="Не снимаемый после смерти (касается того, что не срабатывает после спавна)">
              <b-switch
                v-model="props.row.always_equip"
                :true-value="1"
                :false-value="0"
              />
            </b-field>
            <b-field label="Доступен серверам">
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
            </b-field>

            <b-field label="Доступен ролям - если не указывать ролей, то будет доступно всем">
              <b-dropdown
                v-model="props.row.roles_ids"
                multiple
                aria-role="list"
              >
                <button slot="trigger" class="button is-primary" type="button">
                  <span>{{ computedRolesForDragnDrop(props.row.roles_ids) }}</span>
                  <b-icon icon="menu-down" />
                </button>

                <b-dropdown-item
                  v-for="data in roles"
                  :key="data.id"
                  :value="data.id"
                  aria-role="listitem"
                >
                  <span>{{ data.name }} ({{ data.immunity }})</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-field>
            <b-field label="Конфигурация предмета">
              <b-dropdown v-model="props.row.type" aria-role="list">
                <button slot="trigger" class="button is-info">
                  <span>{{ modal.text[props.row.type]?modal.text[props.row.type]:'Не выбрано' }}</span>
                  <b-icon icon="menu-down" />
                </button>

                <b-dropdown-item aria-role="listitem" value="attach" @click="openModal('modalOpenAttach')">
                  Шапка, маска и другие аттачи
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem" value="model" @click="openModal('modalOpenModel')">
                  Модель
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem" value="deatheffect" @click="openModal('modalOpenDeathEffect')">
                  Эффект смерти
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem" value="attacheffect" @click="openModal('modalOpenAttachEffect')">
                  Аттач-эффект
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem" value="taunt" @click="openModal('modalOpenTaunt')">
                  Таунт
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem" value="swep" @click="openModal('modalOpenSwep')">
                  Оружие
                </b-dropdown-item>
              </b-dropdown>
            </b-field>
            <b-modal
              :active.sync="modal.modalOpenAttach"
              has-modal-card
              trap-focus
              aria-role="dialog"
              aria-modal
            >
              <type-attachment v-model="props.row.data" />
            </b-modal>
            <b-modal
              :active.sync="modal.modalOpenModel"
              has-modal-card
              trap-focus
              aria-role="dialog"
              aria-modal
            >
              <type-model v-model="props.row.data" />
            </b-modal>
            <b-modal
              :active.sync="modal.modalOpenDeathEffect"
              has-modal-card
              trap-focus
              aria-role="dialog"
              aria-modal
            >
              <type-death-effect v-model="props.row.data" />
            </b-modal>
            <b-modal
              :active.sync="modal.modalOpenAttachEffect"
              has-modal-card
              trap-focus
              aria-role="dialog"
              aria-modal
            >
              <type-attach-effect v-model="props.row.data" />
            </b-modal>
            <b-modal
              :active.sync="modal.modalOpenTaunt"
              has-modal-card
              trap-focus
              aria-role="dialog"
              aria-modal
            >
              <type-taunt v-model="props.row.data" />
            </b-modal>
            <b-modal
              :active.sync="modal.modalOpenSwep"
              has-modal-card
              trap-focus
              aria-role="dialog"
              aria-modal
            >
              <type-weapon v-model="props.row.data" />
            </b-modal>
          </div>
          <div class="column">
            <div v-if="props.row.icon" class="field" style="
                display: flex;
                align-items: center;
                justify-content: center;
            "><img :src="props.row.icon" style="
                border: 1px solid #333;
                border-radius: 5px;
                width: 250px;
            "></div>
            <b-field label="Скрипт, отвечающий за надевание">
              <b-input v-model="props.row.compile_string_equip" type="textarea" />
            </b-field>
            <b-field label="Скрипт, отвечающий за снятие">
              <b-input v-model="props.row.compile_string_holster" type="textarea" />
            </b-field>
            <div class="field">
              <b-button expanded @click="saveItem(props.row)">
                Сохранить
              </b-button>
            </div>
            <div v-if="props.row.user_id" class="field">
              <b-message type="is-warning">
                У предмета есть владелец <b>{{ props.row.owner.username }}</b>, так что будь внимателен, если захочешь поменять что-то
              </b-message>
            </div>
            <div class="field">
              <b-button expanded>
                Кнопка №3
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
import _ from 'lodash'
import axios from 'axios'
import TypeAttachment from '~/components/admin/pointshop/items/types/Attachments'
import TypeModel from '~/components/admin/pointshop/items/types/Models'
import TypeDeathEffect from '~/components/admin/pointshop/items/types/DeathEffects'
import TypeAttachEffect from '~/components/admin/pointshop/items/types/AttachEffects'
import TypeTaunt from '~/components/admin/pointshop/items/types/Taunts'
import TypeWeapon from '~/components/admin/pointshop/items/types/Weapons'

export default {
  middleware: 'can',
  meta: {
    permission: 'ap-mng-ps-items'
  },
  components: {
    TypeAttachment,
    TypeDeathEffect,
    TypeModel,
    TypeAttachEffect,
    TypeTaunt,
    TypeWeapon
  },
  data: () => ({
    modal: {
      modalOpenAttach: false,
      modalOpenModel: false,
      modalOpenDeathEffect: false,
      modalOpenAttachEffect: false,
      modalOpenTaunt: false,
      modalOpenSwep: false,
      text: {
        attach: 'Аттач',
        model: 'Модель',
        deatheffect: 'Эффект смерти',
        attacheffect: 'Аттач-эффект',
        taunt: 'Таунт',
        swep: 'Оружие'
      }
    },
    data: [],

    roles: [],

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
    computedRolesForDragnDrop () {
      return (data) => {
        const out = []
        // console.log(data)
        if (data === null || data === undefined) {
          return 'Пусто'
        }
        if (data.length === 0) {
          return 'Пусто'
        }
        data.map((element) => {
          const p = _.find(this.roles, { id: element })
          if (p) {
            out.push(p.name)
          }
          // if (this.roles[element]) {
          // out.push(this.roles[element].short_name)
          // }
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
    axios.get('/api/admin/pointshop/items')
      .then((response) => {
        this.data = response.data
      })

    axios.get('/api/admin/roles/show')
      .then((res) => {
        this.roles = res.data.roles
      })
  },
  methods: {
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
      axios.post(`/api/admin/pointshop/items/${data.id}/save`, { ...data })
        .then((res) => {
          console.log(res)
        })
    },
    createItem () {
      axios.put('/api/admin/pointshop/items/create')
        .then((res) => {
          // console.log(res)
          this.data.push(res.data)
        })
    },
    changeCategory () {

    }
  }
}
</script>
