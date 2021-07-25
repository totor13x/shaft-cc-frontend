<template>
  <aside class="sidebar">
    <b-menu>
      <b-menu-list label="Menu">
        <e-menu-item
          icon="home-variant-outline"
          label="Главная"
          tag="router-link"
          to="/"
          :active="isActive == 'index'"
        />
        <e-menu-item
          icon="chat-outline"
          label="Чат"
          tag="router-link"
          to="/chat"
          :active="isActive == 'chat'"
        />
        <e-menu-item
          icon="account-group-outline"
          label="Аукцион"
          tag="router-link"
          to="/auction"
          :active="isActive == 'auction'"
        />
        <!-- <e-menu-item
          icon="information-outline"
          label="New"
          tag="router-link"
          to="/settings/profile"
          :active="isActive == 'settings.profile'"
        /> -->
        <e-menu-item
          icon="currency-usd"
          label="Магазин"
          tag="router-link"
          to="/donate"
          :active="isActive == 'donate'"
        />
        <e-menu-item
          icon="information-outline"
          label="Блокировки"
          tag="router-link"
          to="/locks"
          :active="isActive == 'locks'"
        />
        <e-menu-item
          icon="book-open-outline"
          label="Правила"
          tag="router-link"
          to="/rules"
          :active="isActive == 'rules'"
        />
      </b-menu-list>
      <b-menu-list v-if="this.$store.getters['auth/check']" label="Действия">
        <e-menu-item
          :label="username"
          tag="router-link"
          to="/profile"
          :avatar="avatar"
          :active="isActive == 'profile'"
        />
        <e-menu-item
          label="Инвентарь"
          tag="router-link"
          to="/inventory"
          :active="isActive == 'inventory'"
        />
      </b-menu-list>
      <b-menu-list label="Actions">
        <e-menu-item
          v-permission="'ap-view'"
          label="Админ-панель"
          tag="router-link"
          to="/admin"
          :active="isActive == 'admin'"
        />
        <e-menu-item
          v-if="this.$store.getters['auth/check']"
          label="Выход"
          tag="router-link"
          to="/logout"
          :active="isActive == 'login'"
        />
        <e-menu-item
          v-else
          label="Вход"
          tag="router-link"
          to="/login"
          :active="isActive == 'login'"
        />
        <!-- <e-menu-item :label="isActive" /> -->
      </b-menu-list>
    </b-menu>
  </aside>
</template>

<script>
export default {
  // fetch ({ store }) {
  //   if (store.getters['auth/user']) {
  //     this.avatar = store.getters['auth/user'].avatar
  //     this.username = store.getters['auth/user'].username
  //     return true
  //   }
  // },
  data () {
    return {
      isActive: this.$nuxt.$route.name
      // avatar: '',
      // username: ''
    }
  },
  computed: {
    avatar () {
      return (this.$store.getters && this.$store.getters['auth/user'] && this.$store.getters['auth/user'].avatar) || ''
    },
    username () {
      return (this.$store.getters && this.$store.getters['auth/user'] && this.$store.getters['auth/user'].username) || ''
    }
  },
  watch: {
    $route (to, from) {
      this.isActive = to.name
    }
    // $store ({ getters }) {
    //   console.log(getters)
    // }
  }
}
</script>
