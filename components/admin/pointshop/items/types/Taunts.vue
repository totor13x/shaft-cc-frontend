<template>
  <div>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Добавление таунта
        </p>
      </header>
      <section class="modal-card-body">
        <b-field label="ID таунта">
          <b-input
            v-model="val.taunt"
            placeholder="taunt_palpatin"
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
        taunt: (this.value && this.value.taunt) || undefined
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
