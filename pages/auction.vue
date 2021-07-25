<template lang="pug">
  section.hero.is-fullheight.is-info.is-round-hero
    .hero-body
      div.has-text-centered.is-fullwidth
        p.title.py-6
          b-icon(icon="heart-cog" custom-class="size-icon-auction")
        p.subtitle Аукцион в разработке

</template>
<style lang="scss">
  .is-round-hero {
    border-radius: 2px;
  }
  .is-fullwidth {
    width: 100%;
  }
  .size-icon-auction {
    &::before {
      font-size: 8em !important;
    }
  }
</style>
