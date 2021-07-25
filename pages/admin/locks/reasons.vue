<template>
  <div>
    <b-field>
      <div class="buttons">
        <b-button @click="previewMode = !previewMode">
          {{ previewMode?'Переключится на редактирование':'Переключиться на превью' }}
        </b-button>
        <b-button v-if="!previewMode" @click="addNewReason">
          Добавить новый пункт в правилах
        </b-button>
        <b-button v-if="!previewMode" type="is-primary" @click="saveReasons">
          Сохранить
        </b-button>
      </div>
    </b-field>
    <div v-if="previewMode">
      <div v-for="(reason, key) in reasons" :key="key">
        <div v-if="reason.type == 'text'" class="reason">
          <div class="content">
            <mark-down :inlinerender="false">{{ reason.description }}</mark-down>
          </div>
        </div>
        <div v-if="reason.type == 'rule'" class="reason">
          <span>
            <b-tooltip
              v-if="reason.penalties && reason.penalties.length > 0"
              type="is-dark"
              position="is-bottom"
              class="fix-tooltip-pre"
            >
              <template v-slot:content>
                <div v-html="formatPenalties(reason.penalties)" />
              </template>
              <b-icon
                icon="clock-alert-outline"
                size="is-small"
                custom-class="mdi-spin has-text-danger"
              />
            </b-tooltip>
          </span>
          <b>{{ reason.slug }}</b>
          -
          <mark-down>{{ reason.description }}</mark-down>
          <div v-if="reason.comments && reason.comments.length > 0">
            <div
              v-for="(comment, key_comment) in reason.comments"
              :key="key_comment"
              class="blockquote"
            >
              <mark-down>{{ comment }}</mark-down>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <draggable
        tag="ul"
        :list="reasons"
        class="list-group"
        handle=".handle"
        v-bind="dragOptions('master')"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition">
          <li
            v-for="(reason, reason_key) in reasons"
            :key="`${reason_key}_reason`"
            class="box"
          >
            <div class="field">
              <b-switch
                :ref="`${reason_key}_type`"
                v-model="reason.type"
                true-value="rule"
                false-value="text"
                outlined
                type="primary"
                passive-type="primary"
              >
                {{ reason.type == 'rule' ? 'Правило' : 'Текст' }}
              </b-switch>
            </div>
            <div v-if="reason.type == 'rule'">
              <b-field grouped>
                <b-field class="handle">
                  <span class="button is-static">
                    <b-icon
                      icon="menu"
                    />
                  </span>
                </b-field>
                <b-field>
                  <b-input
                    :id="`${reason_key}_slug`"
                    :ref="`${reason_key}_slug`"
                    v-model="reason.slug"
                    placeholder="Введи ID"
                    required
                  />
                </b-field>
                <b-field expanded>
                  <b-input
                    :id="`${reason_key}_description`"
                    :ref="`${reason_key}_description`"
                    v-model="reason.description"
                    placeholder="Введи описание"
                    required
                    expanded
                  />
                </b-field>
                <b-field>
                  <b-button @click="removeReason(reason_key)">
                    <b-icon
                      icon="delete"
                    />
                  </b-button>
                </b-field>
              </b-field>
              <b-field>
                <div class="columns">
                  <div class="column">
                    <div class="box">
                      <b-field>
                        <b-button @click="addNewPenalty(reason_key)">
                          Добавить время наказаний
                        </b-button>
                      </b-field>
                      <draggable
                        tag="ul"
                        :list="reason.penalties"
                        class="list-group-penalty"
                        handle=".handle-penalties"
                        v-bind="dragOptions('penalties')"
                        @start="drag = true"
                        @end="drag = false"
                      >
                        <transition-group type="transition">
                          <li
                            v-for="(penalty, penalty_key) in reason.penalties"
                            :key="`${penalty_key}_penalty`"
                          >
                            <b-field>
                              <p class="control handle-penalties">
                                <span class="button is-static">
                                  <b-icon
                                    icon="menu"
                                  />
                                </span>
                              </p>
                              <b-input v-model="penalty.time" placeholder="Введи время" />
                              <b-input v-model="penalty.desc" placeholder="Введи наказание" expanded />
                              <p class="control">
                                <b-button @click="removePenalty(reason_key, penalty_key)">
                                  <b-icon
                                    icon="delete"
                                  />
                                </b-button>
                              </p>
                            </b-field>
                          </li>
                        </transition-group>
                      </draggable>
                    </div>
                  </div>
                  <div class="column">
                    <div class="box">
                      <b-field>
                        <b-button @click="addNewComment(reason_key)">
                          Добавить новый комментарий
                        </b-button>
                      </b-field>
                      <draggable
                        tag="ul"
                        :list="reason.comments"
                        class="list-group-penalty"
                        handle=".handle-comments"
                        v-bind="dragOptions('comments')"
                        @start="drag = true"
                        @end="drag = false"
                      >
                        <transition-group type="transition">
                          <li
                            v-for="(comment, comment_key) in reason.comments"
                            :key="`${comment_key}_penalty`"
                          >
                            <b-field>
                              <p class="control handle-comments">
                                <span class="button is-static">
                                  <b-icon
                                    icon="menu"
                                  />
                                </span>
                              </p>
                              <b-input v-model="reason.comments[comment_key]" placeholder="Введи комментарий" type="textarea" expanded />
                              <p class="control">
                                <b-button @click="removeComment(reason_key, comment_key)">
                                  <b-icon
                                    icon="delete"
                                  />
                                </b-button>
                              </p>
                            </b-field>
                          </li>
                        </transition-group>
                      </draggable>
                    </div>
                  </div>
                </div>
              </b-field>
            </div>
            <div v-if="reason.type == 'text'">
              <b-field grouped>
                <b-field class="handle">
                  <span class="button is-static">
                    <b-icon
                      icon="menu"
                    />
                  </span>
                </b-field>
                <b-field expanded>
                  <b-input
                    :id="`${reason_key}_description`"
                    :ref="`${reason_key}_description`"
                    v-model="reason.description"
                    placeholder="Введи описание"
                    required
                    expanded
                    type="textarea"
                  />
                </b-field>
                <b-field>
                  <b-button @click="removeReason(reason_key)">
                    <b-icon
                      icon="delete"
                    />
                  </b-button>
                </b-field>
              </b-field>
            </div>
            <!-- <span class="text">{{ reason }} </span> -->

            <!-- <input v-model="element.text" type="text" class="form-control"> -->

            <!-- <i class="fa fa-times close" @click="removeAt(idx)" /> -->
          </li>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>
<script>
/* eslint-disable vue/require-v-for-key */
import draggable from 'vuedraggable'

export default {
  middleware: 'can',
  meta: {
    permission: 'ap-mng-locks-reason'
  },
  components: {
    draggable
  },
  data: () => ({
    drag: false,
    previewMode: true,
    reasons: []
  }),
  computed: {
    dragOptions () {
      return group => ({
        animation: 200,
        // eslint-disable-next-line object-shorthand
        group: group,
        disabled: false,
        ghostClass: 'ghost'
      })
    }
  },
  mounted () {
    this.$axios.get('/api/admin/locks/reason/show')
      .then((response) => {
        // console.log(response)
        this.reasons = response.data
      })
  },
  methods: {
    formatPenalties (penalties) {
      let output = ''
      penalties.forEach((element) => {
        const tab = []
        if (element.time) {
          tab.push(element.time)
        }
        if (element.desc) {
          tab.push(element.desc)
        }

        output += `${tab.join(' - ')}<br>`
        // Это говно нужно, чтобы обойти баг связанный css, attr, vuejs
        // - который фильтрует & = &amp;
      })
      return output
    },
    addNewReason () {
      this.$buefy.toast.open({
        message: 'Добавлен новый пункт',
        type: 'is-primary',
        position: 'is-bottom',
        queue: false
      })

      this.reasons.push({
        slug: '',
        description: '',
        type: 'rule'
      })
    },
    removeReason (reasonIndex) {
      this.$buefy.toast.open({
        message: 'Удален пункт правил',
        type: 'is-primary',
        position: 'is-bottom',
        queue: false
      })

      this.reasons.splice(reasonIndex, 1)
    },
    addNewPenalty (reasonIndex) {
      const penalties = this.reasons[reasonIndex].penalties
      if (penalties === undefined || penalties === null) {
        this.$set(this.reasons[reasonIndex], 'penalties', [])
      }
      this.reasons[reasonIndex].penalties.push({
        time: '',
        desc: ''
      })
    },
    removePenalty (reasonIndex, penaltyIndex) {
      this.reasons[reasonIndex].penalties.splice(penaltyIndex, 1)
    },
    addNewComment (reasonIndex) {
      const comments = this.reasons[reasonIndex].comments
      if (comments === undefined || comments === null) {
        this.$set(this.reasons[reasonIndex], 'comments', [])
      }
      this.reasons[reasonIndex].comments.push('')
    },
    removeComment (reasonIndex, commentIndex) {
      this.reasons[reasonIndex].comments.splice(commentIndex, 1)
    },

    saveReasons () {
      let error = false
      this.reasons.every((reason, key) => {
        if (
          this.$refs[`${key}_slug`] &&
          (this.$refs[`${key}_slug`][0] && reason.type === 'rule') &&
          !this.$refs[`${key}_slug`][0].checkHtml5Validity()
        ) {
          this.$refs[`${key}_slug`][0].$el.scrollIntoView()
          error = true
          return false
        } else return true
      })
      this.reasons.every((reason, key) => {
        if (this.$refs[`${key}_description`][0] && !this.$refs[`${key}_description`][0].checkHtml5Validity()) {
          if (reason.type === 'text') {
            if (reason.description !== '' && reason.description !== undefined) {
              error = false
            }
          } else {
            this.$refs[`${key}_description`][0].$el.scrollIntoView()
            error = true
          }

          return false
        } else return true
      })

      if (error) {
        this.$buefy.toast.open({
          message: 'Проверь поля на наличие ошибок',
          type: 'is-danger',
          position: 'is-bottom',
          queue: false
        })
        return
      }

      this.$axios.post('/api/admin/locks/reason/save', { reasons: this.reasons })
        .then((response) => {
          console.log(response)
          // this.data = response.data
        })
      this.$buefy.toast.open({
        message: 'Сохранено',
        type: 'is-success',
        position: 'is-bottom',
        queue: false
      })
      // this.reasons.forEach((reason, key) => {
      //   if (!this.$refs[`${key}_slug`].checkHtml5Validity()) {
      //     this.$refs[`${key}_slug`].scrollIntoView()
      //     break
      //   }
      // })
    }
  }
}
</script>
<style scoped>
  .fix-tooltip-pre::after{
    white-space: pre;
    transform: translateX(-15%);
  }
  .blockquote {
    padding: 5px 10px;
    background: #f5f5f5;
    border-left: 3px solid #333;
    margin: 5px 5px 5px 1.5em;
  }
  .reason {
    padding: 5px 0px;
  }
</style>
