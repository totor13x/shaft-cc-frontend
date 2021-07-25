<template>
  <div class="is-relative">
    <div class="columns">
      <div class="column" style="flex: 0">
        <div ref="roulette" class="ev-roulette-container" />
      </div>
      <div v-if="crateData" class="column">
        <div class="columns">
          <div class="column">
            <div class="columns">
              <div class="column">
                <b-field
                  label="Поинтов на [MU]"
                >
                  123
                </b-field>
                <b-field
                  label="Количество кейсов"
                >
                  123
                </b-field>
                <b-field
                  label="Количество открытий"
                >
                  123
                </b-field>
                <div class="field">
                  <b-button
                    expanded
                    type="is-primary"
                    size="is-large"
                    @click="spin"
                  >
                    Крутить кейс
                  </b-button>
                </div>
                <div class="field">
                  <b-button
                    expanded
                    type="is-success"
                    @click="spin"
                  >
                    Купить 1 кейс (1000)
                  </b-button>
                </div>
                <div class="field">
                  <b-button
                    expanded
                    type="is-success"
                    @click="spin"
                  >
                    Купить 5 кейсов (5000)
                  </b-button>
                </div>
                <div class="field">
                  <b-button
                    expanded
                    type="is-warning"
                    @click="spin"
                  >
                    Продать (1000)
                  </b-button>
                </div>
              </div>
              <div class="column">
                <div class="field has-text-black">
                  <b>
                    История дропа
                  </b>
                </div>
                <div v-for="(data, key) in crateHistory" :key="key" class="field">
                  <div class="has-text-weight-bold">
                    {{ data.item && data.item.itemable ? data.item.itemable.name : `ID: ${data.item.itemable_id}` }}
                  </div>
                  <div class="is-size-7">
                    <b-tooltip
                      :label="$moment(data.created_at).local().format($moment.defaultFormat)"
                      position="is-top"
                      animated
                    >
                      {{ momentNow(data.created_at) }}
                    </b-tooltip>
                    <!-- {{ ((data.change / allCharge) * 100).toFixed(3) }}% -->
                  </div>
                </div>
                <!-- <div class="field">
                  <div class="has-text-weight-bold">
                    Алиса
                  </div>
                  <div class="is-size-7">
                    29.10.20
                  </div>
                </div> -->
                <!-- <div class="field">
                  <div class="has-text-weight-bold">
                    Алиса
                  </div>
                  <div class="is-size-7">
                    29.10.20
                  </div>
                </div> -->
              </div>
            </div>
          </div>
          <div class="column is-4">
            <!-- v-for="(data, key) in crateOpen.crate.items"
            :key="key"
            class="panel-block"
            @click="openItem(data)"
          >
            <div class="format-block">
              <div class="format-color" />
              <div v-if="crateOpen.morphs.find(x => x.namespace === data.itemable_type)" class="ml-1">
                [{{ crateOpen.morphs.find(x => x.namespace === data.itemable_type).name }}]
              </div>
              <div class="ml-1">
                {{ data.itemable ? data.itemable.name : `ID: ${data.itemable_id}` }}
              </div>
            </div>
            <small>
              {{ data.change }} - {{ ((data.change / allCharge) * 100).toFixed(3) }}%
            </small> -->
            <div class="field has-text-black">
              <b>
                Содержимое кейса
              </b>
            </div>
            <div v-for="(data, key) in orderedItems" :key="key" class="field">
              <div class="has-text-weight-bold">
                {{ data.itemable ? data.itemable.name : `ID: ${data.itemable_id}` }}
              </div>
              <div class="is-size-7">
                {{ ((data.change / allCharge) * 100).toFixed(3) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- {{ $route.params.crate_id }} -->

    <b-button
      @click="spin"
    >
      Spin
    </b-button>
    <b-button
      @click="simulate"
    >
      {{ mctime }}
    </b-button>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import _ from 'lodash'
import { EvRoulette } from '@/plugins/evroulette'
export default {
  data: () => ({
    // crate_id: this.$route.params.crate_id,
    crate: false,
    crateData: false,
    crateHistory: [],
    mctime: 'Non opened',
    items: {
      MP3: { r: 255, g: 1, b: 20 },
      AMP3: { r: 255, g: 1, b: 20 },
      BMP3: { r: 255, g: 1, b: 20 }
    },
    WEAPON_PRIZE_ATTRS: {
      name: 'MP3'
    },
    WEAPON_ACTORS_ATTRS: [
      {
        name: 'AMP3'
      },
      {
        name: 'BMP3'
      }
    ]
  }),
  computed: {
    allCharge () {
      if (this.crateData) {
        return this.crateData.items.reduce((a, b) => a + b.change, 0)
      }
      return 0
    },
    orderedItems () {
      return _.orderBy(this.crateData.items, 'change', 'desc')
    }
  },
  mounted () {
    this.crate = this.$ws.subscribe('client/roulette')

    this.crate.on('crateSpin', (data) => {
      console.log('crateSpin')
      console.log(data.select)
      this.mctime = data.mctime
      this.roulette.weapon_prize_attrs = data.select
      this.roulette.weapon_actors_attrs = data.items
      this.roulette.start()
      this.roulette.spin()
    })

    this.crate.on('crateOpen', (data) => {
      this.crateData = data.crate
      this.crateHistory = data.history
      this.mctime = data.mctime
      console.log(data, '----------open')
    })
    this.crate.on('ready', (data) => {
      this.crate.emit('crateOpen', this.$route.params.id)
    })
    this.crate.on('error', (data) => {
      console.log(data)
    })

    const elParent = this.$refs.roulette
    const self = this
    this.roulette = new EvRoulette({
      weapon_prize_attrs: this.WEAPON_PRIZE_ATTRS,
      weapon_actors_attrs: this.WEAPON_ACTORS_ATTRS,
      el_parent: elParent,
      beforeparty () {
        console.log('Поехали!')
      },
      afterparty () {
        if (self.crateHistory.length >= 10) {
          self.crateHistory.pop()
        }
        self.crateHistory.unshift({
          item: {
            itemable: {
              name: self.roulette.weapon_prize_attrs.name
            }
          },
          created_at: self.roulette.weapon_prize_attrs.time
        })
        console.log('Vse!')
      }
    })
    this.roulette.start()

    // this.$ws.emit('roulette/crate/open', {
    //   crate_id: this.$route.params.crate_id
    // })
    // this.$ws.on('roulette/crate/open', (data) => {
    //   console.log(data)
    // })
    // this.$ws.on('roulette/crate/spin', (data) => {
    //   console.log(data)
    //   this.roulette.weapon_prize_attrs = data.select
    //   this.roulette.weapon_actors_attrs = data.items
    //   this.roulette.start()
    //   this.roulette.spin()
    // })
    // this.$ws.on('roulette/crate/simulate', (data) => {
    //   console.log(data)
    // })
    // this.$axios.get(`/api/roulette/crates/${this.$route.params.crate_id}`)
    //   .then(res => {
    //     console.log(res)
    //     // this.crates = res.data
    //   })
  },
  destroyed () {
    this.crate.close()
    // this.$ws.destroy('roulette/crate/open')
    // this.$ws.destroy('roulette/crate/spin')
    // this.$ws.destroy('roulette/crate/simulate')
  },
  methods: {
    spin () {
      this.crate.emit('crateSpin', this.$route.params.id)
      // this.$ws.emit('roulette/crate/spin', {
      //   crate_id: this.$route.params.crate_id
      // })
    },
    momentNow (time) {
      const mjs = this.$moment(time).local()
      const now = this.$moment().local()
      if (mjs.format('DD.MM.YYYY') === now.format('DD.MM.YYYY')) {
        return mjs.format('HH:mm:ss')
      }
      return mjs.format('DD.MM.YYYY')
    },
    simulate () {
      // this.$ws.emit('roulette/crate/simulate', {
      //   crate_id: this.$route.params.crate_id
      // })
    }
  }
}
</script>

<style>
.ev-roulette-container {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 600px;
}
#ev-target {
  position: absolute;
  top: 300px;
  left: 0px;
  width: 200px;
  height: 3px;
  background: #a30041;
  z-index: 1100;
}

#ev-weapons {
  height: 600px;
  white-space: nowrap;
  position: relative;
  top: 0;
}

.ev-weapon {
  display: block;
  width: 200px;
  height: 50px;
}

.ev-weapon-inner {
  width: 200px;
  height: 50px;
  position: relative;
  background: #282c36;
  /* margin-right: 10px; */
}
.ev-weapon-rarity {
  width: 5px;
  height: 50px;
  background: #282c36;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  transition: width 1s cubic-bezier(0, 0, 0.2, 1) 0s, background 1s cubic-bezier(0, 0, 0.2, 1) 0s;
}
.ev-roulette-container.is-created > #ev-roulette > #ev-weapons > .ev-weapon > .ev-weapon-inner > .ev-weapon-rarity {
  width: 200px;
  background: #282c36 !important;
}

.ev-weapon-rarity.ev-weapon-rarity-milspec {
  background: #4b69ff;
}

.ev-weapon-rarity.ev-weapon-rarity-restricted {
  background: #8847ff;
}

.ev-weapon-rarity.ev-weapon-rarity-classified {
  background: #d32ce6;
}

.ev-weapon-rarity.ev-weapon-rarity-covert {
  background: #eb4b4b;
}

.ev-weapon-rarity.ev-weapon-rarity-rare {
  background: #ffd700;
}

.ev-weapon-rarity.ev-weapon-rarity-uncommon {
  background: #ddd;
}

.ev-weapon-text {
  position: absolute;
  top: 0px;
  left: 5px;
  width: 185px;
  height: 50px;
  background: #242531;
}

.ev-weapon-text p {
  height: 15px;
  line-height: 15px;
  color: #e4e4e4;
  font-size: 12px;
  margin: 0;
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ev-weapon-text p:first-child {
  margin-top: 10px;
}
</style>
