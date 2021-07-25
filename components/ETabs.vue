<template>
  <div class="b-tabs" :class="mainClasses">
    <nav class="tabs" :class="navClasses">
      <ul>
        <li
          v-for="childItem in items"
          v-show="childItem.visible"
          :key="childItem.value"
          :class="[ childItem.headerClass, { 'is-active': childItem.isActive,
                                             'is-disabled': childItem.disabled }]"
        >
          <b-slot-component
            v-if="childItem.$scopedSlots.header"
            :component="childItem"
            name="header"
            tag="a"
            @click.native="childClick(childItem)"
          />
          <a v-else @click="childClick(childItem)">
            <b-icon
              v-if="childItem.icon"
              :icon="childItem.icon"
              :pack="childItem.iconPack"
              :size="size"
            />
            <span>{{ childItem.label }}</span>
          </a>
        </li>
      </ul>
    </nav>
    <section v-if="!noContent" class="tab-content" :class="{'is-transitioning': isTransitioning}">
      <slot />
    </section>
    <slot v-else />
  </div>
</template>

<script>
import config from 'buefy/src/utils/config'
import TabbedMixin from './ETabbedMixin'

export default {
  name: 'ETabs',
  mixins: [TabbedMixin('tab')],
  props: {
    expanded: {
      type: Boolean,
      default: () => {
        return config.defaultTabsExpanded
      }
    },
    noContent: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    type: {
      type: [String, Object],
      default: () => {
        return config.defaultTabsType
      }
    },
    animated: {
      type: Boolean,
      default: () => {
        return config.defaultTabsAnimated
      }
    },
    multiline: Boolean
  },
  computed: {
    mainClasses () {
      return {
        'is-fullwidth': this.expanded,
        'is-vertical': this.vertical,
        'is-multiline': this.multiline,
        [this.position]: this.position && this.vertical
      }
    },
    navClasses () {
      return [
        this.type,
        this.size,
        {
          [this.position]: this.position && !this.vertical,
          'is-fullwidth': this.expanded,
          'is-toggle-rounded is-toggle': this.type === 'is-toggle-rounded'
        }
      ]
    }
  }
}
</script>
