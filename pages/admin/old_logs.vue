<template>
  <div>
    <log v-for="(log, id) in data" :key="id" :data="log" />
    123
  </div>
</template>
<script>
export default {
  components: {
    Log: {
      render (h) {
        return (
          <div>
            {this.ExplodeFormat(h)}
          </div>
        )
      },
      props: {
        data: {
          type: Object,
          default: {}
        }
      },
      computed: {
        servers () {
          // return
          return (this && this.$store && this.$store.getters['config/config'].servers) || []
        }
      },
      methods: {
        momentNow (time) {
          return this.$moment(time).local().format('HH:mm:ss')
        },
        ExplodeFormat (h) {
          if (this.data.format) {
            const regex = /:\S+\w/gm

            const str = this.data.format
            let strE = str
            let m
            // eslint-disable-next-line prefer-const
            let hexagonical = []
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
            } else {
              hexagonical.push(
                h(
                  'span',
                  this.data.server_id
                )
              )
            }

            hexagonical.push(
              h(
                'span',
                ' '
              )
            )

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
                strE = strE.substr(strE.search(match) + match.length)
                // console.log('--------------')

                if (this.data.attrs && this.data.attrs[match]) {
                  if (this.data.attrs[match].steamid) {
                    hexagonical.push(
                      h('b', this.data.attrs[match].username)
                    )
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
                  } else {
                    hexagonical.push(
                      h('b', this.data.attrs[match])
                    )
                  }
                } else {
                  hexagonical.push(h('b', 'NULL'))
                }

                // console.log()
                // hexagonical = ''
              })
            }
            hexagonical.push(h('span', strE))
            return hexagonical
          } else {
            return `Тип ${this.data.type} не обработан`
          }
        }
      }
    }
  },
  data: () => ({
    logs: false,
    data: {}
  }),
  mounted () {
    this.logs = this.$ws.subscribe('client/logs')
    this.logs.on('joined', (data) => {
      console.log('joinde', data)
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
  destroyed () {
    this.logs.close()
  }
}
</script>
