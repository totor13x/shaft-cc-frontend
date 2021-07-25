/* Автор кода: https://github.com/evbogdanov/ev-roulette */
/* eslint-disable no-tabs */
/* eslint-disable camelcase */
// КЛАСС ОРУЖИЯ
// -----------------------------------------------------------------------------

function EvWeapon (id, attrs) {
  // идентификатор соответствует порядковому индексу в массиве weapons
  // класса EvRoulette
  this.id = id
  // console.log(attrs)
  // атрибуты с сервера
  // this.weapon_name = attrs.weapon_name
  // this.skin_name = attrs.skin_name
  // this.rarity = attrs.rarity
  this.name = attrs.name
  // this.steam_image = attrs.steam_image

  // DOM-элемент создаётся в рендере рулетки
  this.el = null
}

EvWeapon.EL_WIDTH = 50

// КЛАСС РУЛЕТКИ
// -----------------------------------------------------------------------------

function EvRoulette (attrs) {
  // атрибуты для генерации массива this.weapons
  this.weapon_prize_attrs = attrs.weapon_prize_attrs
  this.weapon_actors_attrs = attrs.weapon_actors_attrs

  // тут будет всё оружие (оружие-приз + оружие-актёры)
  this.weapons = []

  // родительский DOM-элемент для рулетки
  this.el_parent = attrs.el_parent

  // DOM-элемент самой рулетки
  this.el = null

  // родительский DOM-элемент для DOM-элементов оружия
  // (он вращается)
  this.el_weapons = null

  // колбэк на старте вращения
  this.beforeparty = attrs.beforeparty

  // колбэк по окончании вращения
  this.afterparty = attrs.afterparty
}

// ПАРАМЕТРЫ РУЛЕТКИ
// -----------------------------------------------------------------------------

// N_WEAPONS -- это общее количество оружия в рулетке
// (приз + возможно повторяющиеся актёры)
//
// всего оружия должно быть не меньше 8 штук
// вот как оно выглядит
//
// +---+---+---+     +---+---+---+---+---+
// | 0 | 1 | 2 | ... |L-5|L-4|L-3|L-2|L-1|
// +---+---+---+     +---+---+---+---+---+
//
// L -- это N_WEAPONS
// (или после вызова метода 'set_weapons': this.weapons.length)
//
// L-3 -- на этом месте оружие-приз

// общее количество оружия
EvRoulette.N_WEAPONS = 100

// айдишник приза
EvRoulette.WEAPON_PRIZE_ID = EvRoulette.N_WEAPONS - 3

// Таргетер
EvRoulette.TARGET = 300

// время вращения
EvRoulette.SPIN_SECS = 7

// время отложенного старта
EvRoulette.START_DELAY_MSECS = 100

// интервал синхронизации звуков вращения
EvRoulette.SOUND_SPIN_INTERVAL = 100

// интервал ожидания картинок
EvRoulette.IMAGE_LOAD_INTERVAL = 500

// максимальное время ожидания картинок
// после этого придётся сдаться и показать битые картинки
// EvRoulette.IMAGE_LOAD_WAIT_MSECS = 10 * 1000

// звуки
EvRoulette.SOUND_START = 'snd/roulette_start.wav'
EvRoulette.SOUND_SPIN = 'snd/roulette_spin.wav'
EvRoulette.SOUND_STOP = 'snd/roulette_stop.wav'

// СОЗДАТЬ ОРУЖИЕ ИЗ АТРИБУТОВ
// -----------------------------------------------------------------------------

// вопрос: что тут происходит?
//  ответ: - создаётся массив из N_WEAPONS-1 актёров
//         - позицию WEAPON_PRIZE_ID занимает приз

EvRoulette.prototype.set_weapons = function () {
  const self = this
  const weapons = []
  const weapon_actors_len = self.weapon_actors_attrs.length
  let j = 0
  const set_weapon_actors = function (from_i, to_i) {
    let i
    for (i = from_i; i <= to_i; i += 1) {
      weapons[i] = new EvWeapon(
        i,
        self.weapon_actors_attrs[j]
      )
      j = (j === weapon_actors_len - 1) ? 0 : j + 1
    }
  }

  if (weapon_actors_len === 0) {
    throw new Error('Ошибка! Нет актёров.')
  }

  set_weapon_actors(0, EvRoulette.WEAPON_PRIZE_ID - 1)

  weapons[EvRoulette.WEAPON_PRIZE_ID] = new EvWeapon(
    EvRoulette.WEAPON_PRIZE_ID,
    self.weapon_prize_attrs
  )

  set_weapon_actors(EvRoulette.WEAPON_PRIZE_ID + 1, EvRoulette.N_WEAPONS + 4)

  self.weapons = weapons
}

// РЕНДЕР
// -----------------------------------------------------------------------------
EvRoulette.prototype.init = function () {

}

EvRoulette.prototype.render = function () {
  const self = this

  // console.log(self.el)
  if (self.el !== null) {
    self.el_parent.removeChild(self.el)
    // self.el.removeChild(elem);
  } else {
    self.el_parent.className = 'ev-roulette-container is-created'
  }
  const el_roulette = document.createElement('div')
  const el_target = document.createElement('div')
  const el_weapons = document.createElement('div')

  // подсчёт загруженных картинок
  // var n_images_loaded = 0
  // var image_load_wait = 0
  // var image_load_interval

  el_roulette.id = 'ev-roulette'
  el_target.id = 'ev-target'
  el_weapons.id = 'ev-weapons'

  el_weapons.style.height = (EvRoulette.N_WEAPONS * EvWeapon.EL_WIDTH) + 'px'

  self.weapons.forEach(function (weapon) {
    const el_weapon = document.createElement('div')
    const el_weapon_inner = document.createElement('div')
    const el_weapon_rarity = document.createElement('div')
    // var el_weapon_img = document.createElement('img')
    const el_weapon_text = document.createElement('div')
    const el_weapon_text_name = document.createElement('p')
    const el_weapon_text_skin_name = document.createElement('p')

    // важно: onload колбэк перед src
    // el_weapon_img.onload = function () {
    //   n_images_loaded += 1
    // }

    // el_weapon_img.src = weapon.steam_image
    // el_weapon_img.alt = weapon.weapon_name
    // console.log(weapon)
    el_weapon_text_name.textContent = weapon.name
    el_weapon_text_skin_name.textContent = '122'

    el_weapon.className = 'ev-weapon'
    el_weapon_inner.className = 'ev-weapon-inner'
    el_weapon_rarity.className = 'ev-weapon-rarity '
    el_weapon_text.className = 'ev-weapon-text'

    el_weapon_text.appendChild(el_weapon_text_name)
    el_weapon_text.appendChild(el_weapon_text_skin_name)
    el_weapon_inner.appendChild(el_weapon_rarity)
    // el_weapon_inner.appendChild(el_weapon_img)
    el_weapon_inner.appendChild(el_weapon_text)
    el_weapon.appendChild(el_weapon_inner)

    weapon.el = el_weapon

    el_weapons.appendChild(weapon.el)
  })

  el_roulette.appendChild(el_target)
  el_roulette.appendChild(el_weapons)

  // ждёмс загрузки всех картинок
  // по окончании начинаем вращаться
  // image_load_interval = setInterval(function () {
  // image_load_wait += EvRoulette.IMAGE_LOAD_INTERVAL

  // полная боевая готовность или не могу больше ждать
  // if (
  // (n_images_loaded === EvRoulette.N_WEAPONS) ||
  // (image_load_wait >= EvRoulette.IMAGE_LOAD_WAIT_MSECS)
  // ) {
  // clearInterval(image_load_interval)

  self.el_weapons = el_weapons
  self.el = el_roulette

  self.el_parent.appendChild(self.el)

  // self.spin()
  // }
  // }, EvRoulette.IMAGE_LOAD_INTERVAL)
}

// УЧУ РУЛЕТКУ ИЗДАВАТЬ ЗВУКИ
// -----------------------------------------------------------------------------

EvRoulette.prototype.make_sound = function (sound) {
  // var audio = new Audio(sound)
  // audio.volume = 0.2
  // audio.play()
}

// ВРАЩЕНИЕ РУЛЕТКИ
// -----------------------------------------------------------------------------

EvRoulette.prototype.spin = function () {
  const self = this

  const el_weapon_width_1_2 = Math.floor(EvWeapon.EL_WIDTH / 2)
  // var el_weapon_width_1_20 = Math.floor(EvWeapon.EL_WIDTH / 20)

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
  }

  // рандомная координата остановки
  const rand_stop = EvRoulette.WEAPON_PRIZE_ID * EvWeapon.EL_WIDTH +
                  -EvRoulette.TARGET +
                  getRandomInt(EvWeapon.EL_WIDTH - 3)
                  // (EvWeapon.EL_WIDTH - 3)
  // console.log(EvWeapon.WEAPON_PRIZE_ID, EvWeapon.EL_WIDTH)
  // el_weapon_width_1_2 +
  // rand(el_weapon_width_1_20, (18 * el_weapon_width_1_20))

  // эти ребята используются для синхронизации звука
  // (когда мишень совпадает с началом очередного оружия, должно тикать)
  let sound_spin_interval
  // считает количество пройденных оружий во время вращения
  let spin_counter = 0
  // console.log(rand_stop)
  // анимация теперь через 'transition', а не через 'animation'
  // 'ease-out' -- это плавное замедление рулетки

  // немного отложенный старт
  // (ибо нельзя сразу установить цсс-свойство 'left')
  // self.el.className = ''
  self.el_weapons.style.transition = 'none'
  self.el_weapons.style.top = '0px'
  setTimeout(function () {
    self.el_weapons.style.transition =
      'top ' + EvRoulette.SPIN_SECS + 's cubic-bezier(0, 0, 0.2, 1) 0s'
    // перед стартом может быть необходимость что-то сотворить
    self.beforeparty()

    self.make_sound(EvRoulette.SOUND_START)
    self.el_weapons.style.top = '-' + rand_stop + 'px'
    self.el_parent.className = 'ev-roulette-container'

    // здесь попытка синхронизировать звук вращения с анимацией
    sound_spin_interval = setInterval(function () {
      const
        current_left = Math.abs(
          parseInt(window.getComputedStyle(self.el_weapons).top, 10)
        )
      const current_spin_counter = Math.floor(
        (current_left + el_weapon_width_1_2) / EvWeapon.EL_WIDTH
      )
      // рулетка довращалась до нового оружия
      if (current_spin_counter > spin_counter) {
        spin_counter = current_spin_counter
        self.make_sound(EvRoulette.SOUND_SPIN)
      }
    }, EvRoulette.SOUND_SPIN_INTERVAL)
  }, EvRoulette.START_DELAY_MSECS)

  self.weapons.forEach(function (weapon) {
    // if (weapon.id !== EvRoulette.WEAPON_PRIZE_ID) {
    weapon.el.style.opacity = 1
    // }
  })
  // анимация остановилась
  // значит, рулетка тоже

  // self.el_weapons.removeEventListener('transitionend', transition)
  // let elClone = self.el_weapons.cloneNode(true)
  // self.el_weapons.parentNode.replaceChild(elClone, self.el_weapons)
  const once = (event) => {
    if (event.propertyName !== 'top') return
    clearInterval(sound_spin_interval)
    self.make_sound(EvRoulette.SOUND_STOP)
    self.weapons.forEach(function (weapon) {
      if (weapon.id !== EvRoulette.WEAPON_PRIZE_ID) {
        weapon.el.style.opacity = 0.5
      }
    })

    // всё, рулетка остановилась
    // дальше можешь делать что-нибудь своё
    self.afterparty()
    // console.log(event)
    // event.stopPropagation()
    self.el_weapons.removeEventListener('transitionend', once, false)
  }
  self.el_weapons.addEventListener('transitionend', once, false)
}

// ЗАПУСК
// -----------------------------------------------------------------------------

EvRoulette.prototype.start = function () {
  // перед рендером нужно создать оружие из атрибутов
  this.set_weapons()

  // рендер, который вызовет this.spin() после успешной загрузки картинок
  this.render()
}

export { EvRoulette }
