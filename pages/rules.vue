<template lang="pug">
  div
    div(v-for="(reason, key) in data" :key="key")
      .reason(v-if="reason.type == 'text'")
        .content
          mark-down(:inlinerender="false") {{ reason.description }}

      .reason(v-if="reason.type == 'rule'")
        span
          b-tooltip(
            v-if="reason.penalties && reason.penalties.length > 0"
            type="is-dark"
            position="is-bottom"
            class="fix-tooltip-pre"
          )
            template(v-slot:content)
              div(v-html="formatPenalties(reason.penalties)")
            b-icon(
              icon="clock-alert-outline"
              size="is-small"
              custom-class="mdi-spin has-text-danger"
            )
        | &nbsp;
        b {{ reason.slug }}
        | &nbsp;
        | -
        | &nbsp;
        mark-down {{ reason.description }}
        div(v-if="reason.comments && reason.comments.length > 0")
          div(
            v-for="(comment, key_comment) in reason.comments"
            :key="key_comment"
            class="blockquote"
          )
            mark-down {{ comment }}
</template>
<script>
export default {
  data: () => ({
    data: {}
  }),
  mounted () {
    this.$axios.get('/api/rules')
      .then((response) => {
        // console.log(response)
        this.data = response.data
      })
  },
  methods: {
    formatPenalties (penalties) {
      let output = ''
      penalties.forEach((element) => {
        const tab = []
        if (element.time) {
          tab.push(element.time)
        }
        if (element.desc) {
          tab.push(element.desc)
        }

        output += `${tab.join(' - ')}<br>`
        // Это говно нужно, чтобы обойти баг связанный css, attr, vuejs
        // - который фильтрует & = &amp;
      })
      return output
    }
  }
}
</script>
<style scoped>
  .fix-tooltip-pre::after{
    white-space: pre;
    transform: translateX(-15%);
  }
  .blockquote {
    padding: 5px 10px;
    background: #f5f5f5;
    border-left: 3px solid #333;
    margin: 5px 5px 5px 1.5em;
  }
  .reason {
    padding: 5px 0px;
  }
</style>
