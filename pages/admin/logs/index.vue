<template>
  <div class="columns">
    <div class="column">
      <div v-if="copyLog.active" class="is-flex">
        <vs-button flat @click="clipboardLogs()">
          Скопировать ({{ copyLog.selected.length }})
        </vs-button>
        <vs-button flat warn @click="copyLog.active = false">
          Отменить
        </vs-button>
      </div>
      <div v-else class="is-flex">
        <vs-button class="p-0" flat @click="copyLog.active = true">
          Выбрать логи
        </vs-button>
      </div>
      <div class="pt-1">
        <log
          v-for="(log, id) in data"
          :key="id"

          :ref="`log-${log.id}`"

          :data="log"
          :copy-actived="copyLog.active"
          :enable-id="visible.id"
          :enable-server="visible.server"
          :enable-time="visible.time"
          @selected="selectedLogs"
        />
      </div>
    </div>
    <div class="column is-4">
      <div class="sticky_column">
        <b-field>
          <vs-checkbox v-model="liveReload">
            Автоматическое обновление
          </vs-checkbox>
        </b-field>
        <b-field>
          <b-collapse
            v-for="(collapse, index) of collapseContext"
            :key="index"
            class="card"
            animation="slide"
            :open="collapseIsOpen == index"
            @open="collapseIsOpen = index"
          >
            <div
              slot="trigger"
              slot-scope="props"
              class="card-header"
              role="button"
            >
              <p class="card-header-title">
                {{ collapse.title }}
              </p>
              <a class="card-header-icon">
                <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'"
                />
              </a>
            </div>
            <div class="card-content">
              <div class="content">
                <div v-if="collapse.text">
                  {{ collapse.text }}
                </div>
                <div v-if="collapse.options">
                  <vs-checkbox v-for="(data, key) in collapse.options" :key="key" v-model="filters[collapse.type]" :val="key">
                    {{ data.name }}
                  </vs-checkbox>
                </div>
              </div>
            </div>
          </b-collapse>
          <b-button class="is-radiusless" type="is-primary" expanded @click="updateLogs">
            Применить
          </b-button>
        </b-field>
        <b-field>
          <b-collapse :open="false" class="card" animation="slide" aria-id="contentIdForA11y3">
            <div
              slot="trigger"
              slot-scope="props"
              class="card-header"
              role="button"
              aria-controls="contentIdForA11y3"
            >
              <p class="card-header-title">
                Отображение данных
              </p>
              <a class="card-header-icon">
                <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'"
                />
              </a>
            </div>
            <div class="card-content">
              <div class="content">
                <vs-checkbox v-model="visible.id">
                  Отображать ID
                </vs-checkbox>
                <vs-checkbox v-model="visible.server">
                  Отображать сервер
                </vs-checkbox>
                <vs-checkbox v-model="visible.time">
                  Отображать время
                </vs-checkbox>
              </div>
            </div>
          </b-collapse>
        </b-field>

        <b-field>
          <div
            v-for="(collapse, index) of collapseContext"
            :key="index"
          >
            <b class="has-text-info">
              {{ collapse.title }}
            </b>
            <div v-if="filters[collapse.type].length == 0">
              Фильтры не выбраны
            </div>
            <div
              v-for="(data, key) in collapse.options"
              :key="key"
            >
              <span v-if="filters[collapse.type].includes(key)" class="has-text-info">
                {{ data.name }}
              </span>
            </div>
          </div>
        </b-field>
      </div>
    </div>
  </div>
</template>
<script>
// TODO: Сделать поиск по игроку (пример уже на беке есть), пагинацию по логам, переход к определенному ID, добавить фильтр по дате
// TODO: Включить фильтр на клиенте по выбранным параметрам для входящих логов. иначе говоря фильтровать новые логи по выбранным фильтрам

/* eslint-disable no-unused-vars */
export default {
  middleware: 'can',
  meta: {
    permission: 'ap-logs'
  },
  components: {
    Log: {
      render (h) {
        return (
          <div class="py-1">
            { this.renderCheckbox() }
            { this.renderID() }
            <div class="is-inline-block log-text" style="vertical-align: middle;">
              {this.ExplodeFormat(h)}
            </div>
          </div>
        )
      },
      props: {
        data: {
          type: Object,
          default: {}
        },
        copyActived: {
          type: Boolean,
          default: false
        },
        enableId: {
          type: Boolean,
          default: false
        },
        enableServer: {
          type: Boolean,
          default: true
        },
        enableTime: {
          type: Boolean,
          default: true
        }
      },
      computed: {
        servers () {
          // return
          return (this && this.$store && this.$store.getters['config/config'].servers) || []
        }
      },
      watch: {
        select () {
          // if (this.select) {
          this.$emit('selected', this.select, this.data, this.data)
          // }
        }
      },
      data: () => ({
        select: false,
        toCopy: false
      }),
      mounted () {

      },
      methods: {
        // Render
        renderCheckbox () {
          if (this.copyActived) {
            return (<vs-checkbox class="is-inline-block mr-2" style="vertical-align:middle" vModel={this.select}/>)
          }
        },
        renderID () {
          if (this.toCopy) {
            return `#${this.data.id} `
          }
          if (this.enableId) {
            return (<span class="is-inline-block log-text has-text-grey-light">#{this.data.id}&nbsp;</span>)
          }
        },
        momentNow (time) {
          return this.$moment(time).local().format('HH:mm:ss')
        },

        getInner () {
          this.toCopy = true
          let text = ''
          text += this.renderID()
          text += this.ExplodeFormat(this.$createElement)
          text += '\n'
          this.toCopy = false

          return text
        },

        ExplodeFormat (h) {
          if (this.data.format) {
            const regex = /:\S+\w/gm

            const str = this.data.format
            let strE = str
            let m
            // eslint-disable-next-line prefer-const
            let hexagonical = []
            let textY = ''

            if (this.enableTime) {
              hexagonical.push(
                h(
                  'b-tooltip',
                  {
                    attrs: {
                      label: this.$moment(this.data.created_at).local().format(this.$moment.defaultFormat)
                    },
                    directives: [
                      {
                        position: 'is-top',
                        animated: true
                      }
                    ],
                    domProps: {
                      innerHTML: `[${this.momentNow(this.data.created_at)}]`
                    }
                  }
                )
              )
            }

            if (this.toCopy) {
              textY += `[${this.$moment(this.data.created_at).local().format(this.$moment.defaultFormat)}]`
            }

            if (this.enableServer) {
              if (this.servers[this.data.server_id]) {
                const c = this.servers[this.data.server_id].color
                hexagonical.push(
                  h(
                    'span',
                    '['
                  ),

                  h(
                    'b-tooltip',
                    {
                      attrs: {
                        label: this.servers[this.data.server_id].beautiful_name,
                        style: `color: rgb(${c.r}, ${c.g}, ${c.b})`
                      },
                      directives: [
                        {
                          position: 'is-top',
                          animated: true
                        }
                      ],
                      domProps: {
                        innerHTML: `${this.servers[this.data.server_id].short_name}`
                      }
                    }
                  ),

                  h(
                    'span',
                    ']'
                  )
                )
                if (this.toCopy) {
                  textY += `[${this.servers[this.data.server_id].short_name}]`
                }
              } else {
                hexagonical.push(
                  h(
                    'span',
                    `[${this.data.server_id}]`
                  )
                )
                if (this.toCopy) {
                  textY += `[${this.data.server_id}]`
                }
              }
            }

            hexagonical.push(
              h(
                'span',
                ' '
              )
            )
            if (this.toCopy) {
              textY += ' '
            }

            // <span>
            //   <b-tooltip
            //     :label="$moment(val.created_at).local().format($moment.defaultFormat)"
            //     position="is-top"
            //     animated
            //   >
            //     [{{ momentNow(val.created_at) }}]
            //   </b-tooltip>
            // </span>
            // hexagonical.push(h('div', str))

            while ((m = regex.exec(str)) !== null) {
              // This is necessary to avoid infinite loops with zero-width matches
              if (m.index === regex.lastIndex) {
                regex.lastIndex++
              }

              // The result can be accessed through the `m`-variable.
              m.forEach((match) => {
                // console.log(strE)
                hexagonical.push(h('span', strE.substr(0, strE.search(match))))
                if (this.toCopy) {
                  textY += strE.substr(0, strE.search(match))
                }
                strE = strE.substr(strE.search(match) + match.length)
                // console.log('--------------')

                if (this.data.attrs && this.data.attrs[match]) {
                  if (this.data.attrs[match].steamid) {
                    hexagonical.push(
                      h('b', [
                        h('avatar',
                          {
                            attrs: {
                              user: this.data.attrs[match],
                              username: true,
                              clickOnly: true
                            },
                            directives: [
                              {
                                size: '14',
                                class: 'is-inline-block'
                              }
                            ],
                            scopedSlots: {
                              extra: props => h('span', [
                                h('vs-button',
                                  {
                                    attrs: {
                                      transparent: true,
                                      block: true
                                    },
                                    style: {
                                      margin: '0px'
                                    },
                                    on: {
                                      click: () => {
                                        this.$buefy.toast.open({
                                          message: 'SteamID64 скопирован',
                                          queue: false,
                                          position: 'is-bottom-right',
                                          type: 'is-info'
                                        })
                                        this.$clipboard(this.data.attrs[match].steamid)
                                      }
                                      // click: this.selectCopy(this.data.attrs[match].steamid)
                                    }
                                  },
                                  'SteamID64'
                                )
                              ])
                            }
                          },
                          [
                            h('span', {
                              slot: 'extra'
                            })
                          ]
                        )
                      ])

                      // size="20"
                      // :user="user"
                      // class="is-inline-block"
                    )

                    if (this.toCopy) {
                      textY += `${this.data.attrs[match].username}<${this.data.attrs[match].steamid}>`
                    }
                    // hexagonical.push(h('avatar', {
                    //   attrs: {
                    //     size: '14',
                    //     class: 'is-inline-block'
                    //   },
                    //   directives: [
                    //     {
                    //       user: this.data.attrs[match]
                    //     }
                    //   ]
                    // }))
                  } else if (match === ':voice') {
                    hexagonical.push(
                      h('audio', {
                        attrs: {
                          preload: 'none',
                          controls: true,
                          src: `https://storage.shaft.cc/default/${this.data.attrs[match]}`,
                          style: 'box-sizing: border-box;height: 18px;'
                        }
                      })
                      // <audio controls src="/media/cc0-audio/t-rex-roar.mp3">
                    )
                    // hexagonical.push(
                    //   h('b', {
                    //     attrs: [
                    //       {
                    //         class: 'has-text-danger'
                    //       }
                    //     ],
                    //     domProps: {
                    //       innerHTML: this.data.attrs[match]
                    //     }
                    //   })
                    // )
                  } else if (match === ':audio') {
                    hexagonical.push(
                      h('audio', {
                        attrs: {
                          preload: 'none',
                          controls: true,
                          src: this.data.attrs[match],
                          style: 'box-sizing: border-box;height: 18px;'
                        }
                      })
                    )
                  } else {
                    hexagonical.push(
                      h('b', this.data.attrs[match])
                    )
                    if (this.toCopy) {
                      textY += this.data.attrs[match]
                    }
                  }
                } else {
                  hexagonical.push(
                    h('b', {
                      attrs: {
                        style: 'color:#aaaaaa'
                      },
                      domProps: {
                        innerHTML: 'NULL'
                      }
                    })
                  )
                  if (this.toCopy) {
                    textY += 'NULL'
                  }
                }

                // console.log()
                // hexagonical = ''
              })
            }
            hexagonical.push(h('span', strE))

            if (this.toCopy) {
              textY += strE
              return textY
            }

            return hexagonical
          } else {
            return `Тип ${this.data.type} не обработан`
          }
        }
      }
    }
  },
  data: () => ({
    liveReload: true,

    logs: false,
    filters: {},
    reRender: 0,
    data: {},
    collapseIsOpen: -1,
    collapseContext: [],
    copyLog: {
      active: false,
      selected: []
    },
    visible: {
      id: false,
      server: true,
      time: true
    }
  }),
  mounted () {
    this.logs = this.$ws.subscribe('client/logs')
    this.logs.on('filterList', (data) => {
      console.log('joinde', data)
      this.collapseContext = data
      console.log(data)
      data.forEach((filter) => {
        this.$set(this.filters, filter.type, [])
      })
      this.logs.emit('logList', this.filters)
    })
    this.logs.on('logList', (data) => {
      console.log('logList')
      this.data = data
    })
    this.logs.on('new_log', (data) => {
      console.log(data)
      this.data.unshift(data)
    })
    // this.logs.on('new_log_id', (data) => {
    //   this.logs.emit('updateID', data)
    // })
    this.logs.on('error', (data) => {
      console.log('error', data)
    })
  },
  methods: {
    updateLogs () {
      this.logs.emit('logList', this.filters)
    },
    selectedLogs (bool, log) {
      console.log(bool, log)
      if (bool) {
        this.copyLog.selected.push(log)
      } else {
        this.copyLog.selected.forEach((data, key) => {
          if (data.id === log.id) {
            this.copyLog.selected.splice(key, 1)
          }
        })
        // delete this.copyLog.selected[log.id]
      }
    },
    clipboardLogs () {
      let toClipboard = ''
      toClipboard += `Лог сгенерирован в ${this.$moment(new Date()).local().format(this.$moment.defaultFormat)} \n\n`
      this.copyLog.selected.forEach((log) => {
        toClipboard += this.$refs[`log-${log.id}`][0].getInner()
      })

      this.$clipboard(toClipboard)
      this.$buefy.toast.open({
        message: 'Логи скопированы',
        queue: false,
        position: 'is-bottom-right',
        type: 'is-info'
      })
    }
  },
  destroyed () {
    this.logs.close()
  }
}
</script>
<style>
  .log-text {
    vertical-align: middle;
    font-size: 12px;
    line-height: 23px;
  }
  .sticky_column {
    position: sticky;
    top: 0;
  }
</style>
