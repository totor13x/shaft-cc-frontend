<template>
  <div v-if="info" class="card">
    <div class="card-content">
      <p class="title">
        {{ info.name }}
      </p>
      <p class="subtitle">
        {{ info.price_format }}
      </p>

      <div class="content">
        <p>
          {{
            info.description !== null
              ? info.description
              : 'Нет описания :c'
          }}
        </p>
      </div>
      <div class="content">
        <p>
          <b>Категория:</b> {{ info.category }}
        </p>
        <p v-if="info.is_global">
          <b>Активируется на всех ресурсах Шафта</b>
        </p>
        <p v-else>
          <b>Доступен на серверах:</b> {{ $_.values(info.servers).join(',') }}
        </p>
        <p>
          <b>Возможность передать:</b>

          <b-tag
            rounded
            :class="
              info.is_tradable
                ? 'is-primary'
                : ''
            "
          >
            {{
              info.is_tradable
                ? 'Да'
                : 'Нет'
            }}
          </b-tag>
        </p>
        <p v-if="info.is_once">
          <b>Доступен к покупке всего лишь один раз:</b>

          <b-tag
            rounded
            :class="
              info.is_once
                ? 'is-primary'
                : ''
            "
          >
            {{
              info.is_once
                ? 'Да'
                : 'Нет'
            }}
          </b-tag>
        </p>
      </div>
      <div v-if="showActions" class="button-modal">
        <b-dropdown
          v-if="!info.is_global"
          v-model="server"
          aria-role="list"
          position="is-top-left"
        >
          <template v-if="server" #trigger>
            <b-button
              :label="servers[server].beautiful_name"
              type="is-primary"
              icon-right="menu-down"
            />
          </template>
          <template v-else #trigger>
            <b-button
              label="Выбери сервер"
              type="is-primary"
              icon-right="menu-down"
            />
          </template>

          <b-dropdown-item
            v-for="(serv, key) in getServers(info)"
            :key="key"
            :value="key"
            aria-role="listitem"
          >
            <div class="media" :style="{color: server !== key ? getColor(serv.id_name) : '#ffffff'}">
              <div class="media-content">
                <h3>
                  {{ serv.beautiful_name }}
                </h3>
              </div>
            </div>
          </b-dropdown-item>
        </b-dropdown>
        <b-button
          type="is-primary"
          @click="buyItem()"
        >
          Приобрести
        </b-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: Object,
    showActions: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    server: null
  }),
  computed: {
    servers () {
      return (this && this.$store && this.$store.getters['config/config'].servers) || ''
    }
  },
  methods: {
    buyItem () {
      const item = this.info
      if (!item.is_global) {
        if (!this.server) {
          this.$buefy.toast.open({
            message: 'Не выбран сервер',
            type: 'is-danger'
          })
          return
        } else {
          this.server = null
        }
      }

      const server = this.servers[this.server]
      let message = ''
      if (item.is_global) {
        message = `Подтверди, ты хочешь купить ${item.name}`
      } else {
        message = `Подтверди, ты хочешь купить ${item.name} на ${server.beautiful_name} по стоимости ${item.price_format}?`
      }
      this.$buefy.snackbar.open({
        message,
        actionText: 'Да, купить',
        type: 'is-success',
        onAction: () => {
          this.$axios.post(`/api/tts/item/${item.id}/buy`, {
            server_id: this.server
          })
            .then(({ data }) => {
              this.$buefy.toast.open({
                message: data.data,
                type: 'is-success'
              })
              this.$emit('close', true)
              // this.items = data.data
            })
            .catch(errors => this.$axios.errorHandler(errors))
        }
      })
    },
    getColor (status) {
      let color = '#e22c2c'
      if (status === 'online') {
        color = '#29c711'
      }
      const id = this.$_.find(this.servers, { id_name: status })
      // console.log(id, status)
      if (id) {
        const c = id.color
        color = `rgb(${c.r},${c.g},${c.b})`
      }
      return color
    },
    getServers (item) {
      // eslint-disable-next-line prefer-const
      let srvs = {}
      this.$_.each(item.servers, (srv, key) => {
        // console.log(this.servers, { id: key })
        const it = this.$_.find(this.servers, { id: Number(key) })
        // console.log(it)
        if (it) {
          srvs[key] = it
        }
      })
      console.log(srvs)
      return srvs
      // this.$_.map(
      //   this.servers,
      //   (el) => {
      //     return this.$_.findservers, { id: item })
      //   }
      // )
    }
  }
}
</script>
<style lang='scss' scoped>
  .button-modal {
    text-align: center;
    flex: 1;
  }
</style>
