// eslint-disable-next-line import/no-unresolved
import axios from 'axios'

const config = {
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem('bearerToken')
        ? localStorage.getItem('bearerToken')
        : ''
    }`,
  },
}

const generalMixin = {
  methods: {
    getDataTypes(basePath) {
      return axios
        .get(`${basePath}/data-types`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar los tipos de datos!',
          })
        })
    },
    createCustomTable(basePath, customTable) {
      return axios
        .post(`${basePath}/custom-tables`, customTable)
        .then((response) => response)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para crear la tabla!',
          })
        })
    },
    getCustomTableById(basePath, customTableId) {
      return axios
        .get(`${basePath}/custom-tables/${customTableId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar la tabla!',
          })
        })
    },

    getAllCustomTables(basePath) {
      return axios
        .get(`${basePath}/custom-tables/`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar las tablas!',
          })
        })
    },
    createCustomTableFilter(basePath, customTableFilter) {
      return axios
        .post(`${basePath}/custom-tables-filter`, customTableFilter)
        .then((response) => response)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para crear el filtro!',
          })
        })
    },
    createCustomTableData(basePath, customTableData, onProgress) {
      const configOnUploadProgress = {
        onUploadProgress(progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          if (onProgress) onProgress(percentCompleted)
          return percentCompleted
        },
      }
      return axios
        .post(
          `${basePath}/custom-tables-data`,
          customTableData,
          configOnUploadProgress
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para crear la tabla con datos!',
          })
        })
    },
    getWhatsappConnectorsByClientId(basePath, clientId) {
      return axios
        .get(`${basePath}/connectors/clients/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar los conectores por cliente!',
          })
        })
    },
    getWhatsappCampaignsByClientId(basePath, clientId) {
      return axios
        .get(`${basePath}/campaigns/clients/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar las campañas por cliente!',
          })
        })
    },
  },
}

export default generalMixin
