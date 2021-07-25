import Vue from 'vue'

const permissions = []
const roles = []

const Laravel = {
  permissions: permissions || [],
  roles: roles || []
}

const methods = {
  setPermissions: (permissions) => {
    Laravel.permissions = permissions && permissions.length !== 0 ? permissions : []
  },

  setRoles: (roles) => {
    Laravel.roles = roles && roles.length !== 0 ? roles : []
  },

  getPermissions: () => Laravel.permissions,
  getRoles: () => Laravel.roles,

  hasPermission: permission => Laravel.permissions.includes(permission),
  unlessPermission: permission => !methods.hasPermission(permission),

  hasAnyPermission: (values) => {
    const permissions = values.split('|')
    return permissions.some(permission => Laravel.permissions.includes(permission))
  },

  hasAllPermissions: (values) => {
    const permissions = values.split('|')
    return permissions.every(permission => Laravel.permissions.includes(permission))
  },

  hasRole: role => Laravel.roles.includes(role),
  unlessRole: role => !methods.hasRole(role),

  hasAnyRole: (values) => {
    const roles = values.split('|')
    return roles.some(role => Laravel.roles.includes(role))
  },

  hasAllRoles: (values) => {
    const roles = values.split('|')
    return roles.every(role => Laravel.roles.includes(role))
  }
}

const isEmpty = obj => Object.keys(obj).length === 0

const startCase = string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

const getCondition = (binding) => {
  let suffix = binding.name
  let arg = 'has'

  if (binding.arg) {
    if (binding.arg === 'unless') {
      arg = 'unless'
    } else
    if (binding.arg !== 'has') {
      arg += startCase(binding.arg)
    }
  }

  // Convert to plural if is needed
  if (arg === 'hasAll') {
    suffix += 's'
  }

  return `${arg}${startCase(suffix)}`
}

const isConditionPassed = Vue => (el, binding, vnode) => {
  if (!binding.value) {
    return
  }

  const condition = getCondition(binding)
  if (!methods[condition](binding.value)) {
    if (isEmpty(binding.modifiers)) {
      const comment = document.createComment(' ')
      Object.defineProperty(comment, 'setAttribute', {
        value: () => undefined
      })
      vnode.elm = comment
      vnode.text = ' '
      vnode.isComment = true
      vnode.context = undefined
      vnode.tag = undefined
      vnode.data.directives = undefined

      if (vnode.componentInstance) {
        vnode.componentInstance.$el = comment
      }

      if (el.parentNode) {
        el.parentNode.replaceChild(comment, el)
      }
    } else {
      Object.assign(el, binding.modifiers)
    }
  }
}

const Permissions = {
  install (Vue) {
    // Directives
    Vue.directive('permission', { inserted: isConditionPassed(Vue) })
    Vue.directive('role', { inserted: isConditionPassed(Vue) })
    Vue.directive('role-or-permission', (el, binding, vnode) => {
      if (!binding.value) {
        return
      }

      const options = binding.value.split('|')
      const role = options[0]
      const permission = options[1]

      if (!methods.hasRole(role) && !methods.hasPermission(permission)) {
        const comment = document.createComment(' ')
        Object.defineProperty(comment, 'setAttribute', {
          value: () => undefined
        })
        vnode.elm = comment
        vnode.text = ' '
        vnode.isComment = true
        vnode.context = undefined
        vnode.tag = undefined
        vnode.data.directives = undefined

        if (vnode.componentInstance) {
          vnode.componentInstance.$el = comment
        }

        if (el.parentNode) {
          el.parentNode.replaceChild(comment, el)
        }
      }
    })

    // Alias for "v-permission:has"
    Vue.directive('can', (el, binding, vnode) => {
      if (!methods.hasPermission(binding.value)) {
        // replace HTMLElement with comment node
        const comment = document.createComment(' ')
        Object.defineProperty(comment, 'setAttribute', {
          value: () => undefined
        })
        vnode.elm = comment
        vnode.text = ' '
        vnode.isComment = true
        vnode.context = undefined
        vnode.tag = undefined
        vnode.data.directives = undefined

        if (vnode.componentInstance) {
          vnode.componentInstance.$el = comment
        }

        if (el.parentNode) {
          el.parentNode.replaceChild(comment, el)
        }
      }
    })
  }
}
Vue.use(Permissions)

export default ({ app }, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  inject('laravel', methods)
}
