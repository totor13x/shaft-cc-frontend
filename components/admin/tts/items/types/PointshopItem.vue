<template>
  <div>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Добавить предмет поинтшопа
        </p>
      </header>
      <section class="modal-card-body">
        <div
          v-for="(item, key) in items"
          :key="key"
          class="field"
        >
          <b-button
            expanded
            size="is-small"
            type="is-primary"
            @click="selected = item"
          >
            {{ item.name }}
          </b-button>
        </div>
        <!-- {{ server_id }} -->
        <!-- <b-field label="Сколько поинтов выдать">
          <b-input
            v-model="val.points"
            type="number"
            placeholder="1000"
          />
        </b-field> -->
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">
          Close
        </button>
        <button :disabled="!selected" class="button is-primary" @click="updateItem()">
          {{
            selected
              ? `${selected.name} выбран - сохранить`
              : 'Выбери предмет для выдачи'
          }}
        </button>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  props: ['value', 'server_id', 'item_id', 'type'],
  data () {
    return {
      selected: false,
      items: [],
      val: {
        points: (this.value && this.value.points) || null
      }
    }
  },
  watch: {
    val: {
      deep: true,
      handler (value) {
        this.$emit('input', value)
      }
    }
  },
  mounted () {
    this.$axios.get('/api/admin/tts/items/pointshop_items', {
      params: {
        server_ids: this.server_id
      }
    })
      .then((res) => {
        this.items = res.data
        console.log(res)
      })
      .catch(errors => this.$axios.errorHandler(errors))
  },
  methods: {
    updateItem () {
      if (!this.selected) {
        return
      }
      this.$axios.post(`/api/admin/tts/items/${this.item_id}/assign`, {
        associate_id: this.selected.id,
        type: this.type
      })
        .then((res) => {
          this.$emit('updateItems', true)
          this.$parent.close()
          console.log(res)
        })
        .catch(errors => this.$axios.errorHandler(errors))
    }
  }
}
</script>
