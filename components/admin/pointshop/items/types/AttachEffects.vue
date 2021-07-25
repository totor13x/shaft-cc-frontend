<template>
  <div>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Добавление эффекта-аттача
        </p>
      </header>
      <section class="modal-card-body">
        <b-field label="ID эффекта">
          <b-input
            v-model="val.effect"
            placeholder="effect_heart"
          />
        </b-field>
        <!-- <b-field>
          <b-radio
            v-model="typeOfAttach"
            native-value="attach"
          >
            Аттач
          </b-radio>
          <b-radio
            v-model="typeOfAttach"
            native-value="bone"
          >
            Кость
          </b-radio>
        </b-field> -->
        <b-field v-if="typeOfAttach == 'attach'" label="Привязка к аттачу">
          <b-input
            v-model="val.attach"
            placeholder="eyes"
          />
        </b-field>
        <b-field v-else label="Привязка к кости">
          <b-input
            v-model="val.bone"
            placeholder="ValveBiped.Bip01_Head1"
          />
        </b-field>
        <b-field label="Позиция эффекта">
          <b-field grouped>
            <b-field label="X" expanded>
              <b-input v-model="val.pos.x" />
            </b-field>
            <b-field label="Y" expanded>
              <b-input v-model="val.pos.y" />
            </b-field>
            <b-field label="Z" expanded>
              <b-input v-model="val.pos.z" />
            </b-field>
          </b-field>
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
      typeOfAttach: 'attach',
      val: {
        effect: (this.value && this.value.effect) || undefined,
        attach: (this.value && this.value.attach) || undefined,
        bone: (this.value && this.value.bone) || undefined,
        pos: {
          x: (this.value && this.value.pos.x) || undefined,
          y: (this.value && this.value.pos.y) || undefined,
          z: (this.value && this.value.pos.z) || undefined
        }
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
