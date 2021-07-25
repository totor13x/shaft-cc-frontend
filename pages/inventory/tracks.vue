<template>
  <div>
    <div class="notification field">
      <b-button
        class="is-pulled-right"
        @click="create"
      >
        Купить слот
      </b-button>
      <div>
        У тебя сейчас <b>{{ tracks.length }} {{ $plural('слот_слота_слотов', tracks.length) }}</b>
      </div>
      <div>
        Всего свободно <b>{{ tracks.filter(track => {return track.path === null}).length }} {{ $plural('слот_слота_слотов', tracks.filter(track => {return track.path === null}).length) }}</b>
      </div>
      <div>
        Покупка слота стоит - {{ economy_tracks.buy_slot }} плюшек
      </div>
      <div>
        Очистка слота от трека - {{ economy_tracks.clear_slot }} плюшек
      </div>
    </div>
    <article v-for="(track, key) in tracks" :key="key" class="media" :class="track.path == null ? 'is_null' : '' ">
      <b-upload v-if="track.path == null" v-model="track.drop" drag-drop class="media-content" :type="track.errors ? 'is-danger' : ''" @input="updateSlot(key)">
        <span v-if="!track.drop">
          Слот свободен. Нажми на меня и выбери файл или дропни его в поле
        </span>
        <span v-else>
          К загрузке выбран {{ track.drop.name }}

          <button class="button is-small is-success is-pulled-right" @click="upload(key)">
            <span class="icon has-text-white"><i class="mdi mdi-upload" aria-hidden="true" /></span>
          </button>
          <!-- <button class="button is-small is-warning is-pulled-right" @click="clear(key)">
            <span class="icon has-text-white"><i class="mdi mdi-delete" aria-hidden="true" /></span>
          </button> -->
          <div v-if="track.errors">
            <div v-for="(error, key1) in track.errors" :key="key1" class="is-size-7 has-text-danger">
              {{ error }}
            </div>
          </div>
          <div v-if="track.progress" style="margin-top:10px">
            <b-progress
              :value="track.progress.value"
              size="is-small"
              show-value
            >
              {{ track.progress.text }}
            </b-progress>
          </div>
        </span>
      </b-upload>
      <span v-else-if="!track.is_uploaded">
        Трек в обработке
      </span>
      <div v-else class="media-content">
        <div class="content">
          <strong>{{ track.track_author }}</strong> - {{ track.track_name }}
        </div>
      </div>
      <div v-if="track.path != null && track.is_uploaded" class="media-rigth">
        <span v-if="track.is_shared" class="icon has-text-success">
          <i class="mdi mdi-eye-outline" aria-hidden="true" />
        </span>
        <span v-else class="icon has-text-primary">
          <i class="mdi mdi-eye-off-outline" aria-hidden="true" />
        </span>

        <button class="button is-small is-info" @click="openModal(key)">
          <span class="icon">
            <i class="mdi mdi-grease-pencil" />
          </span>
        </button>
      </div>
    </article>
    <b-modal
      :active.sync="modal.open"
      trap-focus
      aria-role="dialog"
      aria-modal
      @close="closeModal"
    >
      <modal-edit :track="modal.track" />
    </b-modal>
  </div>
</template>
<script>
import { validate } from 'vee-validate'
import modalEdit from '~/components/inventory/tracks/Edit'
const _ = require('lodash')
export default {
  components: {
    modalEdit
  },
  data: () => ({
    modal: {
      open: false,
      track: null
    },
    tracks: [],
    ws: false
  }),
  computed: {
    // config: () => window.config,
    // economy: () => this && this.$store && this.$store.getters['config/config'].steamAuth,
    economy_tracks () {
      // console.log()
      return (this && this.$store && this.$store.getters['config/config'].economy && this.$store.getters['config/config'].economy.tracks) || {}
    }
  },
  mounted () {
    console.log('123')
    this.load()

    this.ws = this.$ws.subscribe('inventory/tracks')
    this.ws.on('error', (data) => {
      console.log(data)
    })
    this.ws.on('updateTrack', (data) => {
      // console.log(data)
      this.$axios.get('/api/track/show')
        .then((res) => {
          const findedTrack = _.find(res.data, { id: data.track_id })
          const findedTrackIndex = _.findIndex(this.tracks, { id: data.track_id })

          this.$set(this.tracks, findedTrackIndex, findedTrack)
          // console.log(findedTrack, findedTrackIndex)
          // res.data.forEach((track) => {

          // })
          // this.tracks = res.data
        })
        // .catch(res => console.log(res))
    })
  },
  destroyed () {
    this.ws.close()
  },
  methods: {
    load () {
      this.$axios.get('/api/track/show')
        .then((res) => {
          this.tracks = res.data
        })
        .catch(res => console.log(res))
    },
    updateSlot (key) {
      // this.$destroy(this.tracks[key], 'errors')
      this.$set(this.tracks[key], 'errors', null)
      // this.tracks[key].errors = null
    },
    upload (key) {
      validate(
        this.tracks[key].drop,
        'ext:mp3,ogg,wav,mp4|size:38000',
        {
          name: 'трек',
          customMessages: {
            ext: 'Файл должен быть формата mp3, ogg, wav, mp4',
            size: 'Файл не должен превышать 8 МБ'
          }
        }
      ).then((result) => {
        console.log(result)
        // console.log(this.tracks)
        if (result.valid) {
          const formData = new FormData()
          formData.append('file', this.tracks[key].drop)
          formData.append('track_id', this.tracks[key].id)

          this.$axios.post('/api/track/upload', formData, {
            headers: {
              'Content-Type': 'multipart/x-www-form-urlencoded'
            },
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent
              const value = parseInt(Math.round((loaded / total) * 100))
              this.$set(this.tracks[key], 'progress', {})
              this.tracks[key].progress = {
                value,
                text: `Загрузка на сервер: ${value}%`
              }
              if (value === 100) {
                let dottet = 1

                if (this.tracks[key].intervalTimer !== undefined) {
                  clearInterval(this.tracks[key].intervalTimer)
                }

                this.tracks[key].intervalTimer = setInterval(() => {
                  this.tracks[key].progress = {
                    value: 100,
                    text: 'Обработка данных' + '.'.repeat(dottet)
                  }
                  dottet++
                  if (dottet === 4) dottet = 1
                }, 500)
              }
            }
          })
            .then((res) => {
              clearInterval(this.tracks[key].intervalTimer)
              this.$delete(this.tracks[key], 'progress')
              this.tracks[key].intervalTimer = undefined
              this.tracks[key].progress = undefined

              this.$nextTick(() => {
                this.$set(this.tracks, key, res.data)
              })

              this.$buefy.toast.open({
                duration: 5000,
                message: 'В слот загружен трек',
                position: 'is-bottom',
                queue: false,
                type: 'is-success'
              })
            })
            .catch(errors => this.$axios.errorHandler(errors))
            .finally(() => {
              clearInterval(this.tracks[key].intervalTimer)
              this.$delete(this.tracks[key], 'progress')
              this.tracks[key].intervalTimer = undefined
              this.tracks[key].progress = undefined
            })
        } else {
          this.$set(this.tracks[key], 'errors', result.errors)
          // this.tracks[key].errors = result.errors
        }
      })
    },
    create () {
      this.$axios.put('/api/track/create')
        .then((res) => {
          this.tracks.unshift(res.data)
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Куплен новый слот',
            position: 'is-bottom',
            queue: false,
            type: 'is-success'
          })
        })
        .catch(errors => this.$axios.errorHandler(errors))
    },
    openModal (key) {
      this.modal.open = true
      this.modal.track = this.tracks[key]
      this.$root.$on('track_data_change', (data) => {
        // console.log(data)
        this.$set(this.tracks, key, JSON.parse(JSON.stringify(data))) // Понимаю, но так работает клонирование без линковки в компонент
      })
    },
    closeModal () {
      this.$root.$off('track_data_change')
    }
  }
}
</script>
<style lang="scss">
  .is_null > .upload > .upload-draggable{
    /* border: 1px solid #333; */
    padding: 10px;
    border-radius: 0px;
    width: 100%;
    /* border-style: dashed; */
    span {
      vertical-align: middle;
    }
  }
</style>
