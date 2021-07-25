<template>
  <div>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Добавление оружия
        </p>
      </header>
      <section class="modal-card-body">
        <b-field label="ID оружия">
          <b-input
            v-model="val.swep"
            placeholder="weapon_ak47"
          />
        </b-field>
        <b-field>
          <b-radio
            v-model="val.type"
            native-value="knife"
          >
            Нож
          </b-radio>
          <b-radio
            v-model="val.type"
            native-value="swep"
          >
            Оружие
          </b-radio>
        </b-field>
        <b-field label="Скин">
          <b-input
            v-model="val.skin"
            placeholder="0"
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
        swep: (this.value && this.value.swep) || undefined,
        skin: (this.value && this.value.skin) || undefined,
        type: (this.value && this.value.type) || undefined
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
