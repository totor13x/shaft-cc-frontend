<template>
  <section>
    <b-table
      :data="permissions"
      bordered
      detail-key="id"
    >
      <!-- <template slot-scope="props"> -->
      <b-table-column
        v-slot="props"
        field="id"
        label=""
      >
        {{ props.row.name }}
      </b-table-column>
      <b-table-column
        v-for="(role, key) in roles"
        :key="key"
        v-slot="props"
        field="data"
        :label="role.slug"
      >
        <!-- {{ roles }} -->
        <b-checkbox
          v-model="role.permissions[props.row.slug]"
          @input="(value) => checkboxInput(key, props.row.slug, value)"
        />
        <!-- <b-checkbox
          @input="(value) => checkboxInput(key, props.row.slug, value)"
        /> -->
        <!-- {{ props.row.slug }} -->
      </b-table-column>
      <!-- </template> -->
      <template slot="footer">
        <td>
          Сохранение
        </td>
        <td
          v-for="(role, key) in roles"
          :key="key"
        >
          <b-tooltip :label="role.slug">
            <b-button
              icon-right="content-save-outline"
              @click="link(role.id)"
            />
          </b-tooltip>
          <!-- {{ props.row.slug }} -->
        </td>
      </template>
    </b-table>
  </section>
</template>
<script>
import axios from 'axios'
// TODO Может быть реализую проверку на изменения массивов
export default {
  middleware: 'can',
  meta: {
    permission: 'ap-mng-roles-link'
  },
  data: () => ({
    roles: [],
    permissions: [],
    original: {
      roles: [],
      permissions: []
    }
  }),
  mounted () {
    axios.get('/api/admin/roles/show')
      .then((res) => {
        this.roles = res.data.roles
        this.permissions = res.data.permissions
        this.$nextTick(() => {
          this.roles.forEach((el, key) => {
            if (el.permissions.length === 0) {
              this.$set(this.roles[key], 'permissions', {})
            }
            this.original.roles = this.roles
            this.original.permissions = this.permissions
          })
        })
      })
  },
  methods: {
    checkboxInput (id, slug, value) {
      if (!value) this.$delete(this.roles[id].permissions, slug)
      // console.log(this.roles[id].permissions, id, slug, value)
    },
    link (key) {
      // const data = this.roles[key]
      const roleFound = this.roles.find(role => role.id === key)
      // console.log(roleFound)
      axios.post(`/api/admin/roles/${roleFound.id}/link`, { data: roleFound.permissions })
    }
  }
}
</script>
