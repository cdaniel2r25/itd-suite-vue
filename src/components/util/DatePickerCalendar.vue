<template>
  <v-row>
    <v-col class="d-flex">
      <v-select
        v-model="searchRange"
        :items="dateFilterItems"
        label="Rango búsqueda"
        dense
        @change="putSelectedRangeToDatePicker()"
      >
        <template v-slot:item="{ item }">
          <span class="accent--text">{{ item }}</span>
        </template>
      </v-select>
    </v-col>
    <v-col>
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="dates"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateRangeText"
            :label="label"
            prepend-inner-icon="mdi-calendar"
            dense
            readonly
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="datefilter"
          range
          no-title
          locale="es-es"
          color="primary"
        />
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import dateMixin from '@/mixins/util/dateMixin'

export default {
  name: 'DatePickerCalendar',
  mixins: [dateMixin],
  props: {
    label: {
      type: String,
      default: 'Fecha de la campaña',
    },
  },
  data() {
    return {
      searchRange: 'Sin filtros',
      dateFilterItems: [
        'Sin filtros',
        'Hoy',
        'Ayer',
        'Esta semana',
        'Este mes',
        'Hace un mes',
        'Últimos tres meses',
        'Rango personalizado',
      ],
      datefilter: null,
      menu: false,
      dates: [],
    }
  },
  computed: {
    dateRangeText() {
      if (this.datefilter && this.datefilter.length > 1) {
        return this.sortDateRange(this.datefilter[0], this.datefilter[1])
      }
      return null
    },
  },
  watch: {
    datefilter: {
      handler(value) {
        if (value && value.length > 1) this.sendDate()
      },
    },
    searchRange: {
      handler(value) {
        if (value === 'Rango personalizado') this.menu = true
        else if (value === 'Sin filtros') {
          this.datefilter = null
          this.sendDate()
        }
      },
    },
  },

  methods: {
    putSelectedRangeToDatePicker() {
      if (this.searchRange === 'Hoy')
        this.datefilter = [
          this.reverseFormatDate(this.getCurrentDateFormatted(), '-'),
          this.reverseFormatDate(this.getCurrentDateFormatted(), '-'),
        ]
      else if (this.searchRange === 'Ayer')
        this.datefilter = [
          this.reverseFormatDate(this.getYesterdayFormatted(), '-'),
          this.reverseFormatDate(this.getYesterdayFormatted(), '-'),
        ]
      else if (this.searchRange === 'Esta semana') {
        this.datefilter = this.getCurrentWeekToArray()
      } else if (this.searchRange === 'Este mes') {
        this.datefilter = this.getCurrentMonthToArray()
      } else if (this.searchRange === 'Hace un mes') {
        this.datefilter = this.getPastMonthsToArray(1)
      } else if (this.searchRange === 'Últimos tres meses') {
        this.datefilter = this.getPastMonthsToArray(3)
      } else if (this.searchRange === 'Rango personalizado') {
        this.menu = true
      }
      return null
    },
    sendDate() {
      this.$emit('input', this.datefilter)
    },
  },
}
</script>
