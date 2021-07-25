<template lang="pug">
  div(v-if="user")
    .is-relative.user-cover(
      :style="{'background-image': `url(https://storage.shaft.cc/photos/_1559913633_508_759.jpg)`}"
    )
      .user-block
        .user-avatar
          avatar.avatar-me(
            size="64"
            :user="user"
          )

          .user-name {{ user.username }}
      .glossy.image.is-16by9
  div(v-else)
    h2 Пользователь не найден
</template>

<script>
// import axios from 'axios'
export default {
  // middleware: 'auth',

  metaInfo () {
    return { title: 'Профиль' }
  },
  async asyncData ({ route, params, $axios, store, redirect }) {
    if (params.id === undefined) {
      params.id = 'me'
      // redirect(302, '/'))
      // $nuxt.error({ statusCode: 404, message: 'Произошла серверная ошибка' })
    }
    let isMe = store.getters['auth/user']
    if (isMe === null) {
      await store.dispatch('auth/fetchUser')
      isMe = store.getters['auth/user']
    }
    if (params.id === 'me') {
      return {
        user: isMe,
        me: true
      }
      // console.log(isMe)
    } else {
      const { data } = await $axios.get(`/api/profile/${params.id}`)
      return {
        user: data.data,
        me: false
      }
    }
    // console.log(route, params, store)
  },
  data: () => ({
    user: '',
    me: false
  }),
  computed: {
    tags () {
      return window.dataTables.tags
    }
  },
  mounted () {
    // console.log(this.$bus)
    // this.$bus.$on('user:online', (data) => {
    // console.log(data, '---')
    //   if (this.user && this.user.id === Number(data.user_id)) {
    //     this.user.online = data.on
    //   }
    // })
    // const isMe = this.$store.getters['auth/user']
    // console.log(isMe)
    // if (this.$route.params.steamid !== undefined && this.$route.params.steamid !== isMe.steamid) {
    //   if (this.$route.params.steamid !== undefined) {
    // axios.get('/api/profile/' + this.$route.params.steamid)
    //   .then((response) => {
    //     this.user = response.data.data
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
    //   }
    // } else {
    // this.user = isMe
    // this.me = true
    // }

    // this.$ws.on('user/online', (data) => {
    //   console.log(data)
    //   if (this.user && this.user.id === Number(data.user_id)) {
    //     this.user.online = data.on
    //   }
    // })
  }
}
</script>
<style scoped lang="scss">
  .user-block {
    display: flex;
    position: ABSOLUTE;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    justify-content: center;
    align-items: center;
    z-index: 2;
    &:hover {
      & + .glossy {
        background: none;
        backdrop-filter: none;
      }
      & > .user-avatar {
        opacity: 0;
      }
    }
  }
  .user-avatar {
    // position: absolute;
    // left:5px;
    // bottom:5px;
    transition: all 0.3s ease-in;
    opacity: 1;
    pointer-events: none;
    & > .avatar-me {
      align-items: center;
      display: flex;
      flex-direction: column;
    }
  }
  .user-name {
    margin-top: 5px;
    font-weight: bolder;
    text-transform: uppercase;
    font-size: 4vw;
    text-align: center;
  }
  .user-cover {
    border-radius: 3px;
    background-size: cover;
  }
  .glossy {
    height: auto;
    max-width: 100%;
    background: rgba(255,255,255,0.25);
    backdrop-filter: blur(7px);
    z-index: 1;
    transition: all 0.3s ease-in;
    &:hover {
      backdrop-filter: none;
    }
  }
</style>
