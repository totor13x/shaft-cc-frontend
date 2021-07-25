<template>
  <li :role="ariaRoleMenu">
    <component
      :is="tag"
      v-bind="$attrs"
      :class="{
        'is-active': newActive,
        'is-disabled': disabled
      }"
      @click="onClick($event)"
    >
      <figure v-if="avatar" class="image is-20x20 is-inline-block" style="position:absolute">
        <img class="is-rounded is-small" :src="avatar">
      </figure>
      <span v-if="avatar" style="padding-right:25px;" />
      <b-icon
        v-if="icon"
        :icon="icon"
        :pack="iconPack"
        size="is-small"
      />
      <span v-if="label">{{ label }}</span>
      <slot
        v-else
        name="label"
        :expanded="newExpanded"
        :active="newActive"
      />
    </component>
    <!-- sub menu items -->
    <template v-if="$slots.default">
      <transition :name="animation">
        <ul v-show="newExpanded">
          <slot />
        </ul>
      </transition>
    </template>
  </li>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import Icon from 'buefy/src/components/icon/Icon'
export default {
  name: 'EMenuItem',
  components: {
    [Icon.name]: Icon
  },
  inheritAttrs: false,
  props: {
    label: String,
    active: Boolean,
    expanded: Boolean,
    disabled: Boolean,
    iconPack: String,
    icon: String,
    avatar: String,
    animation: {
      type: String,
      default: 'fade'
    },
    tag: {
      type: String,
      default: 'a',
      validator: (value) => {
        return [
          'a',
          'router-link',
          'nuxt-link',
          'n-link',
          'RouterLink',
          'NuxtLink',
          'NLink'
        ].includes(value)
      }
    },
    ariaRole: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      newActive: this.active,
      newExpanded: this.expanded
    }
  },
  computed: {
    ariaRoleMenu () {
      return this.ariaRole === 'menuitem' ? this.ariaRole : null
    }
  },
  watch: {
    active (value) {
      this.newActive = value
    },
    expanded (value) {
      this.newExpanded = value
    }
  },
  methods: {
    onClick (event) {
    },
    reset (parent) {
      const items = parent.$children.filter(c => c.name === this.name)
      items.forEach((item) => {
        if (item !== this) {
          this.reset(item)
          if (!parent.$data._isMenu || (parent.$data._isMenu && parent.accordion)) {
            item.newExpanded = false
            item.$emit('update:expanded', item.newActive)
          }
          item.newActive = false
          item.$emit('update:active', item.newActive)
        }
      })
    }
  }
}
</script>
