<template>
  <div class="content">
    <div class="field is-size-4 has-text-primary has-text-weight-bold">
      Здесь большинство ссылок, надо экспериментировать. Не все функции работают до конца
    </div>
    <div class="field">
      <p class="is-size-5">
        Поинтшоп ссылки - работают криво и непонятно, но работают.
      </p>
      <p>
        Документация еще не организована, в будущем будет подробнее. Предметы поинтшопа напрямую связанны с сервером, к которому они привязаны.
      </p>
      <p>
        Категории - функционал описания самих категорий, по категориям проще задавать какие-то уникальные параметры, работает по принципу наследования:      предмет, находящийся в категории будет сначала отрабатывать логику категории, а потом свою - если таковая имеется.
      </p>
      <p>
        Также не стоит забывать про HoE, логика немного описана в самом поинтшоп - предметы, а подробнее появится позже
      </p>
    </div>
    <div class="buttons">
      <b-button tag="router-link" type="is-text" to="/admin/pointshop/categories">Поинтшоп - категории</b-button>
      <b-button tag="router-link" type="is-text" to="/admin/pointshop/items">Поинтшоп - предметы</b-button>
    </div>
    <div class="field">
      <p>
        <b>Кейсы</b> - вроде работают, но есть ньюансы. Например, указывать принадлежность к серверу необходимо, от него будет зависеть какие предметы будут отображены и будут выпадать.
      </p>
      <p>
        Соответственно, если не указывать, то список будет пустым (на самой странице кейсов написано наоборот, но там писалось ранее, а логика кейсов за это время была переписана)
      </p>
    </div>
    <div class="buttons">
      <b-button tag="router-link" type="is-text" to="/admin/crates">Кейсы</b-button>
    </div>
    <div class="field">
      <p>
        <b>Логи</b> - пока тестовые, но вполне рабочие логи. В будущем я еще доработаю, очевидно.
      </p>
      <p>
        <b>Типы логов</b> - это для меня, в большей степени, но вдруг кто-то сторонний кодер появится.
      </p>
    </div>
    <div class="buttons">
      <b-button tag="router-link" type="is-text" to="/admin/logs">Логи (главная)</b-button>
      <b-button tag="router-link" type="is-text" to="/admin/logs/types">Логи (типы)</b-button>
    </div>
    <div class="field">
      <p>
        <b>Права доступа и роли</b> - теперь это совершенно другая хуевина. В отличии от прошлой системы, эта система более живучая за счет улучшений и выбранной логики работы с пользователем.
      </p>
      <p>
        Сами по себе роли ничего не дают без прав и могут выступать в качестве визуального отличия от других юзеров. Это удобно больше для дискорда. Есть отдельная страница для выдачи прав доступа ролям.
      </p>
      <p>
        Права теперь являются отдельными сущностями и при желании можно выдать какие-то права отдельному юзеру не делая для него какую-то роль.
      </p>
      <p>
        Насчет выдачи "вечных" прав еще думаю, как бы поддерживается как права с временем действия и вечные, но не уверен, что вечные права понадобятся.
      </p>
      <p>
      Также можно задать область действия прав (на каких серверах).
      </p>
      <p>
        На время альфа-теста выдача прав работать не будет. Отключил.
      </p>
    </div>
    <div class="buttons">
      <b-button tag="router-link" type="is-text" to="/admin/permissions">Права доступа</b-button>
      <b-button tag="router-link" type="is-text" to="/admin/roles">Роли</b-button>
      <b-button tag="router-link" type="is-text" to="/admin/roles/link">Роли (линковка прав)</b-button>
    </div>
    <div class="field">
      Блокировки, сейчас доступен только тип блокировки - ban. Мутов и гагов еще не делал, но это пока.
    </div>
    <div class="buttons">
      <b-button tag="router-link" type="is-text" to="/admin/locks/bans">Страница блокировок тип бан</b-button>
      <b-button tag="router-link" type="is-text" to="/admin/locks/reasons">Причины блокировок</b-button>
    </div>
    <div class="field">
      Таунты. Здесь таунты отдельно для пропов есть и есть просто таунты
    </div>
    <div class="buttons">
      <b-button tag="router-link" type="is-text" to="/admin/prophunt/taunts">Проп-хант таунты</b-button>
      <b-button tag="router-link" type="is-text" to="/admin/taunts">Таунты</b-button>
    </div>
    <div class="field">
      Теги - понятно, ТТС не работает
    </div>
    <div class="buttons">
      <b-button tag="router-link" type="is-text" to="/admin/tags">Теги</b-button>
      <b-button tag="router-link" type="is-text" to="/admin/tts/items">ТТС - предметы (не работают)</b-button>
    </div>

  </div>
</template>
