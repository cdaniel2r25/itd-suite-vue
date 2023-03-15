// eslint-disable-next-line import/no-unresolved
import axios from 'axios'

const basePath = `/admin-bff`

const controllerPath = `/custom-tables-data`

const config = {
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem('bearerToken')
        ? localStorage.getItem('bearerToken')
        : ''
    }`,
  },
}

const customTableDataBffMixin = {
  methods: {
    getColumnTypeslist(clientId) {
      return axios
        .get(`${basePath}${controllerPath}/column-types/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar los registros de columna',
          })
        })
    },
    getDatabaseDetailsByIdAndCriteria(payload) {
      return axios
        .post(`${basePath}${controllerPath}/records/filter`, payload, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar los registros de la base de datos!',
          })
        })
    },
    addDatabaseRecordsByImport(recordsToAdd) {
      return axios
        .post(
          `${basePath}${controllerPath}/records/import`,
          recordsToAdd,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al añadir registros a la base de datos',
          })
        })
    },
    createOrEditDatabaseRecord(record) {
      return axios
        .post(`${basePath}${controllerPath}/records`, record, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear nuevo registro',
          })
        })
    },
    deleteDatabaseRecord(customTableId, id) {
      console.log(config)
      return axios
        .delete(
          `${basePath}${controllerPath}/delete/${customTableId}/${id}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al eliminar registo de la base de datos',
          })
        })
    },
  },
}

export default customTableDataBffMixin
