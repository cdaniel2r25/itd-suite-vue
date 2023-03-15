<template>
  <div v-if="messagesStatusCount">
    <v-row class="justify-start mb-5">
      <v-col v-for="card in cardsList" :key="card.label">
        <v-card color="lightcyan">
          <v-card-title class="accent--text">{{ card.value }}</v-card-title>
          <v-card-text class="accent--text">
            {{ card.label }}
            <v-tooltip right color="accent">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class="pl-2"
                  :color="card.iconColor"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ card.icon }}
                </v-icon>
              </template>
              <div>
                <div class="pb-2 white--text font-weight-bold">
                  {{ card.tooltipContent }}
                </div>
              </div>
            </v-tooltip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-space-between">
      <div v-for="chart in Object.keys(chartsData)" :key="chart">
        <vue-apex-charts
          type="donut"
          :options="getChartOptions(chart)"
          :series="getChartSeries(chart)"
        />
      </div>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueApexCharts from 'vue-apexcharts'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'

const LABELS = {
  attended: 'Atendidos',
  notAttended: 'No atendidos',
  notSent: 'No enviados',
  duplicated: 'Duplicados',
  invalid: 'Invalidos',
  queued: 'Encolados',
}

export default {
  name: 'WhatsappReceivedMessagesReportsDashboard',
  components: {
    VueApexCharts,
  },
  mixins: [whatsappBffMixin],
  props: {
    messagesStatusCount: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      cols: 3,
      chartsData: {
        total: [
          'attended',
          'notAttended',
          'notSent',
          'duplicated',
          'invalid',
          'queued',
        ],
        comparativeChart: ['attended', 'notAttended'],
        notSent: ['notSent', 'duplicated', 'invalid', 'queued'],
      },
      firstChartSeries: [
        this.messagesStatusCount.attended,
        this.messagesStatusCount.notAttended,
      ],
      firstChartOptions: {
        labels: ['Atendidos', 'No atentidos'],
        chart: {
          type: 'donut',
        },
        responsive: [
          {
            breakpoint: 2500,
            options: {
              chart: {
                width: 360,
              },
            },
          },
        ],
        colors: ['#0093B1', '#EFA61D'],
      },
      cardsList: [
        {
          label: 'Recibidos',
          value: 0,
          icon: 'mdi-archive',
          iconColor: 'accent',
          tooltipContent: 'RECIBIDOS',
        },
        {
          label: 'Atendidos',
          value: 0,
          icon: 'mdi-checkbox-marked-circle',
          iconColor: 'accent',
          tooltipContent: 'ATENDIDOS',
        },
        {
          label: 'No atendidos',
          value: 0,
          icon: 'mdi-spin mdi-loading',
          iconColor: 'accent',
          tooltipContent: 'NO ATENDIDOS',
        },
        {
          label: 'No enviados',
          value: 0,
          icon: 'mdi-close',
          iconColor: 'accent',
          tooltipContent: 'NO ENVIADOS',
        },
        {
          label: 'Duplicados',
          value: 0,
          icon: 'mdi-content-copy',
          iconColor: 'accent',
          tooltipContent: 'Duplicados',
        },
        {
          label: 'Invalidos',
          value: 0,
          icon: 'mdi-power-plug-off',
          iconColor: 'accent',
          tooltipContent: 'INVALIDOS',
        },
        {
          label: 'Encolados',
          value: 0,
          icon: 'mdi-format-list-bulleted',
          iconColor: 'accent',
          tooltipContent: 'ENCOLADOS',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['userDefaultClient']),
  },
  mounted() {
    this.fillCardList()
  },
  methods: {
    fillCardList() {
      this.cardsList.forEach((card) => {
        if (card.label === 'Recibidos')
          card.value = this.messagesStatusCount.total
        else if (card.label === 'Atendidos')
          card.value = this.messagesStatusCount.attended
        else if (card.label === 'No atendidos')
          card.value = this.messagesStatusCount.notAttended
        else if (card.label === 'No enviados')
          card.value = this.messagesStatusCount.notSent
        else if (card.label === 'Duplicados')
          card.value = this.messagesStatusCount.duplicated
        else if (card.label === 'Invalidos')
          card.value = this.messagesStatusCount.invalid
        else if (card.label === 'Encolados')
          card.value = this.messagesStatusCount.queued
        else card.value = []
      })
    },
    getChartSeries(chart) {
      const chartSeriesList = []
      Object.entries(this.messagesStatusCount)
        .filter((record) => this.chartsData[chart].includes(record[0]))
        .forEach((element) => {
          chartSeriesList.push(element[1])
        })
      return chartSeriesList
    },
    getChartOptions(chart) {
      const chartOptions = {
        labels: [],
        chart: {
          type: 'donut',
        },
        responsive: [
          {
            breakpoint: 3500,
            options: {
              chart: {
                width: 360,
              },
            },
          },
        ],
        colors: [
          '#33A9C1',
          '#EFA61D',
          '#1EA13C',
          '#0093B1',
          '#F64B3C',
          '#B3DFE8',
          '#D2ECD8',
        ],
      }
      Object.keys(this.messagesStatusCount)
        .filter((record) => this.chartsData[chart].includes(record))
        .forEach((element) => {
          chartOptions.labels.push(LABELS[element])
        })
      return chartOptions
    },
  },
}
</script>
