<template>
  <div>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Добавить поинты
        </p>
      </header>
      <section class="modal-card-body">
        <b-field label="Сколько поинтов выдать">
          <b-input
            v-model="val.points"
            type="number"
            placeholder="1000"
          />
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">
          Close
        </button>
        <button class="button is-primary">
          Сохранить
        </button>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  props: ['value'],
  data () {
    return {
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
  }
}
</script>
