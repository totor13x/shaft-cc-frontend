<template lang="pug">
  div
    e-tabs(
      type="is-toggle-rounded"
      class="hide-tab-label-mobile block"
      expanded
      :no-content="true"
      v-model="tab"
    )
      b-tab-item(label="Твои предметы" icon="bottle-tonic-outline" value="my_items")
      b-tab-item(label="Твои рецепты" icon="briefcase-account-outline" value="my_recipes")
      b-tab-item(label="Рецепты" icon="briefcase-plus-outline" value="recipes")

    .block.has-text-centered(v-if="loading")
      b-icon(
        icon="loading"
        size="is-large"
        custom-class="mdi-spin"
      )
    .columns.is-multiline.is-mobile(v-else)
      .column.is-12
        .is-fullwidth.has-text-centered.notification.is-primary(
          v-if="items.length == 0"
        ) Категория пуста
      .column(
        :class="tab_classes[tab]"
        v-for="(item, key) in items"
        :key="key"
      )
        .item(v-if="tab == 'my_items'")
          b.field {{ key }}
          .field {{ item.length }} {{ $plural('штука_штуки_штук', item.length) }}
        .item.recipe(v-if="tab == 'my_recipes' || tab == 'recipes'")
          .title__item.field {{ item.name }}
          .subtitle__item Состав:
          .field
            .craftitem(v-for="(craftitem) in item.items")
              b.is-block {{ craftitem.name || 'ERROR' }}
              small {{ craftitem.count }} {{ $plural('штука_штуки_штук', craftitem.count) }}
          .columns.is-mobile
            .column
              b-button(
                type="is-primary"
                outlined
                expanded
                @click="recipeCraft(item.id)"
              ) Меню крафта
            .column(v-if="item.is_reworkable")
              b-button(
                type="is-info"
                outlined
                expanded
                @click="recipeRework(item.id)"
              ) Улучшить
    b-modal(
      :active.sync="modal.rework.open"
      width="400px"
    )
      .modal-card(style="width: auto")
        section.modal-card-body
          div В разработке
    b-modal(
      :active.sync="modal.craft.open"
      width="400px"
    )
      .modal-card(style="width: auto")
        section.modal-card-body
          div(v-if="modal.craft.loading")
            .block.has-text-centered
              b-icon(
                icon="loading"
                size="is-large"
                custom-class="mdi-spin"
              )
          div(v-else)
            div(v-if="modal.craft.data")
              .field.content
                img.subicon(
                  v-if="modal.craft.data.icon"
                  :src="modal.craft.data.icon"
                )
                h3.field {{ modal.craft.data.name }}
                .field
                  .subh4 Состав рецепта:
                  div(v-for="(item, key) in modal.craft.data.items" :key="key")
                    b {{ item.name }}
                    div Требуется: {{ item.count }} {{ $plural('штука_штуки_штук', item.count) }}
                    div В наличии: {{ item.have }} {{ $plural('штука_штуки_штук', item.have) }}
              .field(style="text-align:center;flex:1")
                b-dropdown(
                  v-if="modal.craft.data.servers"
                  v-model="modal.craft.server"
                  aria-role="list"
                  position="is-top-left"
                )
                  template(v-if="modal.craft.server" #trigger)
                    b-button(
                      :label="servers[modal.craft.server].beautiful_name"
                      type="is-primary"
                      icon-right="menu-down"
                    )
                  template(v-else #trigger)
                    b-button(
                      label="Выбери сервер"
                      type="is-primary"
                      icon-right="menu-down"
                    )

                  b-dropdown-item(
                    v-for="(serv, key) in getServers(modal.craft.data)"
                    :key="key"
                    :value="key"
                    aria-role="listitem"
                  )
                    .media(
                      :style="{color: modal.craft.server !== serv.id ? getColor(serv.id_name) : '#ffffff'}"
                    )
                      .media-content
                        h3 {{ serv.beautiful_name }}
                b-button(
                  :loading="modal.craft.b_loading"
                  :disabled="modal.craft.b_loading"
                  type="is-primary"
                  @click="startRecipeCraft"
                ) Скрафтить
</template>
<script>
export default {
  data: () => ({
    tab: 'my_items',
    items: [],
    loading: false,
    modal: {
      craft: {
        open: false,
        loading: false,
        id: null,
        data: false,
        b_loading: false,
        server: null
      },
      rework: {
        open: false,
        loading: false,
        id: null,
        data: false
      }
    },
    tab_classes: {
      my_items: [
        'is-full-mobile',
        'is-one-third-tablet',
        'is-one-third-desktop',
        'is-one-quarter-fullhd'
      ],
      my_recipes: [
        'is-full-mobile',
        'is-half-tablet'
      ],
      recipes: [
        'is-full-mobile',
        'is-half-tablet'
      ]
    }
  }),
  computed: {
    servers () {
      return (this && this.$store && this.$store.getters['config/config'].servers) || ''
    }
  },
  watch: {
    tab () {
      this.load()
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.loading = true
      this.$axios.get('/api/craft', {
        params: {
          type: this.tab
        }
      })
        .then(({ data }) => {
          this.items = data
        })
        .finally(() => {
          this.loading = false
        })
    },
    recipeCraft (id) {
      this.modal.craft.open = true
      this.modal.craft.id = id
      this.modal.craft.loading = true
      this.modal.craft.data = false

      this.$axios.post('/api/craft/recipe_craft/show', {
        recipe_id: this.modal.craft.id,
        type: this.tab
      })
        .then(({ data }) => {
          this.modal.craft.data = data
        })
        .finally(() => {
          this.modal.craft.loading = false
        })
    },
    startRecipeCraft () {
      if (!this.modal.craft.open) {
        return
      }
      this.modal.craft.b_loading = true
      this.$axios.post('/api/craft/recipe_craft/start', {
        recipe_id: this.modal.craft.id,
        type: this.tab,
        server_id: this.modal.craft.server
      })
        .then(({ data }) => {
          this.$buefy.toast.open({
            duration: 7000,
            message: data,
            position: 'is-bottom',
            queue: false,
            type: 'is-info'
          })
          this.modal.craft.id = null
          this.modal.craft.open = false
          this.modal.craft.server = null
          this.modal.craft.loading = false
          this.modal.craft.data = false

          // this.modal.craft.data = data
        })
        .catch(this.$axios.errorHandler)
        .finally(() => {
          this.modal.craft.b_loading = false
        })
    },
    recipeRework (id) {
      this.modal.rework.open = true
      this.modal.craft.id = id
    },
    getColor (status) {
      let color = '#e22c2c'
      if (status === 'online') {
        color = '#29c711'
      }
      const id = this.$_.find(this.servers, { id_name: status })
      if (id) {
        const c = id.color
        color = `rgb(${c.r},${c.g},${c.b})`
      }
      return color
    },
    getServers (item) {
      // eslint-disable-next-line prefer-const
      let srvs = {}
      this.$_.each(item.servers, (srvId, key) => {
        const it = this.$_.find(this.servers, { id: Number(srvId) })
        // console.log(it, srvId)
        if (it) {
          srvs[srvId] = it
        }
      })
      return srvs
    }
  }
}
</script>
<style lang="scss" scoped>
  .item {
    & > .title__item {
      font-size: 20px;
      font-weight: bold;
    }
    & > .subtitle__item {
      font-size: 18px;
      font-weight: bold;
    }
    &.recipe {
      padding: 0.75rem;
    }
    padding: 0.3rem 0.75rem;
    border-radius: 3px;
    background-color: rgb(237 , 237, 237);
    // border: 1px solid rgb(94, 130, 158);
  }
  .subh4 {
    font-size: 20px;
    font-weight: 500;
  }
  .subicon {
    height: 100px;
    border-radius: 7px;
    border: 1px solid rgba(74, 74, 74, 0.22);
    display: flex;
    position: relative;
    margin: 0 auto;
  }
  .craftitem {
    border-bottom: 1px solid rgba(74, 74, 74, 0.22);
    padding: 5px 0px;
    &:last-child {
      border: none;
    }
  }
</style>
