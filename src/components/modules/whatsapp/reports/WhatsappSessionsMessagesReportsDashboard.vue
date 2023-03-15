<template>
  <div v-if="messagesStatusCount">
    <v-row class="justify-start mb-5">
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
  users: 'Usuarios',
  enterprises: 'Empresas',
}

export default {
  name: 'WhatsappSessionsMessagesReportsDashboard',
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
        total: ['users', 'enterprises'],
      },
      cardsList: [
        {
          label: 'Total',
          value: 0,
          icon: 'mdi-archive',
          iconColor: 'accent',
          tooltipContent: 'TOTAL',
        },
        {
          label: 'Usuarios',
          value: 0,
          icon: 'mdi-account',
          iconColor: 'accent',
          tooltipContent: 'USUARIOS',
        },
        {
          label: 'Empresas',
          value: 0,
          icon: 'mdi-store',
          iconColor: 'accent',
          tooltipContent: 'EMPRESAS',
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
        if (card.label === 'Total') card.value = this.messagesStatusCount.total
        else if (card.label === 'Usuarios')
          card.value = this.messagesStatusCount.users
        else if (card.label === 'Empresas')
          card.value = this.messagesStatusCount.enterprises
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
        colors: ['#33A9C1', '#EFA61D', '#1EA13C'],
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
