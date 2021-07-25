<template lang="pug">
  div(class="modal-card" :style="{ width: edit ? 'auto' : '700px' }")
    header(class="modal-card-head")
      p(class="modal-card-title")
        |  {{
        |    edit
        |      ? `Редактирование ${prop.row.name}`
        |      : 'Добавление нового таунта'
        |  }}

    section(class="modal-card-body")
      div(class="columns")
        div(class="column")
          div(class="field")
            div(class="columns")
              div(class="column")
                b-dropdown(
                  v-model="taunt_id"
                  aria-role="list"
                )
                  button(class="button is-primary" type="button" slot="trigger")
                    span {{ taunt_id || 'Not selected' }}
                    b-icon(icon="menu-down")

                  b-dropdown-item(
                    v-for="(slug, key) of slugOfListTaunts"
                    :key="key"
                    :value="slug"
                    aria-role="listitem"
                  )
                    span {{ slug }}
              div(class="column")
                b-button(type="is-danger" @click="taunt_id = null") DEL
          div(class="field")
            b-upload(
              v-model="dropFiles"
              multiple
              drag-drop
              :disabled="taunt_id != null"
            )
              section(class="section")
                div(class="content has-text-centered")
                  p
                    b-icon(
                      icon="upload"
                      size="is-large"
                    )
                  p Дропни сюда звуки таунтов
        div(class="column")
          b-field(label="Slug")
            b-input(
              v-model="slug"
            )
          b-field(label="Name")
            b-input(
              v-model="name"
            )
          div(class="field")
            draggable(
              :list="dropFiles"
              group="tracks"
              class="field is-grouped is-grouped-multiline"
            )
              div(
                v-for="(file, index) in dropFiles"
                :key="index"
                class="control"
              )
                b-taglist(attached)
                  b-tag(type="is-primary")
                    | {{ renamed[file.name] || file.name }}
                  div(
                    class="tag"
                    @click="renameFile(renamed[file.name] || file.name, file.name)"
                  )
                    b-icon(
                      icon="pen"
                      size="is-small"
                    )
                  div(
                    class="tag"
                    @click="playAudio(index, dropFiles)"
                  )
                    b-icon(
                      icon="play"
                      size="is-small"
                    )
                  div(
                    class="tag is-delete"
                    @click="deleteDropFile(index)"
                  )
    footer(class="modal-card-foot")
      button(class="button" type="button" @click="$parent.close()") Close
      button(class="button is-primary" @click="passes()") Сохранить
</template>
<script>
import draggable from 'vuedraggable'
import _ from 'lodash'
export default {
  components: {
    draggable
  },
  props: [
    'edit', 'prop'
  ],
  data: () => ({
    slug: null,
    name: null,
    taunt_id: null,
    renamed: {},
    dropFiles: [],
    listOfTaunts: []
  }),
  computed: {
    slugOfListTaunts () {
      return _.map(this.listOfTaunts, 'slug')
    }
  },
  watch: {
    taunt_id () {
      this.dropFiles = []
    }
  },
  mounted () {
    if (this.edit) {
      this.name = this.prop.row.name
      this.slug = this.prop.row.slug
      // console.log(ta)

      this.dropFiles = this.prop.row.data
    }
    this.$axios.get('/api/admin/prophunt/taunts/list-taunts')
      .then(({ data }) => {
        this.listOfTaunts = data
        if (this.edit) {
          const taunt = _.find(this.listOfTaunts, { id: this.prop.row.taunt_id })
          if (taunt) {
            this.taunt_id = taunt?.slug || null
          }
        }
      })
  },
  methods: {
    playAudio (index, array) {
      let url = array[index]
      if (this.edit && url.s3) {
        url = `https://storage.shaft.cc/default/ph/taunts/${this.prop.row.slug}/${url.s3}`
      } else {
        url = URL.createObjectURL(url)
      }

      if (this.playNow) {
        this.playNow.pause()
      }
      this.playNow = new Audio(url)
      this.playNow.play()
    },
    renameFile (name, original) {
      this.$buefy.dialog.prompt({
        message: 'Переименовывание таунта',
        closeOnConfirm: true,
        inputAttrs: {
          value: name,
          required: false
        },
        onConfirm: (value) => {
          if (value === '') {
            this.$delete(this.renamed, original)
            return
          }
          this.$set(this.renamed, original, value)
        }
      })
    },
    deleteDropFile (index) {
      this.dropFiles.splice(index, 1)
    },
    passes () {
      const formData = new FormData()

      this.dropFiles.map((file) => {
        const data = file.s3 ? JSON.stringify(file) : file
        formData.append('taunts[]', data)
      })

      formData.append('slug', this.slug)
      formData.append('name', this.name)
      // formData.append('is_enabled', this.val.isEnabled)
      const taunt = _.find(this.listOfTaunts, { slug: this.taunt_id })
      // console.log(ta)
      if (taunt) {
        formData.append('taunt_id', taunt?.id || null)
      }
      formData.append('renamed', JSON.stringify(this.renamed))

      let url
      if (this.edit) {
        url = `/api/admin/prophunt/taunts/${this.prop.row.id}/save`
      } else {
        url = '/api/admin/prophunt/taunts/create'
      }

      this.$axios.post(url,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
        .then((res) => {
          if (this.edit) {
            this.$emit('updated-taunt', {
              data: res.data,
              index: this.prop.index
            })
          }
        })
        .catch(function () {
        })
    }
  }
}
</script>
