<template>
  <div class="box">
    <div class="columns">
      <div class="column is-8">
        <b-field label="Автор трека">
          <b-input
            v-model="track_update.track_author"
          />
          <!-- <b-switch
            v-model="props.row.always"
            :true-value="1"
            :false-value="0"
          /> -->
        </b-field>
        <b-field label="Название трека">
          <b-input
            v-model="track_update.track_name"
          />
          <!-- <b-switch
            v-model="props.row.always"
            :true-value="1"
            :false-value="0"
          /> -->
        </b-field>
        <b-field label="Доступность всем">
          <!-- <b-input
            v-model="track.track_update_author"
          /> -->
          <b-switch
            v-model="track_update.is_shared"
          />
        </b-field>
        <b-field label="Выдать доступ">
          <b-field grouped group-multiline>
            <p
              v-for="(user, key) in track_update.shared_users"
              :key="key"
              class="control"
            >
              <b-tag
                type="is-primary"
                attached
                closable
                aria-close-label="Close tag"
                @close="steam_remove(key)"
              >
                <b-tooltip
                  :label="user.steam_id32"
                >
                  {{ user.username }}
                </b-tooltip>
              </b-tag>
            </p>
            <!-- <b-taginput
              v-model="track.shared_user_ids"
              ellipsis
              icon="label"
              placeholder="STEAM_0:1:1"
            />
          </b-field> -->
          </b-field>
        </b-field>

        <b-field>
          <b-field>
            <b-input v-model="steamid" placeholder="STEAM_0:1:1" />
            <p class="control">
              <b-button
                class="button is-primary"
                @click="steam_check"
              >
                Добавить
              </b-button>
            </p>
          </b-field>
        </b-field>

        <!-- {{ track }} -->
      </div>
      <div class="column">
        <!-- <b-field> -->
        <b-field label="Форма трека">
          <img v-if="track.system != 'old'" :src="track.cdn_waveform">
          <div v-else>Для треков из старой системы недоступно</div>
        </b-field>
        <b-field label="Действия">
          <b-button
            type="is-success"
            @click="edit"
          >
            Сохранить изменения
          </b-button>
        </b-field>
        <b-field>
          <b-button
            type="is-danger"
            @click="clear"
          >
            Очистить слот (7 плюшек)
          </b-button>
        </b-field>
        <b-field label="Информация о треке">
          Длительность: {{ track.length }}
        </b-field>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: [
    'track'
  ],
  data: () => ({
    track_update: [],
    steamid: ''
  }),
  mounted () {
    this.track_update = JSON.parse(JSON.stringify(this.track))
  },
  methods: {
    steam_check () {
      axios.post('/api/track/steam_check', { steamid: this.steamid })
        .then((res) => {
          const user = res.data

          this.track_update.shared_user_ids = this.track_update.shared_user_ids || this.$set(this.track_update, 'shared_user_ids', [])
          this.track_update.shared_users = this.track_update.shared_users || this.$set(this.track_update, 'shared_users', [])

          if (!this.track_update.shared_user_ids.includes(user.id)) {
            this.track_update.shared_user_ids.push(user.id)
            this.track_update.shared_users.push(user)
          }
        })
        .catch(errors => this.$axios.errorHandler(errors))
    },
    steam_remove (key) {
      this.track_update.shared_user_ids.every((id, ke) => {
        if (this.track_update.shared_users[key].id === id) {
          this.track_update.shared_user_ids.splice(ke, 1)
          this.track_update.shared_users.splice(key, 1)
        }
      })
    },
    edit () {
      axios.patch('/api/track/edit', { ...this.track_update })
        .then((res) => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Изменения сохранены',
            position: 'is-bottom',
            queue: false,
            type: 'is-success'
          })
          this.$root.$emit('track_data_change', this.track_update)
          // this.$set(this, 'track', this.track_update)
        })
        .catch(errors => this.$axios.errorHandler(errors))
    },
    clear () {
      axios.patch('/api/track/delete', { id: this.track_update.id })
        .then((res) => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Слот очищен',
            position: 'is-bottom',
            queue: false,
            type: 'is-success'
          })
          this.track.path = null
          this.$parent.close()
        })
        .catch(errors => this.$axios.errorHandler(errors))
    }
  }
}
</script>
