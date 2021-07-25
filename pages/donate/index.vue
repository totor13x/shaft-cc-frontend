<template lang="pug">
  .content
    .columns
      .column(v-if="user")
        .block
          h1 Привет, {{user.username || 'незнакомец'}}
          h3 Ты на странице покупок плюшек

        b-field(label="Количество плюшек")
          b-input(
            required
            type="number"
            v-model="amount"
          )

        b-field(label="Твоя почта")
          b-input(
            required
            name="email"
            v-model="email"
            type="email"
            maxlength="255"
          )
        .field
          b-button(
            class="block"
            type="is-primary"
            @click="fillAmount"
          ) Пополнить баланс плюшек
      .column(v-else)
        article.message
          .message-body
            | Блок пополнения баланса доступен только для авторизованных пользователей
      .column
        b-button(
          expanded
          class="block"
          type="is-primary is-light"
          @click="() => $router.push('/donate/tts')"
        ) Магазин
  //- <div
  //- <div v-if="false">
  //-   <h1>Страница на переработке</h1>
  //- </div>
  //- <div v-else>
  //-   <div class="columns">
  //-     <div class="column content">
  //-       <h1>Привет!</h1>
  //-       <h3>Наши сервера держатся за счет Вашей поддержки</h3>
  //-       <div class="field">
  //-         <label class="label">Плюшки</label>
  //-         <div class="control">
  //-           <input type="text" class="input" name="rubles" value="5">
  //-         </div>
  //-       </div>
  //-       <input type="hidden" name="steamid" value="STEAM_0:1:58105">
  //-       <div class="field">
  //-         Плюшки начислятся на Totor | STEAM_0:1:58105
  //-       </div>
  //-       <b-button type="is-primary" class="block">
  //-         Пожертвовать с помощью UnitPay
  //-       </b-button>
  //-       <div class="field">
  //-         <p>
  //-           Если Вы хотите использовать оплату в UnitPay с помощью PayPal, пополняйте счет через сайт shaft.cc.
  //-         </p>
  //-         <ul>
  //-           <li>Плюшки - внутренняя валюта игрового проекта и распространяется исключительно на shaft.cc.</li>
  //-           <li>Плюшки не являются денежными знаками системы WebMoney, qiwi или других систем.</li>
  //-           <li>Проведение операций по покупке игровых услуг за монеты происходит только в пределах shaft.cc и не распространяется на сторонние системы и сайты.</li>
  //-           <li>Списание плюшек со счета пользователя происходит автоматически при приобретении внутриигровых товаров, которые предоставляет сайт shaft.cc. Все вопросы, проблемы, жалобы и их решения, связанные со списанием плюшек с внутреннего баланса пользователя, проходят только в пределах shaft.cc и не должны распространяться на сторонние сайты и системы.</li>
  //-           <li>Плюшки пополняются в тот момент, когда Вы совершаете добровольное пожертвование в пользу shaft.cc. Начисление плюшки происходит автоматически на Ваш внутренний баланс shaft.cc.</li>
  //-         </ul>
  //-       </div>
  //-     </div>
  //-     <div class="column is-5">
  //-       <b-button
  //-         expanded
  //-         class="block"
  //-         type="is-primary"
  //-         @click="() => $router.push('/donate/tts')"
  //-       >
  //-         Магазин
  //-       </b-button>
  //-       <nav class="panel is-primary">
  //-         <p class="panel-heading">
  //-           Последние пожертвования
  //-         </p>
  //-         <div class="panel-block">
  //-           <div class="is-grouped is-grouped-multiline">
  //-             <div class="control">
  //-               <b-taglist attached>
  //-                 <b-tag type="is-success" size="is-normal">
  //-                   18 <span class="mdi mdi-currency-rub" />
  //-                 </b-tag>
  //-                 <b-tag size="is-normal">
  //-                   シ F1lipp0k
  //-                 </b-tag>
  //-               </b-taglist>
  //-             </div>
  //-           </div>
  //-         </div>
  //-       </nav>
  //-     </div>
  //-   </div>
  //- </div>
</template>
<script>
export default {
  data: () => ({
    amount: null,
    email: null
  }),
  computed: {
    user () {
      return (this.$store.getters && this.$store.getters['auth/user']) || false
    }
  },
  methods: {
    fillAmount () {
      this.$axios.post('/api/tts/fill_account', {
        amount: this.amount,
        email: this.email
      })
        .then(({ data }) => {
          window.location = data
        })
        .catch(this.$axios.errorHandler)
    }
  }
}
</script>
