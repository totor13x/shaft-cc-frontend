<template>
  <section>
    <!-- {{ permissions }} -->
    <div class="buttons">
      <b-button
        @click="create()"
      >
        Создать новый аргумент
      </b-button>
    </div>
    <b-table
      :data="permissions"
      bordered
      show-detail-icon
      detailed
      detail-key="id"
    >
      <b-table-column v-slot="props" field="id" label="ID">
        {{ props.row.id }}
      </b-table-column>
      <b-table-column v-slot="props" field="name" label="Name">
        {{ props.row.name }}
      </b-table-column>
      <b-table-column v-slot="props" field="slug" label="Slug">
        {{ props.row.slug }}
      </b-table-column>
      <b-table-column v-slot="props" field="roles" label="Roles">
        {{ props.row.roles.length }}
      </b-table-column>
      <template slot="detail" slot-scope="props">
        <div class="columns">
          <div class="column">
            <!-- {{props}} -->
            <b-field label="Название">
              <b-input v-model="props.row.name" />
            </b-field>
            <b-field label="Slug - уникальный ID">
              <b-input v-model="props.row.slug" />
            </b-field>
            <b-field>
              <b-button
                @click="save(props.index)"
              >
                Сохранить
              </b-button>
            </b-field>
          </div>
          <div class="column">
            <b-field>
              <b>
                Все связи ролей
              </b>
            </b-field>
            <b-field v-if="props.row.roles.length == 0">
              Нет связей
            </b-field>
            <b-field v-for="(val, key) in props.row.roles" :key="key" grouped>
              <p class="control" style="flex: 1">
                <b-button
                  type="is-primary"
                  expanded
                >
                  {{ val.name }} - {{ val.slug }}
                </b-button>
              </p>
              <!-- <p class="control">
                <b-button
                  type="is-danger"
                  icon-right="close"
                  @click="() => {props.row.roles.splice(key, 1)}"
                />
              </p> -->
            </b-field>
            <!-- <b-field grouped>
              <p class="control">
                <b-dropdown
                  v-model="props.row.roles"
                  multiple
                  aria-role="list"
                >
                  <button slot="trigger" class="button is-primary" type="button">
                    <span>Выбрано ({{ props.row.roles.length }})</span>
                    <b-icon icon="menu-down" />
                  </button>

                  <b-dropdown-item v-for="(opt, ke) in roles" :key="ke" :value="opt.slug" aria-role="listitem">
                    <span>{{ opt.name }}</span>
                  </b-dropdown-item>
                </b-dropdown>
              </p>
              <p class="control">
                <b-button
                  type="is-primary"
                  @click="saveRoles(props.row.id, props.row.roles)"
                >
                  Сохранить
                </b-button>
              </p>
            </b-field> -->
          </div>
        </div>
      </template>
    </b-table>
  </section>
</template>
<script>
import axios from 'axios'
export default {
  middleware: 'can',
  meta: {
    permission: 'ap-mng-permission'
  },
  data: () => ({
    permissions: []
  }),
  mounted () {
    axios.get('/api/admin/permissions/show')
      .then((res) => {
        this.permissions = res.data
      })
  },
  methods: {
    save (key) {
      const data = this.permissions[key]
      // eslint-disable-next-line object-shorthand
      axios.post(`/api/admin/permissions/${data.id}/save`, { data: data })
      // .then((res) => {
      //   this.permissions = res.data.permissions
      //   this.roles = res.data.roles
      // })
      // console.log(id, permission)
    },
    create () {
      axios.put('/api/admin/permissions/create')
        .then((res) => {
          res.data.roles = []
          this.permissions.push(res.data)
        })
    }
  }
}
</script>
