<template>
  <div>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Добавление модели
        </p>
      </header>
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <ValidationProvider v-slot="{ errors, valid }" rules="required" name="путь к модели">
          <section class="modal-card-body">
            <b-field
              label="Путь к .MDL"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input
                v-model="val.mdl"
                placeholder="models/player/kleiner.mdl"
              />
            </b-field>
          </section>
        </ValidationProvider>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="$parent.close()">
            Close
          </button>

          <button class="button is-primary" @click="passes(checkIn)">
            Сохранить
          </button>
        </footer>
      </ValidationObserver>
    </div>
  </div>
</template>
<script>
export default {
  props: ['value'],
  data () {
    return {
      val: {
        mdl: (this.value && this.value.mdl) || undefined
      }
    }
  },
  watch: {
    val: {
      deep: true,
      handler (value) {
        this.$on('input_reverse', function (value) {
          this.$emit('input', value)
        })
      }
    }
  },
  mounted () {
    console.log(this.value)
  },
  methods: {
    checkIn () {
      // console.log(this.validate())
      this.$emit('input_reverse', this.val)
      this.$parent.close()
    }
  }
}
</script>
