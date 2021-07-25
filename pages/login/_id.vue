<template>
  <div />
</template>
<script>
export default {
  async asyncData ({ params, store, redirect }) {
    await store.dispatch('auth/saveToken', {
      token: params.id
      // remember: this.remember
    })
    await store.dispatch('auth/fetchUser')
    redirect('/')
  }
}
</script>
