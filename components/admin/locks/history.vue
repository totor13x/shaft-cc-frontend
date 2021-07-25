<template>
  <div>
    <div class="field has-background-primary has-text-white" style="padding: 10px;border-radius: 5px;">
      Все изменения блокировки
    </div>
    <div v-for="(now, key) in history" :key="key" :set="next=history[key+1]" class="field">
      <div>
        <div class="is-pulled-right has-text-right">
          <span class="has-text-primary">
            <b-tooltip :label="now.executor.steam_id32" dashed position="is-left">
              {{ now.executor.username }}
            </b-tooltip>
          </span>
        </div>
        {{ $localTime(now.updated_at) }}
        <small>
          <span class="has-text-primary">
            <div :set="changes=calculateChanges(now,next)">
              <span v-if="now.is_first">
                Блокировка зарегистрирована в БД
              </span>
              <span v-else-if="now.unlock_at != null">
                Блокировка была аннулирована
              </span>
              <span v-else-if="changes.length > 0">
                {{ changes.length }} {{ $plural( 'изменение_изменения_изменений', changes.length) }}: {{ changes.join(',') }}
              </span>
              <span v-else-if="changes.length == 0">
                Нет изменений
              </span>
            </div>
          </span>
        </small>
        <div v-if="now.length == 0">
          Длительность бана: навсегда
        </div>
        <div v-else>
          Длительность бана: {{ calculateLength(now.length) }}<br>
        </div>
        <div>
          Разбан: {{ $localTime($moment(now.locked_at).add(now.length, 'seconds')) }}
        </div>
        <div class="content">
          <blockquote>
            <span>
              <span v-for="(slug, key_res) in now.reason" :key="key_res">
                <!-- {{ props.row.reason.join(', ') }} -->
                <b-tooltip
                  v-if="tooltipReason(slug, now.formatted_reason)"
                  :label="tooltipReason(slug, now.formatted_reason)"
                  dashed
                  multilined
                >
                  {{ slug }}
                </b-tooltip>
                <span v-else>
                  {{ slug }}
                </span>
                {{ key_res !== now.reason.length-1 ? ', ': ' ' }}
              </span>
              <span v-if="now.comment != null">
                - {{ now.comment }}
              </span>
            </span>
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    lockId: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    history: []
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
  mounted () {
    this.$axios.get(`/api/admin/locks/bans/${this.lockId}/history`)
      .then((res) => {
        this.history = res.data
        console.log(res)
      })
  },
  methods: {
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
    },
    calculateChanges (now, next) {
      if (next != null) {
        const changes = []
        if (now.reason && !now.reason.every(e => next.reason.includes(e))) {
          changes.push('причина')
        }
        if (now.length !== next.length) {
          changes.push('время')
        }
        if (now.comment !== next.comment) {
          changes.push('комментарий')
        }
        if (now.executor_user_id !== next.executor_user_id) {
          changes.push('executor')
        }
        return changes
      }
      return []
    }
  }
}
</script>
