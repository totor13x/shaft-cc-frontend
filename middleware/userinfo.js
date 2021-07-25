export default async function (ctx) {
  if (!ctx.store.getters['auth/user']) {
    const { data } = await ctx.$axios.get('/api/configs')

    await ctx.store.dispatch('config/saveConfig', {
      config: data
    })
    await ctx.store.dispatch('config/fetchTags')
    await ctx.store.dispatch('auth/fetchUser')
    console.log('fetched User')
  }
  return true
}
