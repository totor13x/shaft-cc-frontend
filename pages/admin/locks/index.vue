<template lang="pug">
  div
    .block
      router-link(to="/admin/locks/bans") Страница банов
    .block
      router-link(to="/admin/locks/gags") Страница гагов
    .block
      router-link(to="/admin/locks/mutes") Страница мутов игрового чата
    .block
      router-link(to="/admin/locks/gcs") Страница мутов глобального чата
    //- .block
    //-   router-link(to="/admin/locks/bans") Страница мутов глобального чата
</template>
<script>
export default {
  middleware: 'can',
  meta: {
    permission: 'ap-locks'
  }
}
</script>
