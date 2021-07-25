<template lang="pug">
  div
    router-link.block.is-block(
      to="/admin/blablra"
    ) Более менее структурированная и описанная страница с методами и доступами
    router-link.block.is-block(
      to="/admin/locks"
      v-permission="'ap-locks'"
    ) Страница блокировок
    router-link.block.is-block(
      to="/admin/prophunt/taunts"
      v-permission="'ap-mng-taunts-ph'"
    ) [PH] Загрузка таунтов
    router-link.block.is-block(
      to="/admin/permissions"
      v-permission="'ap-mng-permission'"
    ) Редактирование прав
    router-link.block.is-block(
      to="/admin/locks/reasons"
      v-permission="'ap-mng-locks-reason'"
    ) Редактирование правил
    router-link.block.is-block(
      to="/admin/logs"
      v-permission="'ap-logs'"
    ) Логи
    router-link.block.is-block(
      to="/admin/logs/types"
      v-permission="'ap-mng-logs-types'"
    ) CRUD формат логов
    router-link.block.is-block(
      to="/admin/pointshop/categories"
      v-permission="'ap-mng-ps-categories'"
    ) [PS] CRUD категорий
    router-link.block.is-block(
      to="/admin/pointshop/items"
      v-permission="'ap-mng-ps-items'"
    ) [PS] CRUD предметов
    router-link.block.is-block(
      to="/admin/roles"
      v-permission="'ap-mng-roles'"
    ) Редактирование ролей
    router-link.block.is-block(
      to="/admin/roles/link"
      v-permission="'ap-mng-roles-link'"
    ) Редактирование связей ролей и прав
    router-link.block.is-block(
      to="/admin/tags"
      v-permission="'ap-mng-tag'"
    ) Редактирование тегов
    router-link.block.is-block(
      to="/admin/taunts"
      v-permission="'ap-mng-taunts'"
    ) Редактирование таунтов
    router-link.block.is-block(
      to="/admin/tts/items"
      v-permission="'ap-mng-tts-items'"
    ) [TTS] Редактирование предметов
</template>
<script>
export default {
  middleware: 'can',
  meta: {
    permission: 'ap-view'
  }
}
</script>
