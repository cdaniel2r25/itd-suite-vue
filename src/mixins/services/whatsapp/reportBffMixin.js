// eslint-disable-next-line import/no-unresolved
import axios from 'axios'

const basePath = `/admin-bff`
const controllerPath = `/whatsapp/reports`
const config = {
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem('bearerToken')
        ? localStorage.getItem('bearerToken')
        : ''
    }`,
  },
}

const whatsappReportBffMixin = {
  methods: {
    getMessagesStatusTotals(filters) {
      return axios
        .post(
          `${basePath}${controllerPath}/filter/messages/totals`,
          filters,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el reporte de los mensajes de campañas o autorrespuestas de whatsapp!',
          })
        })
    },
    getMessagesDetail(filters) {
      return axios
        .post(
          `${basePath}${controllerPath}/filter/messages/detail`,
          filters,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar los mensajes de campañas o autorrespuestas de whatsapp!',
          })
        })
    },
    getFilterInit() {
      return axios
        .get(`${basePath}${controllerPath}/filter/init`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar los mensajes de campañas o autorrespuestas de whatsapp!',
          })
        })
    },
  },
}
export default whatsappReportBffMixin
