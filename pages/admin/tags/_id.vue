<template>
  <div v-if="tagData" class="columns">
    <div class="column">
      <div class="field">
        <b class="is-size-3">Стандартные параметры</b>
      </div>
      <div class="field">
        <b>Первичные параметры</b>
      </div>
      <div class="field">
        <b-input
          v-model="tagData.primary_text"
          placeholder="Текст"
        />
      </div>
      <div class="field">
        <b-checkbox
          v-model="tagData.is_primary_gradient"
          :true-value="1"
          :false-value="0"
        >
          Включить градиент для первичных цветов
        </b-checkbox>
      </div>
      <div class="field">
        <b>Первый цвет</b>
      </div>
      <div class="field">
        <slider-picker
          :value="tagData.primary_color_1 != null ? tagData.primary_color_1 : '#ffffff'"
          @input="color => tagData.primary_color_1 = color.rgba"
        />
      </div>
      <div class="field">
        <b>Второй цвет (для градиента)</b>
        <b-button
          class="is-inline-block"
          size="is-small"
          @click="tagData.primary_color_2 = null"
        >
          удалить
        </b-button>
      </div>
      <div class="field">
        <slider-picker
          :value="tagData.primary_color_2 != null ? tagData.primary_color_2 : '#ffffff'"
          @input="color => tagData.primary_color_2 = color.rgba"
        />
      </div>
      <div class="field mt-6">
        <b>Вторичные параметры</b>
      </div>
      <div class="field">
        <b-input
          v-model="tagData.secondary_text"
          placeholder="Текст"
        />
      </div>
      <div class="field">
        <b-checkbox
          v-model="tagData.is_secondary_gradient"
          :true-value="1"
          :false-value="0"
        >
          Включить градиент для вторичных цветов
        </b-checkbox>
      </div>
      <div class="field">
        <b>Первый цвет</b>
        <b-button
          class="is-inline-block"
          size="is-small"
          @click="tagData.secondary_color_1 = null"
        >
          удалить
        </b-button>
      </div>
      <div class="field">
        <slider-picker
          :value="tagData.secondary_color_1 != null ? tagData.secondary_color_1 : '#ffffff'"
          @input="color => tagData.secondary_color_1 = color.rgba"
        />
      </div>
      <div class="field">
        <b>Второй цвет (для градиента)</b>
        <b-button
          class="is-inline-block"
          size="is-small"
          @click="tagData.secondary_color_2 = null"
        >
          удалить
        </b-button>
      </div>
      <div class="field">
        <slider-picker
          :value="tagData.secondary_color_2 != null ? tagData.secondary_color_2 : '#ffffff'"
          @input="color => tagData.secondary_color_2 = color.rgba"
        />
      </div>
      <div class="field mt-6">
        <b>Параметры рамок</b>
      </div>
      <div class="field">
        <b>Левая скобка</b>
        <b-button
          class="is-inline-block"
          size="is-small"
          @click="tagData.border_color_1 = null"
        >
          удалить
        </b-button>
      </div>
      <div class="field">
        <slider-picker
          :value="tagData.border_color_1 != null ? tagData.border_color_1 : '#ffffff'"
          @input="color => tagData.border_color_1 = color.rgba"
        />
      </div>
      <div class="field">
        <b>Правая скобка</b>
        <b-button
          class="is-inline-block"
          size="is-small"
          @click="tagData.border_color_2 = null"
        >
          удалить
        </b-button>
      </div>
      <div class="field">
        <slider-picker
          :value="tagData.border_color_2 != null ? tagData.border_color_2 : '#ffffff'"
          @input="color => tagData.border_color_2 = color.rgba"
        />
      </div>
    </div>
    <div class="column">
      <div class="sticky_column">
        <div class="field">
          <b>Вид из глобального чата:</b>
        </div>
        <div class="field">
          <div class="box is-small">
            <span v-if="generate_html">
              <span
                v-for="(data, key) in generate_html"
                :key="key"
                v-html="data"
              />
            </span> Totor: привет!
          </div>
        </div>
        <div class="field">
          <b>Вид из игрового чата:</b>
        </div>
        <div class="field is-relative">
          <img style="width:100%;border-radius: 7px;" src="~/assets/chat_frame.jpg">
          <div class="gmod_chat">
            <span v-if="generate_gmod">
              <span
                v-for="(data, key) in generate_gmod"
                :key="key"
                v-html="data"
              />
            </span> Totor: привет!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// TODO: Допилить вставку hex кода или других
// TODO: Поправить выставление цвета в слайдере (он не меняется, до того момента, пока не нажмешь на палитру)
// TODO: допилить сохранение настроек тега
import { Slider } from 'vue-color'
export default {
  middleware: 'can',
  meta: {
    permission: 'ap-mng-tag'
  },
  components: {
    'slider-picker': Slider
  },
  data: () => ({
    tags: false,
    tagData: false,

    generate_html: false,
    generate_gmod: false
  }),
  mounted () {
    this.tags = this.$ws.subscribe('client/admin/tags')
    this.tags.on('ready', (data) => {
      this.tags.emit('tagData', this.$route.params.id)
    })
    this.tags.on('error', (data) => {
      console.log(data)
    })
    this.tags.on('tagData', (data) => {
      this.tagData = data

      this.generate_html = data.generated_html
      this.generate_gmod = data.generated_gmod
      // this.generate = data.generated
      console.log(data)
    })
    this.tags.on('tagGenerate', (data) => {
      this.generate_html = data.html
      this.generate_gmod = data.gmod
      // this.tagData = data
    })

    this.$watch('tagData', function (newVal, oldVal) {
      delete newVal.generated
      console.log(newVal)

      this.tags.emit('tagGenerate', newVal)
      // this.tagData = data
    }, {
      deep: true
    })
  },
  destroyed () {
    this.tags.close()
  },
  methods: {
  }
}
</script>
<style scoped>
  .gmod_chat {
    position: absolute;
    bottom: 17%;
    left: 4%;
    z-index: 1;
    color: #fff;
    font-size: 14px;
    font-family: consolas;
    letter-spacing: -1px;
  }
  .sticky_column {
    position: sticky;
    top: 0;
  }
</style>
