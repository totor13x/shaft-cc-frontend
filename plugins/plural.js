export default ({ $moment }, inject) => {
  const plural = (word, num) => {
    const forms = word.split('_')
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2])
  }

  inject('localTime', (time) => {
    return $moment(time).local().format($moment.defaultFormat)
  })
  inject('plural', plural)
  inject('pluralTime', (number, withoutSuffix, key) => {
    const format = {
      s: withoutSuffix ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
      ss: withoutSuffix ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
      mm: withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
      hh: 'час_часа_часов',
      dd: 'день_дня_дней',
      MM: 'месяц_месяца_месяцев',
      yy: 'год_года_лет'
    }
    if (key === 'm') {
      return withoutSuffix ? 'минута' : 'минуту'
    } else {
      return number + ' ' + plural(format[key], +number)
    }
  })
}
