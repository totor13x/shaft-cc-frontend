<template>
  <div class="columns">
    <div class="column is-8">
      <b-message v-if="!this.$store.getters['auth/check']" type="is-info" has-icon>
        Форма отправки сообщения недоступна
      </b-message>
      <div v-else class="box">
        <b-field
          :type="{'is-danger': errors.length > 0}"
          :message="errors.length > 0 ? $errors.ws('message', errors) : null"
        >
          <b-input v-model="message" placeholder="Ваше сообщение" maxlength="255" name="message" autocomplete="off" @keypress.native="clearKeys" />
        </b-field>
        <b-field>
          <b-button
            type="is-primary"
            :class="loadingClass"
            icon-right="send"
            @click="send"
          >
            Отправить
          </b-button>
        </b-field>
      </div>
      <div class="field">
        <transition-group
          name="staggered-fade"
          :css="false"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >
          <div
            v-for="(val, key) in list"
            :key="val.id"
            :data-index="key"
            style="display: inline-block;width: 100%;word-break: break-word;"
          >
            <span>
              <b-tooltip
                :label="$moment(val.created_at).local().format($moment.defaultFormat)"
                position="is-top"
                animated
              >
                [{{ momentNow(val.created_at) }}]
              </b-tooltip>
            </span>
            <tag v-if="val.tag_id" :tag-id="val.tag_id" />
            <avatar
              :user="val.user"
              :username="true"
              :clickOnly="true"
              class="is-inline-block"
            >
              <template#extra>
                <vs-button
                  v-permission="'ap-view'"
                  @click="() => $router.push(`/admin/user/${val.user.id}`)"
                >
                  Открыть в АП
                </vs-button>
              </template>
            </avatar>: {{ val.message }}
          </div>
        </transition-group>
      </div>
    </div>
    <div class="column">
      <div class="field">
        <b-message v-if="!this.$store.getters['auth/check']" type="is-info" has-icon>
          Список пользователей в онлайне недоступен. Зарегистрируйся и будет счастье &#10084;
        </b-message>
        <nav v-else class="panel is-primary">
          <p class="panel-heading">
            Юзеры в чате
          </p>
          <div v-for="(user, key) in users" :key="user.id" :data-index="key" class="panel-block">
            <span class="panel-icon" style="font-size: 20px;width: 0.5em;">
              <!-- <figure class="image is-20x20 is-inline-block">
                <img class="is-rounded is-small" :src="user.avatar">
              </figure> -->
              <avatar
                size="20"
                :user="user"
                class="is-inline-block"
              />
            </span>
            {{ user.username }}
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
<script>
import Velocity from 'velocity-animate'
export default {
  data: () => ({
    message: '',
    errors: [],
    list: [],
    users: [],
    isFirstLoaded: false,
    loadingClass: ''
  }),
  mounted () {
    this.chat = this.$ws.subscribe('chat')
    this.chat.on('ready', () => {
      // this.chat.emit('message', '123')
    })
    this.chat.on('load', (messages) => {
      this.list = messages
      this.isFirstLoaded = true
    })
    this.chat.on('message', (message) => {
      this.loadingClass = ''
      console.log(message)
      this.list.unshift(message)
      if (this.list.length > 20) {
        this.list.pop()
      }
    })
    this.chat.on('errors', (data) => {
      this.errors = data
      this.loadingClass = ''
    })
    this.chat.on('users', (data) => {
      this.users = data
    })
    this.chat.on('error', (data) => {
      console.log(data)
    })
  },
  destroyed () {
    this.chat.close()
  },
  methods: {
    clearKeys (e) {
      const keyCode = String(e.keyCode || e.code || e.keyIdentifier)
      if (keyCode === '13') { // enter
        e.preventDefault()
        this.send()
      }
      this.errors = []
    },
    momentNow (time) {
      return this.$moment(time).local().format('HH:mm:ss')
    },
    send () {
      // validate(this.message, 'required|min:2|max:255', { name: 'сообщение' }).then((result) => {
      // if (result.valid) {
      // this.$ws.emit('chat/global/create', this.message)
      this.chat.emit('message', this.message)
      this.message = ''
      this.loadingClass = 'is-loading'
      this.errors = []
      // } else {
      //   this.errors = result.errors
      // }
      // })
    },

    // стили для появления
    beforeEnter (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter (el, done) {
      const delay = el.dataset.index * (this.isFirstLoaded ? 50 : 150)
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave (el, done) {
      const delay = 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
}
</script>
