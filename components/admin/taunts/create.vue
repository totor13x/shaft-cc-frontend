<template>
  <div>
    <div
      class="modal-card"
      :style="{
        width: edit ? 'auto' : '800px'
      }"
    >
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{
            edit
              ? `Редактирование ${prop.row.name}`
              : 'Добавление нового таунта'
          }}
        </p>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <b-field>
              <b-upload
                v-model="val.dropFiles"
                multiple
                drag-drop
              >
                <section class="section">
                  <div class="content has-text-centered">
                    <p>
                      <b-icon
                        icon="upload"
                        size="is-large"
                      />
                    </p>
                    <p>Дропни сюда звуки таунтов</p>
                  </div>
                </section>
              </b-upload>
            </b-field>
          </div>
          <div class="column">
            <b-field label="slug">
              <b-input v-model="val.slug" required />
            </b-field>
            <b-field label="name">
              <b-input v-model="val.name" required />
            </b-field>
            <b-field label="Enabled">
              <b-checkbox v-model="val.isEnabled">
                {{ val.isEnabled }}
              </b-checkbox>
            </b-field>
            <b-field label="OnPositive">
              <div class="tags">
                <draggable
                  :list="val.sorted.OnPositive"
                  group="tracks"
                  :style="'width:100%'"
                >
                  <div
                    v-for="(file, index) in val.sorted.OnPositive"
                    :key="index"
                    class="control"
                  >
                    <b-taglist attached>
                      <b-tag
                        type="is-primary"
                      >
                        {{ renamed[file.name] || file.name }}
                      </b-tag>
                      <div
                        class="tag"
                        @click="renameFile(renamed[file.name] || file.name, file.name)"
                      >
                        <b-icon
                          icon="pen"
                          size="is-small"
                        />
                      </div>
                      <div
                        class="tag"
                        @click="playAudio(index, val.sorted.OnPositive)"
                      >
                        <b-icon
                          icon="play"
                          size="is-small"
                        />
                      </div>
                      <div
                        class="tag is-delete"
                        @click="moveToBackDrop(index, val.sorted.OnPositive)"
                      />
                    </b-taglist>
                  </div>
                </draggable>
                <span v-if="val.sorted.OnPositive.length == 0" class="tag">
                  Начинай заполнять список, просто перенеся сюда блок
                </span>
              </div>
            </b-field>
            <b-field label="OnDeath">
              <div class="tags">
                <draggable
                  :list="val.sorted.OnDeath"
                  group="tracks"
                  :style="'width:100%'"
                >
                  <div
                    v-for="(file, index) in val.sorted.OnDeath"
                    :key="index"
                    class="control"
                  >
                    <b-taglist attached>
                      <b-tag
                        type="is-primary"
                      >
                        {{ renamed[file.name] || file.name }}
                      </b-tag>
                      <div
                        class="tag"
                        @click="renameFile(renamed[file.name] || file.name, file.name)"
                      >
                        <b-icon
                          icon="pen"
                          size="is-small"
                        />
                      </div>
                      <div
                        class="tag"
                        @click="playAudio(index, val.sorted.OnDeath)"
                      >
                        <b-icon
                          icon="play"
                          size="is-small"
                        />
                      </div>
                      <div
                        class="tag is-delete"
                        @click="moveToBackDrop(index, val.sorted.OnDeath)"
                      />
                    </b-taglist>
                  </div>
                </draggable>
                <span v-if="val.sorted.OnDeath.length == 0" class="tag">
                  Начинай заполнять список, просто перенеся сюда блок
                </span>
              </div>
            </b-field>
            <b-field label="OnKill">
              <div class="tags">
                <draggable
                  :list="val.sorted.OnKill"
                  group="tracks"
                  :style="'width:100%'"
                >
                  <div
                    v-for="(file, index) in val.sorted.OnKill"
                    :key="index"
                    class="control"
                  >
                    <b-taglist attached>
                      <b-tag
                        type="is-primary"
                      >
                        {{ renamed[file.name] || file.name }}
                      </b-tag>
                      <div
                        class="tag"
                        @click="renameFile(renamed[file.name] || file.name, file.name)"
                      >
                        <b-icon
                          icon="pen"
                          size="is-small"
                        />
                      </div>
                      <div
                        class="tag"
                        @click="playAudio(index, val.sorted.OnKill)"
                      >
                        <b-icon
                          icon="play"
                          size="is-small"
                        />
                      </div>
                      <div
                        class="tag is-delete"
                        @click="moveToBackDrop(index, val.sorted.OnKill)"
                      />
                    </b-taglist>
                  </div>
                </draggable>
                <span v-if="val.sorted.OnKill.length == 0" class="tag">
                  Начинай заполнять список, просто перенеся сюда блок
                </span>
              </div>
            </b-field>
          </div>
        </div>
        <div>
          <draggable
            :list="val.dropFiles"
            group="tracks"
            class="field is-grouped is-grouped-multiline"
          >
            <div
              v-for="(file, index) in val.dropFiles"
              :key="index"
              class="control"
            >
              <b-taglist attached>
                <b-tag
                  type="is-primary"
                >
                  {{ renamed[file.name] || file.name }}
                </b-tag>
                <div
                  class="tag"
                  @click="renameFile(renamed[file.name] || file.name, file.name)"
                >
                  <b-icon
                    icon="pen"
                    size="is-small"
                  />
                </div>
                <div
                  class="tag"
                  @click="playAudio(index, val.dropFiles)"
                >
                  <b-icon
                    icon="play"
                    size="is-small"
                  />
                </div>
                <div
                  class="tag is-delete"
                  @click="deleteDropFile(index)"
                />
              </b-taglist>
            </div>
          </draggable>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">
          Close
        </button>

        <button class="button is-primary" @click="passes(checkIn)">
          Сохранить
        </button>
      </footer>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: [
    'value',
    'edit',
    'prop'
  ],
  data () {
    return {
      playNow: false,
      renamed: {},
      val: {
        slug: '',
        name: '',
        isEnabled: false,
        dropFiles: [],
        sorted: {
          OnKill: [],
          OnDeath: [],
          OnPositive: []
        }
      }
    }
  },
  mounted () {
    if (this.edit) {
      console.log(this.prop)

      this.val.slug = this.prop.row.slug
      this.val.name = this.prop.row.name
      this.val.isEnabled = this.prop.row.is_enabled

      this.val.sorted.OnKill = this.prop.row.data.kill
      this.val.sorted.OnDeath = this.prop.row.data.death
      this.val.sorted.OnPositive = this.prop.row.data.positive
    }
  },
  watch: {
    val: {
      deep: true,
      handler (value) {
        this.$on('input_reverse', function (value) {
          this.$emit('input', value)
        })
      }
    }
  },
  methods: {
    checkIn () {
      // console.log(this.validate())
      this.$emit('input_reverse', this.val)
      this.$parent.close()
    },
    deleteDropFile (index) {
      this.val.dropFiles.splice(index, 1)
    },
    moveToBackDrop (index, array) {
      const element = array.splice(index, 1)
      this.val.dropFiles.push(...element)
    },
    playAudio (index, array) {
      let url = array[index]
      if (this.edit && url.s3) {
        url = `https://storage.shaft.cc/default/taunts/${this.prop.row.slug}/${url.s3}`
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
          // this.renamed[original] = value
          // this.$buefy.toast.open(`Your age is: ${value}`)
        }
      })
      // console.log(result, dialog)
    },
    passes () {
      const formData = new FormData()

      this.val.sorted.OnPositive.map((file) => {
        const data = file.s3 ? JSON.stringify(file) : file
        formData.append('positive[]', data)
      })
      this.val.sorted.OnDeath.map((file) => {
        const data = file.s3 ? JSON.stringify(file) : file
        formData.append('death[]', data)
      })
      this.val.sorted.OnKill.map((file) => {
        const data = file.s3 ? JSON.stringify(file) : file
        formData.append('kill[]', data)
      })

      formData.append('slug', this.val.slug)
      formData.append('name', this.val.name)
      formData.append('is_enabled', this.val.isEnabled)
      formData.append('renamed', JSON.stringify(this.renamed))

      let url
      if (this.edit) {
        url = `/api/admin/taunts/${this.prop.row.id}/save`
      } else {
        url = '/api/admin/taunts/create'
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
