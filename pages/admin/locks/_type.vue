<template>
  <section>
    <b-button class="block" @click="modal.create.open = true">
      Новая блокировка {{ type }}
    </b-button>
    <b-table
      :data="locks"
      :loading="loading"

      bordered
      paginated
      backend-pagination
      show-detail-icon
      detailed
      detail-key="id"
      :total="total"
      :per-page="perPage"
      aria-next-label="След. стр."
      aria-previous-label="Пред. стр."
      aria-page-label="Страница"
      aria-current-label="Текущая страница"

      @page-change="onPageChange"
    >
      <b-table-column v-slot="props" field="id" label="ID" :width="'3%'">
        {{ props.row.id }}
      </b-table-column>

      <b-table-column v-slot="props" field="user" label="Nickname" :width="'13%'">
        <b-tooltip :label="props.row.user.steam_id32" dashed>
          {{ props.row.user.username }}
        </b-tooltip>
      </b-table-column>

      <b-table-column v-slot="props" field="reason" label="Reason" :width="'30%'">
        <span>
          <span v-for="(slug, key) in props.row.reason" :key="key">
            <!-- {{ props.row.reason.join(', ') }} -->
            <b-tooltip
              v-if="tooltipReason(slug, props.row.formatted_reason)"
              :label="tooltipReason(slug, props.row.formatted_reason)"
              dashed
              multilined
            >
              {{ slug }}
            </b-tooltip>
            <span v-else>
              {{ slug }}
            </span>
            {{ key !== props.row.reason.length-1 ? ', ': ' ' }}
          </span>
          <span v-if="props.row.comment != null">
            - {{ props.row.comment }}
          </span>
        </span>
      </b-table-column>

      <b-table-column v-slot="props" field="executor" label="Executor" :width="'13%'">
        <b-tooltip :label="props.row.executor.steam_id32" dashed>
          {{ props.row.executor.username }}
        </b-tooltip>
      </b-table-column>
      <b-table-column v-slot="props" field="length" label="Time" :width="'30%'" style="font-size: 12px;">
        Дата выдачи: {{ $localTime(props.row.locked_at) }}<br>
        <div v-if="props.row.length != 0">
          Дата снятия: {{ $localTime(calculateTimeLocketAt(props.row.locked_at, props.row.length)) }}<br>
          Длительность: {{ calculateLength(props.row.length) }}<br>
        </div>
        <div v-else>
          Дата снятия: никогда<br>
          Длительность: навсегда<br>
        </div>
        Блокировка {{ props.row.history_count > 1 ? 'изменялась ' + props.row.history_count + ' ' + $plural( 'раз_раза_раз', props.row.history_count) : 'не изменялась' }}.<br>
        <!-- Состояние:
        блокировка действует.
        Осталось 58 минут 24 секунды -->
        Состояние:
        <span v-if="props.row.unlock_at != null">
          <b-icon size="is-small" icon="lock-open-outline" type="is-primary" /> блокировка снята
        </span>
        <span v-else-if="props.row.length == 0">
          <b-icon size="is-small" icon="alert-circle-outline" type="is-danger" />
          блокировка навсегда
        </span>
        <span v-else-if="$moment.duration($moment().diff(calculateTimeLocketAt(props.row.locked_at, props.row.length))) <= 0">
          <b-icon size="is-small" icon="alert-circle-outline" type="is-danger" />
          <b-tooltip :label="$localTime(calculateTimeLocketAt(props.row.locked_at, props.row.length))" dashed>
            истекает {{ $moment().local().to(calculateTimeLocketAt(props.row.locked_at, props.row.length)) }}
          </b-tooltip>
        </span>
        <span v-else>
          <b-icon size="is-small" icon="clock-outline" type="is-success" /> срок истек
        </span>
      </b-table-column>
      <!-- <b-table-column field="created_at" label="created_at">
          {{ props.row.executor.created_at }}
        </b-table-column> -->
      <template slot="detail" slot-scope="props">
        <div class="buttons">
          <b-button @click="viewHistory(props.row.id)">
            История блокировки ({{ props.row.history_count }})
          </b-button>
          <b-button @click="viewProofs(props.row.id)">
            История пруфов
          </b-button>
          <b-button @click="unlock(props.row.id)">
            Снять блокировку
          </b-button>
        </div>
      </template>
    </b-table>
    <b-modal
      :active.sync="modal.history.open"
    >
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body">
          <modal-history :type="type" :lock-id="modal.history.id" />
        </section>
      </div>
    </b-modal>
    <b-modal
      :active.sync="modal.proofs.open"
    >
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body">
          <modal-proofs :type="type" :lock-id="modal.proofs.id" />
        </section>
      </div>
    </b-modal>
    <b-modal
      :active.sync="modal.create.open"
    >
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body">
          <modal-create :type="type" />
        </section>
      </div>
    </b-modal>
    <b-modal
      :active.sync="modal.unlock.open"
      width="400px"
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            Снятие блокировки
          </p>
          <button
            type="button"
            class="delete"
            @click="modal.unlock.open = false"
          />
        </header>
        <section class="modal-card-body">
          <b-field>
            Хочешь снять блокировку?
          </b-field>
          <b-field
            label="Причина снятия блокировки"
            message="Поле обязательно к заполнению"
          >
            <b-input
              v-model="modal.unlock.reason"
              required
              maxlength="255"
            />
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <b-button
            label="Нет, закрыть"
            @click="modal.unlock.open = false"
          />
          <b-button
            label="Да"
            type="is-primary"
            @click="unlockPost"
          />
        </footer>
      </div>
    </b-modal>
  </section>
</template>
<script>
import modalHistory from '~/components/admin/locks/history'
import modalProofs from '~/components/admin/locks/proofs'
import modalCreate from '~/components/admin/locks/create'

export default {
  middleware: 'can',
  meta: {
    permission: 'ap-locks'
  },
  components: {
    modalHistory,
    modalProofs,
    modalCreate
  },
  data: () => ({
    type: 'ban',
    modal: {
      unlock: {
        open: false,
        id: 0,
        reason: null
      },
      create: {
        open: false
      },
      history: {
        open: false,
        id: 0
      },
      proofs: {
        open: false,
        id: 0
      }
    },
    total: 0,
    loading: false,
    page: 1,
    perPage: 0,
    locks: []
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
    },
    calculateTimeLocketAt () {
      return (time, length) => this.$moment(time).add(length, 'seconds')
    }
  },
  mounted () {
    if (this.$route.params.type === 'bans') {
      this.type = 'ban'
    }
    if (this.$route.params.type === 'mutes') {
      this.type = 'mute'
    }
    if (this.$route.params.type === 'gags') {
      this.type = 'gag'
    }
    if (this.$route.params.type === 'gcs') {
      this.type = 'gc'
    }
    this.loadAsyncData()
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
    loadAsyncData () {
      this.loading = true

      this.$axios.get('/api/admin/locks/show', {
        params: {
          type: this.type,
          page: this.page
        }
      })
        .then((response) => {
          this.locks = []
          this.loading = false

          console.log(response)
          this.perPage = response.data.per_page
          this.total = response.data.total
          this.locks = response.data.data
          // this.reasons = response.data
        })
        .catch((error) => {
          this.data = []
          this.total = 0
          this.loading = false
          throw error
        })
    },
    onPageChange (page) {
      this.page = page
      this.loadAsyncData()
    },
    viewHistory (historyId) {
      this.modal.history.open = true
      this.modal.history.id = historyId
    },
    viewProofs (proofsId) {
      this.modal.proofs.open = true
      this.modal.proofs.id = proofsId
    },
    unlock (lockId) {
      this.modal.unlock.open = true
      this.modal.unlock.id = lockId
      // this.$buefy.toast.open({
      //   duration: 5000,
      //   message: 'Something\'s not good, also I\'m on <b>bottom</b>',
      //   position: 'is-bottom',
      //   type: 'is-danger'
      // })
    },
    unlockPost () {
      if (this.modal.unlock.reason === null || this.modal.unlock.reason === '') {
        return
      }
      // '/admin/locks/bans/{lock_id}/delete'
      this.$axios.post(
        '/api/admin/locks/delete',
        {
          lock_id: this.modal.unlock.id,
          reason: this.modal.unlock.reason
        }
      )
    }
  }
}
</script>
