<template>
  <div>
    <div class="container">
      <div class="columns container-sidebar is-marginless">
        <div
          class="is-hidden-mobile background-label"
        />
        <div
          class="column is-3 sidebar-column is-paddingless"
          style="z-index: 0;"
        >
          <div class="sidebar-parent">
            <!-- {{ activeIndex }} -->
            <sidebar />
          </div>
        </div>
        <div
          class="column has-background-white is-must-have-container"
          style="z-index: 1;"
        >
          <section class="section">
            <!-- <child /> -->
            <nuxt />
          </section>
        </div>
      </div>
    </div>
    <footer class="footer">
      <div class="container">
        <div class="content">
          <!-- <div class="columns"> -->
            <!-- <div class="column"> -->
              <p>
                Shaft.CC, бета-тест 1.0.1
              </p>
              <p>
                <small>
                  Используется NuxtJS и Buefy
                </small>
              </p>
            </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  middleware: ['userinfo'],
  data () {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' }
        }
      ]
    }
  }
}
</script>
<style lang="scss">
  .background-label {
    position: absolute;
    bottom: 0;
    right: 50%;
    left: -1000%;
    top: 0;
    z-index: 0;
    background: #f5f5f5;
  }
</style>
