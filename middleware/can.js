export default ({ $laravel, store, route, redirect, next, error }) => {
  if (!store.getters['auth/user']) return redirect('/')
  if (route.meta) {
    route.meta.forEach((data) => {
      if (data.permission) {
        if (!$laravel.hasPermission(data.permission)) {
          return redirect('/')
        }
      } else if (data.role) {
        if (!$laravel.hasRole(data.role)) {
          return redirect('/')
        }
      }
    })
  }
}
