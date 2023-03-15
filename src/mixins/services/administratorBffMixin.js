import axios from 'axios'

const basePath = `/admin-bff`

const config = {
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem('bearerToken')
        ? localStorage.getItem('bearerToken')
        : ''
    }`,
  },
}

const administratorBffMixin = {
  methods: {
    getQueuedSummaryList() {
      return axios
        .get(`${basePath}/whatsapp-activequeue/process/sumary`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar la lista de resumen!',
          })
        })
    },
    getListInProgress(filter) {
      return axios
        .post(`${basePath}/whatsapp-activequeue/process/filter`, filter, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar la lista en proceso!',
          })
        })
    },
    resubmitQueueWhatsapp(recordsResende) {
      return axios
        .post(
          `${basePath}/whatsapp-activequeue/process/resubmit`,
          recordsResende,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar el reenviar',
          })
        })
    },
    deleteProcessesList(recordsDelete) {
      return axios
        .post(
          `${basePath}/whatsapp-activequeue/process/deletedList`,
          recordsDelete,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar la eliminación',
          })
        })
    },
    getListInProgressByFilter(recordToSearch) {
      return axios
        .post(`${basePath}/activequeue/queue-progress-filter`, recordToSearch)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar la consulta',
          })
        })
    },
    getListInLatestShipmentsByFilter(recordToSearch) {
      return axios
        .post(`${basePath}/activequeue/latest-shipments-filter`, recordToSearch)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar la consulta',
          })
        })
    },
    getListInConnectorsByClientId(clientId) {
      return axios
        .get(`${basePath}/activequeue/connectors-list/${clientId}/`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar la lista de conectores!',
          })
        })
    },
    getListInConnectorsByFilter(recordToSearch) {
      return axios
        .post(`${basePath}/activequeue/processes-filter`, recordToSearch)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar la consulta',
          })
        })
    },
    getConnectorItemByStatusChange(recordToChange) {
      return axios
        .post(`${basePath}/activequeue/change-item`, recordToChange)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar la consulta',
          })
        })
    },
    getConnectorItemsByConditionChange(recordToChange) {
      return axios
        .post(`${basePath}/activequeue/change-item-condition`, recordToChange)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar la consulta',
          })
        })
    },
    saveConnector(recordNew) {
      return axios
        .post(`${basePath}/whatsapp-connections/save`, recordNew, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al registrar conector',
          })
        })
    },
    findConnectorId(clientId, connectorId) {
      return axios
        .get(`${basePath}/whatsapp-connections/${connectorId}/`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema al lista conector!',
          })
        })
    },
    deleteConnectorById(connectorId) {
      return axios
        .delete(`${basePath}/whatsapp-connections/${connectorId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para eliminar el conector!',
          })
        })
    },
    getListInMassiveWhatsappPendingByClientId(clientId) {
      return axios
        .get(`${basePath}/system/whatsapp/${clientId}/`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar la lista de estodo del sistema whatsapp!',
          })
        })
    },
    getListInSystemState() {
      return axios
        .get(`${basePath}/system/status`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar la lista de estodo del sistema!',
          })
        })
    },
    getSystemProcesses() {
      return axios
        .get(`${basePath}/systemProcess/list`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar la lista de estodo de procesos!',
          })
        })
    },
    getListInBulkWhatsAppPendingByFilter(recordToChange) {
      return axios
        .post(`${basePath}/system/whatsapp-filter`, recordToChange)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar la consulta',
          })
        })
    },
    changeInInitiatedByProcessId(recordToChange) {
      return axios
        .post(`${basePath}/systemProcess/change`, recordToChange)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar el cambio',
          })
        })
    },
    healthCheckConnectorById(connectorId) {
      return axios
        .get(`${basePath}/whatsapp-connections/health/${connectorId}/`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para conocer el estado del conector!',
          })
        })
    },
    startConnectorById(connectorId) {
      return axios
        .get(`${basePath}/whatsapp-connections/start/${connectorId}/`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para iniciar el conector!',
          })
        })
    },
    stopConnectorById(connectorId) {
      return axios
        .get(`${basePath}/whatsapp-connections/stop/${connectorId}/`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para detener el conector!',
          })
        })
    },
    restartCheckConnectorById(connectorId) {
      return axios
        .get(`${basePath}/whatsapp-connections/restart/${connectorId}/`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para reiniciar el conector!',
          })
        })
    },
  },
}

export default administratorBffMixin
