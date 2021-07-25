<template>
  <div>
    <b-field>
      <b-dropdown
        v-model="selectedCategory"
        aria-role="list"
      >
        <button slot="trigger" class="button is-primary" type="button">
          <span>{{ selectedCategory }}</span>
          <b-icon icon="menu-down" />
        </button>

        <b-dropdown-item v-for="(name, key) in filteredCategory" :key="key" :value="name" aria-role="listitem">
          <span>{{ name }}</span>
        </b-dropdown-item>
      </b-dropdown>
      <b-button @click="createCategory()">
        Задать категории параметры
      </b-button>
    </b-field>
    <b-table
      ref="childTable"
      :data="categories"
      :show-detail-icon="true"
      :bordered="true"
      :hoverable="true"
      detailed
      @details-open="closeAllOthersRows"
    >
      <b-table-column v-slot="props" field="id" label="ID" width="40" numeric>
        {{ props.row.id }}
      </b-table-column>
      <b-table-column v-slot="props" field="name" label="Name">
        {{ props.row.name }}
      </b-table-column>

      <template slot="detail" slot-scope="props">
        <div class="columns">
          <div class="column">
            <b-field label="Название">
              <b-input v-model="props.row.name" />
            </b-field>
            <b-field label="Максимум одетых предметов в категории">
              <b-input v-model="props.row.max_items" type="number" />
            </b-field>
            <b-field label="Разрешен предпросмотр предмета">
              <b-switch
                v-model="props.row.have_preview"
                :true-value="1"
                :false-value="0"
              />
            </b-field>
            <b-field label="Скрипт, отвечающий за надевание">
              <b-input v-model="props.row.compile_string_equip" type="textarea" />
            </b-field>
            <b-field label="Скрипт, отвечающий за снятие">
              <b-input v-model="props.row.compile_string_holster" type="textarea" />
            </b-field>
          </div>
          <div class="column">
            <div class="field">
              <b-button expanded @click="saveCategory(props.row)">
                Кнопка №1
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

export default {
  middleware: 'can',
  meta: {
    permission: 'ap-mng-ps-categories'
  },
  data: () => ({
    selectedCategory: '',

    list: [],
    categories: []
  }),
  computed: {
    filteredCategory () {
      const canCreate = []
      canCreate.push(...this.list)
      this.categories.map((element, key) => {
        console.log(element.name)
        console.log(canCreate, canCreate.includes(element.name, 0))
        if (canCreate.includes(element.name)) {
          canCreate.splice(canCreate.indexOf(element.name), 1)
        }
      })
      return canCreate
    }
  },
  mounted () {
    axios.get('/api/admin/pointshop/categories')
      .then((response) => {
        console.log(response)
        this.list = response.data.list
        this.categories = response.data.categories
      })
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
    createCategory () {
      if (this.selectedCategory === 'null') { return }
      axios.put('/api/admin/pointshop/categories/create', { category: this.selectedCategory })
        .then((res) => {
          // console.log(res)
          this.selectedCategory = ''
          this.categories.push(res.data)
        })
    },
    saveCategory (data) {
      console.log(data)
      // {category_id}/save
      axios.post(`/api/admin/pointshop/categories/${data.id}/save`, { ...data })
        .then((res) => {
          console.log(res)
        })
    }
  }
}
</script>
