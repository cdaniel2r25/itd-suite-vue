const dateMixin = {
  data: () => ({
    timeZoneSelectItems: [
      'GMT',
      'GMT+1:00',
      'GMT+2:00',
      'GMT+3:00',
      'GMT+3:30',
      'GMT+4:00',
      'GMT+5:00',
      'GMT+5:30',
      'GMT+6:00',
      'GMT+7:00',
      'GMT+8:00',
      'GMT+9:00',
      'GMT+9:30',
      'GMT+10:00',
      'GMT+11:00',
      'GMT+12:00',
      'GMT-11:00',
      'GMT-10:00',
      'GMT-9:00',
      'GMT-8:00',
      'GMT-7:00',
      'GMT-6:00',
      'GMT-5:00',
      'GMT-4:00',
      'GMT-3:30',
      'GMT-3:00',
      'GMT-1:00',
    ],
    daysName: {
      ES: [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
      ],
      'ES/dim': ['Dom', 'Lun', 'Mar', 'Mié', 'Ju', 'Vi', 'Sá'],
    },
  }),
  methods: {
    isValidDate(d) {
      return d instanceof Date && !Number.isNaN(d)
    },
    DDMMYYYYtoMMDDYYY(d) {
      const dateParts = d.split('/')
      return new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`)
    },
    beutyDateFromTimestamp(timestamp, args) {
      const date = new Date(timestamp)
      const dateA = new Date(timestamp)
      const dateB = new Date()
      dateA.setHours(0, 0, 0, 0)
      dateB.setHours(0, 0, 0, 0)
      let [d, m] = [date.getDate(), date.getMonth() + 1]
      if (d < 10) d = `0${d}`
      if (m < 10) m = `0${m}`
      let dateStr = `${d}/${m}/${date.getFullYear()}`

      if (dateA.getTime() === dateB.getTime()) dateStr = 'Hoy'

      dateA.setDate(dateA.getDate() + 1)
      if (dateA.getTime() === dateB.getTime()) dateStr = 'Ayer'

      dateA.setDate(dateA.getDate() + 1)
      if (dateA.getTime() === dateB.getTime())
        dateStr = this.dayName(date.getDay(), 'ES')

      dateA.setDate(dateA.getDate() - 3)
      if (dateA.getTime() === dateB.getTime()) dateStr = 'Mañana'

      if (!args) return dateStr

      if (args.showWithTime) {
        let [hh, mm, ss] = [
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        ]
        if (hh < 10) hh = `0${hh}`
        if (mm < 10) mm = `0${mm}`
        if (ss < 10) ss = `0${ss}`
        dateStr += ` ${hh}:${mm}:${ss}`
      }

      return dateStr
    },
    dayName(dayNumber, locale = 'ES') {
      if (dayNumber > 6 || dayNumber < 0) return 'Invalid day number'
      try {
        return this.daysName[locale][dayNumber]
      } catch (error) {
        return 'Invalid locale'
      }
    },
    sortDateRange(firstSelected, lastSelected) {
      firstSelected = new Date(`${firstSelected}T00:00:00`)
      lastSelected = new Date(`${lastSelected}T00:00:00`)
      if (firstSelected > lastSelected) {
        return `${lastSelected.toLocaleDateString(
          'es-CL'
        )} ~ ${firstSelected.toLocaleDateString('es-CL')}`
      }
      if (firstSelected < lastSelected) {
        return `${firstSelected.toLocaleDateString(
          'es-CL'
        )} ~ ${lastSelected.toLocaleDateString('es-CL')}`
      }
      if (`${firstSelected}` === `${lastSelected}`) {
        return `${firstSelected.toLocaleDateString('es-CL')}`
      }
      return null
    },
    sortDateRangeToArray(firstSelected, lastSelected) {
      firstSelected = new Date(`${firstSelected}T00:00:00`)
      lastSelected = new Date(`${lastSelected}T00:00:00`)
      if (firstSelected > lastSelected) {
        return [
          lastSelected.toLocaleDateString('es-CL'),
          firstSelected.toLocaleDateString('es-CL'),
        ]
      }
      if (firstSelected < lastSelected) {
        return [
          firstSelected.toLocaleDateString('es-CL'),
          lastSelected.toLocaleDateString('es-CL'),
        ]
      }
      return [
        firstSelected.toLocaleDateString('es-CL'),
        lastSelected.toLocaleDateString('es-CL'),
      ]
    },
    getMonday(d) {
      d = new Date(d)
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
      return new Date(d.setDate(diff))
    },
    getCurrentDateFormatted() {
      const curr = new Date()
      return `${this.addZeroToDayOrMonth(
        curr.getDate() - 1
      )} - ${this.addZeroToDayOrMonth(curr.getMonth())} - ${curr.getFullYear()}`
    },
    getCurrentDateFormattedSql() {
      const curr = new Date()
      return `${curr.getFullYear()}-${this.addZeroToDayOrMonth(
        curr.getMonth()
      )}-${this.addZeroToDayOrMonth(curr.getDate() - 1)}`
    },
    getYesterdayFormatted() {
      const curr = new Date()
      return `${this.addZeroToDayOrMonth(
        curr.getDate() - 2
      )} - ${this.addZeroToDayOrMonth(curr.getMonth())} - ${curr.getFullYear()}`
    },
    getCurrentWeekToString() {
      const curr = new Date()
      const monday = this.getMonday(curr)
      const first = monday.getDate()
      const last = first + 6

      return `${monday.toLocaleDateString('es-CL')} - ${new Date(
        curr.setDate(last)
      ).toLocaleDateString('es-CL')}`
    },
    getCurrentWeekToArray() {
      const curr = new Date()
      const monday = this.getMonday(curr)
      const first = monday.getDate()
      const last = first + 6
      return [
        this.reverseFormatDate(`${monday.toLocaleDateString('es-CL')}`, '-'),
        this.reverseFormatDate(
          `${new Date(curr.setDate(last)).toLocaleDateString('es-CL')}`,
          '-'
        ),
      ]
    },
    getCurrentMonthToString() {
      const date = new Date()
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      return `${firstDay.toLocaleDateString(
        'es-CL'
      )} - ${lastDay.toLocaleDateString('es-CL')}`
    },
    getCurrentMonthToArray() {
      const date = new Date()
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
      return [
        this.reverseFormatDate(`${firstDay.toLocaleDateString('es-CL')}`, '-'),
        this.reverseFormatDate(`${lastDay.toLocaleDateString('es-CL')}`, '-'),
      ]
    },
    getPastMonthsToString(months) {
      const date = new Date()
      const firstDay = new Date(
        date.getFullYear(),
        date.getMonth() - months,
        date.getDate()
      )
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      )
      return `${firstDay.toLocaleDateString(
        'es-CL'
      )} - ${lastDay.toLocaleDateString('es-CL')}`
    },
    getPastMonthsToArray(months) {
      const date = new Date()
      const firstDay = new Date(
        date.getFullYear(),
        date.getMonth() - months,
        date.getDate()
      )
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
      return [
        this.reverseFormatDate(`${firstDay.toLocaleDateString('es-CL')}`, '-'),
        this.reverseFormatDate(`${lastDay.toLocaleDateString('es-CL')}`, '-'),
      ]
    },
    reverseFormatDate(date, param) {
      const dateArray = date.split(param)
      return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`.replace(
        /\s/g,
        ''
      )
    },
    addZeroToDayOrMonth(date) {
      date += 1
      return `0${date}`.slice(-2)
    },
  },
}

export default dateMixin
