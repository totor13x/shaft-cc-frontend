<template lang="pug">
  div
    .block
      .columns.is-mobile
        .column
          b-input(
            v-model="search"
            placeholder="STEAM_0:0:0"
            @keyup.enter.native="load"
          )
        .column.is-narrow
          b-button(
            type="is-primary"
            label="Search"
            @click="searchLoad"
          )
        .column.is-narrow
          b-button(
            type="is-primary"
            style="height:100%"
            icon-right="close"
            @click="() => { this.search = null; this.searchLoad() }"
          )
    .block
      .columns.is-mobile
        .column
          e-tabs(
            type="is-toggle"
            v-model="type"
            expanded
            :no-content="true"
            class="hide-tab-label-mobile"
          )
            b-tab-item(label="Гаг" value="gag" icon="microphone-off")
            b-tab-item(label="Мут" value="mute" icon="message-off")
            b-tab-item(label="Бан" value="ban" icon="account-off")
        .column.is-narrow
          b-button(
            style="height:100%"
            icon-right="close"
            @click="type=null"
          )
    .block.has-text-centered(v-if="isLoading")
      b-icon(
        icon="loading"
        size="is-large"
        custom-class="mdi-spin"
      )
    .block(v-else-if="error")
      .notification.is-danger.is-light {{ error }}
    div(v-else)
      .box.is-relative(
        v-for="(lock, key) in data"
        :key="key"
        style="overflow:hidden;z-index: 2"
      )
        .icon.has-text-primary.is-over(v-if="lock.unlock_at != null")
          i.mdi.mdi-lock-open-outline.mdi-64px
        .icon.has-text-danger.is-over(
          v-else-if="lock.length == 0 || $moment().diff(lock.unlocked_at, 'seconds') <= 0"
        )
          i.mdi.mdi-alert-circle-outline.mdi-64px
        .icon.has-text-success.is-over(v-else)
          i.mdi.mdi-clock-outline.mdi-64px
        .circle(
          :class="{ cc: lock.system == 'old_cc', im: lock.system == 'old_im', }"
        )
        .tile.is-ancestor
          .tile
            .column.is-flex-direction-column.is-flex(style="position: relative")
              b-tooltip(
                style="width: fit-content"
                position="is-right"
                :label="lock.user.steam_id32"
                dashed
              ) {{ lock.user.username }}
              //- .is-size-7 {{ lock.user.steam_id32 }}
              .positionedby.is-size-7
                | Блокировку выдал&nbsp;
                b-tooltip(
                  :label="lock.executor.steam_id32"
                  dashed
                ) {{ lock.executor.username }}
          .tile.is-8
            .column
              | Блокировка выдана {{ $localTime(lock.locked_at) }}<br>
              span(v-if="lock.length == 0") Блокировка навсегда<br>
              span(v-else) Срок истекает {{ $localTime(lock.unlocked_at) }}<br>
              .field.content
                ul
                  li(v-if="lock.length != 0") Длительность блокировки: {{ calculateLength(lock.length )}}
                  li Блокировка не изменялась
                  li Тип блокировки: {{ lock.type }}
                  li
                    span Состояние:&nbsp;
                    span(v-if="lock.unlock_at != null") блокировка снята
                    span(v-else-if="lock.length == 0") блокировка навсегда
                    span(v-else-if="$moment().diff(lock.unlocked_at, 'seconds') <= 0")
                      b-tooltip(:label="$localTime(lock.unlocked_at)" dashed)
                        | истекает {{ $moment().to(lock.unlocked_at) }}
                    span(v-else) срок истек
              .field.content
                blockquote
                  span
                    span(
                      v-for="(slug, key) in lock.reason"
                      :key="key"
                    )
                      b-tooltip(
                        v-if="tooltipReason(slug, lock.formatted_reason)"
                        :label="tooltipReason(slug, lock.formatted_reason)"
                        dashed
                        multilined
                      )
                        | {{ slug }}
                      span(v-else)
                        | {{ slug }}
                      | {{ key !== lock.reason.length-1 ? ', ': ' ' }}
                    span(v-if="lock.comment != null")
                      |  - {{ lock.comment }}
      b-pagination(
        :total="page.total"
        v-model="page.currentPage"
        :per-page="page.perPage"
        icon-prev="chevron-left"
        icon-next="chevron-right"
        @change="load"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
      )
</template>
<script>
import ETabs from '../../components/ETabs'

export default {
  components: {
    ETabs
  },
  data: () => ({
    data: [],
    isLoading: false,
    search: null,
    type: null,
    error: null,
    page: {
      total: 1,
      currentPage: 1,
      perPage: 1
    }
  }),
  computed: {
    tooltipReason () {
      return (slug, format) => {
        let slugFormat = false
        format.forEach((element) => {
          if (slug === element.slug) {
            slugFormat = element.description
          }
        })
        return slugFormat
      }
    }
  },
  watch: {
    type () {
      this.page.total = 1
      this.page.currentPage = 1
      this.page.perPage = 1
      this.load()
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.error = null
      this.isLoading = true
      this.data = []
      this.$axios.post('/api/locks', {
        type: this.type,
        search: this.search,
        page: this.page.currentPage
      })
        .then(({ data }) => {
          this.data = data.data

          this.page.total = data.meta.total
          this.page.currentPage = data.meta.current_page
          this.page.perPage = data.meta.per_page
        })
        .catch((err) => {
          this.error = err.response.data.message
        })
        .then(() => {
          this.isLoading = false
        })
    },

    searchLoad () {
      this.page.total = 1
      this.page.currentPage = 1
      this.page.perPage = 1
      this.load()
    },

    calculateLength (length) {
      const d = Number(length)
      const h = Math.floor(d / 3600)
      const m = Math.floor(d % 3600 / 60)
      const s = Math.floor(d % 3600 % 60)

      const hDisplay = h > 0 ? this.$pluralTime(h, true, 'hh') : ''
      const mDisplay = m > 0 ? this.$pluralTime(m, true, 'mm') : ''
      const sDisplay = s > 0 ? this.$pluralTime(s, true, 'ss') : ''
      return `${hDisplay} ${mDisplay} ${sDisplay}`
      // return `${hours}:${minutes}:${seconds}`
    }
  }
}
</script>
<style scoped lang="scss">
  .positionedby {
    margin-top: auto;
    // display: block;
    // position: absolute;
    // bottom: 0.75rem;
    // box-sizing: border-box;
  }
  .is-over {
    display: block;
    position: absolute;
    right: 130px;
    bottom: 166px;
    & > i:before {
      z-index: 1;
      opacity: 0.3;
      font-size: 200px;
    }
  }
  .circle {
    right: 0.75rem;
    top: 0.75rem;
    height: 15px;
    width: 15px;
    background: none;
    position: absolute;
    border-radius: 100%;
    &.cc {
      background: linear-gradient(145deg, rgba(48,94,113,1) 0%, rgba(94,218,235,1) 100%);
    }
    &.im {
      background: linear-gradient(145deg, rgba(193,8,161,1) 0%, rgba(0,161,150,1) 100%);
    }
  }
</style>
