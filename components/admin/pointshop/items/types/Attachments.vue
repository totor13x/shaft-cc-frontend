<template>
  <div>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Настройка шапок, масок и других возможных аттачей
        </p>
      </header>
      <section class="modal-card-body">
        <b-field label="Путь к .mdl">
          <b-input
            v-model="val.mdl"
            placeholder="models/player/kleiner.mdl"
          />
        </b-field>

        <b-field>
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
        </b-field>
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
        <b-field label="Угол поворота модели">
          <b-field grouped>
            <b-field label="Pitch" expanded>
              <b-input v-model="val.ang.p" />
            </b-field>
            <b-field label="Yaw" expanded>
              <b-input v-model="val.ang.y" />
            </b-field>
            <b-field label="Roll" expanded>
              <b-input v-model="val.ang.r" />
            </b-field>
          </b-field>
        </b-field>
        <b-field label="Позиция модели">
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
        <b-field label="Размер модели" expanded>
          <b-input v-model="val.scale" />
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
        mdl: (this.value && this.value.mdl) || undefined,
        attach: (this.value && this.value.attach) || undefined,
        bone: (this.value && this.value.bone) || undefined,
        ang: {
          p: (this.value && this.value.ang && this.value.ang.p) || undefined,
          y: (this.value && this.value.ang && this.value.ang.y) || undefined,
          r: (this.value && this.value.ang && this.value.ang.z) || undefined
        },
        pos: {
          x: (this.value && this.value.pos && this.value.pos.x) || undefined,
          y: (this.value && this.value.pos && this.value.pos.y) || undefined,
          z: (this.value && this.value.pos && this.value.pos.z) || undefined
        },
        scale: (this.value && this.value.scale) || undefined
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
