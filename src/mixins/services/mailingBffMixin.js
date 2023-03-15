// eslint-disable-next-line import/no-unresolved
import axios from 'axios'

const basePath = `/mailing-bff`

const config = {
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem('bearerToken')
        ? localStorage.getItem('bearerToken')
        : ''
    }`,
  },
}

const mailingBffMixin = {
  methods: {
    getDataTypes() {
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
    getAllSenders() {
      return axios
        .get(`${basePath}/senders`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar los remitentes!',
          })
        })
    },
    createCustomTable(customTable) {
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
    getCustomTableById(customTableId) {
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
    getVerifyCustomTable(customTableId) {
      return axios
        .get(`${basePath}/custom-tables/verify/${customTableId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para verificar la tabla!',
          })
        })
    },
    getAllCustomTables() {
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
    createCustomTableFilter(customTableFilter) {
      return axios
        .post(`${basePath}/custom-tables-filter`, customTableFilter, config)
        .then((response) => response)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para crear el filtro!',
          })
        })
    },
    createCustomTableData(customTableData, onProgress) {
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
          config,
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
    getSendersByClientId(clientId) {
      return axios
        .get(`${basePath}/senders/clients/${clientId}`, clientId, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar los remitentes!',
          })
        })
    },
    createMailingTemplate(templateToCreate) {
      return axios
        .post(`${basePath}/templates`, templateToCreate, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para crear la plantilla!',
          })
        })
    },
    uploadAttachmentFile(clientId, file) {
      const formData = new FormData()
      formData.append('file', file)
      return axios
        .post(`${basePath}/uploadFile/${clientId}`, formData, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para subir el archivo!',
          })
        })
    },
    getFtpConnectionsByClientId(clientId) {
      return axios
        .get(`${basePath}/connectionsFtp/clients/${clientId}`, clientId, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar las conexiones FTP!',
          })
        })
    },
  },
}

export default mailingBffMixin
