<template>
  <div v-if="messagesStatusCount.total !== -1">
    <v-row class="justify-space-between">
      <v-col v-for="card in cardsList" :key="card.label" :cols="cols">
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
  sent: 'Enviados',
  delivered: 'Entregados',
  seen: 'Leídos',
  received: 'Recibidos',
  queued: 'Encolados',
}

export default {
  name: 'WhatsappOutgoingMessagesReportsDashboard',
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
      cols: 2,
      chartsData: {
        total: ['sent', 'delivered', 'seen', 'received', 'queued'],
        sent: ['sent', 'delivered', 'seen'],
        seen: ['delivered', 'seen'],
      },
      cardsList: [
        {
          label: 'Total procesados',
          value: 0,
          icon: 'mdi-checkbox-marked-circle',
          iconColor: 'primary',
          tooltipContent: 'TOTAL',
        },
        {
          label: 'Enviados',
          value: 0,
          icon: 'mdi-check',
          iconColor: 'accent',
          tooltipContent: 'ENVIADOS',
        },
        {
          label: 'Entregados',
          value: 0,
          icon: 'mdi-check-all',
          iconColor: 'accent',
          tooltipContent: 'ENTREGADOS',
        },
        {
          label: 'Leídos',
          value: 0,
          icon: 'mdi-check-all',
          iconColor: 'primary',
          tooltipContent: 'LEÍDOS',
        },
        {
          label: 'Error',
          value: 0,
          icon: 'mdi-alert-circle',
          iconColor: 'accent',
          tooltipContent: 'ERROR',
        },
        {
          label: 'Encolados',
          value: 0,
          icon: 'mdi-spin mdi-loading',
          iconColor: 'accent',
          tooltipContent: 'ENCOLADOS',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['userDefaultClient']),
  },
  watch: {
    messagesStatusCount: {
      handler() {
        this.fillCardList()
      },
    },
  },
  mounted() {
    this.fillCardList()
  },
  methods: {
    fillCardList() {
      this.cardsList.forEach((card) => {
        if (card.label === 'Total procesados')
          card.value = this.messagesStatusCount.total
        else if (card.label === 'Enviados')
          card.value = this.messagesStatusCount.sent
        else if (card.label === 'Entregados')
          card.value = this.messagesStatusCount.delivered
        else if (card.label === 'Leídos')
          card.value = this.messagesStatusCount.read
        else if (card.label === 'Error')
          card.value = this.messagesStatusCount.error
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
        colors: ['#33A9C1', '#EFA61D', '#1EA13C', '#0093B1', '#B7C3C9'],
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
