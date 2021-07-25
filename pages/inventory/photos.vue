<template lang="pug">
  .block.has-text-centered(v-if="isLoading")
    b-icon(
      icon="loading"
      size="is-large"
      custom-class="mdi-spin"
    )
  div(v-else)
    .columns.is-multiline
      .column.is-4(v-for="(photo, key) in data" :key="key")
        .card
          .card-image
            figure.image.is-16by9
              img(
                :src="photo.url"
              )
          .card-content
            div
              time Загружено {{ photo.created_at }}
            div
              a(
                target="_blank"
                :href="photo.url"
              ) Открыть оригинал
          footer.card-footer
            a.card-footer-item(
              @click="() => remove(photo)"
            ) Удалить
    b-pagination(
      :total="page.total"
      v-model="page.currentPage"
      :per-page="page.perPage"
      icon-prev="chevron-left"
      icon-next="chevron-right"
      @change="load"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    )
</template>
<script>
export default {
  data: () => ({
    isLoading: true,
    data: [],
    page: {
      total: 1,
      currentPage: 1,
      perPage: 1
    }
  }),
  mounted () {
    this.load()
  },
  methods: {
    remove (photo) {
      this.$axios.get(`/api/inventory/photo/${photo.id}/delete`)
        .then(() => {
          this.load()
        })
        .catch(errors => this.$axios.errorHandler(errors))
    },
    load () {
      this.isLoading = true
      this.data = []
      this.$axios.get('/api/inventory/photos', {
        params: {
          page: this.page.currentPage
        }
      })
        .then(({ data }) => {
          this.data = data.data

          this.page.total = data.meta.total
          this.page.currentPage = data.meta.current_page
          this.page.perPage = data.meta.per_page
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
