<template>
  <section>
    <!-- {{ permissions }} -->
    <div class="buttons">
      <b-button
        @click="create()"
      >
        Создать новую роль
      </b-button>
    </div>
    <b-table
      :data="roles"
      bordered
      show-detail-icon
      detailed
      detail-key="id"
      default-sort-direction="desc"
      default-sort="immunity"
    >
      <b-table-column v-slot="props" field="id" label="ID" :width="'20%'" sortable>
        {{ props.row.id }}
      </b-table-column>
      <b-table-column v-slot="props" field="name" label="Name" :width="'25%'">
        {{ props.row.name }}
      </b-table-column>
      <b-table-column v-slot="props" field="slug" label="Slug" :width="'25%'">
        {{ props.row.slug }}
      </b-table-column>
      <b-table-column v-slot="props" field="immunity" label="Иммунитет" :width="'20%'" sortable>
        {{ props.row.immunity }}
      </b-table-column>
      <b-table-column v-slot="props" field="roles" label="Permissions" :width="'10%'">
        {{ Object.keys(props.row.permissions).length }}
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
            <b-field label="Иммунитет - основа иерархии">
              <b-input v-model="props.row.immunity" />
            </b-field>
            <b-field>
              <b-button
                @click="save(props.row.id)"
              >
                Сохранить
              </b-button>
            </b-field>
          </div>
          <div class="column">
            <b-field>
              <b>
                Все связи прав
              </b>
            </b-field>
            <b-field v-if="props.row.permissions.length == 0">
              Нет связей
            </b-field>
            <b-field v-for="(val, key) in props.row.permissions" :key="key" grouped>
              <p class="control" style="flex: 1">
                <b-button
                  type="is-primary"
                  expanded
                >
                  {{ key }}
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
    permission: 'ap-mng-roles'
  },
  data: () => ({
    roles: []
  }),
  mounted () {
    axios.get('/api/admin/roles/show')
      .then((res) => {
        this.roles = res.data.roles
      })
  },
  methods: {
    save (key) {
      // const data = this.roles[key]
      const roleFound = this.roles.find(role => role.id === key)
      // console.log(roleFound)
      axios.post(`/api/admin/roles/${roleFound.id}/save`, { data: roleFound })
    },
    create () {
      axios.put('/api/admin/roles/create')
        .then((res) => {
          res.data.permissions = []
          this.roles.push(res.data)
        })
    }
  }
}
</script>
