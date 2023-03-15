// eslint-disable-next-line import/no-unresolved
import axios from 'axios'

const basePath = `/admin-bff`

const controllerPath = `/custom-tables`

const config = {
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem('bearerToken')
        ? localStorage.getItem('bearerToken')
        : ''
    }`,
  },
}

const customTableBffMixin = {
  methods: {
    getDatabasesListByClientId(customTableFilter) {
      return axios
        .post(
          `${basePath}${controllerPath}/databases/filter`,
          customTableFilter,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar el listado de bases de datos!',
          })
        })
    },
    getDatabaseDetailById(customTableId) {
      return axios
        .get(`${basePath}${controllerPath}/database/${customTableId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar el detalle de la base de datos!',
          })
        })
    },
    createDatabaseByImport(newDatabase) {
      return axios
        .post(
          `${basePath}${controllerPath}/database/import`,
          newDatabase,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear nueva base de datos',
          })
        })
    },
    createDatabaseModeling(record) {
      return axios
        .post(
          `${basePath}${controllerPath}/database-modeling/add`,
          record,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear nueva base de datos',
          })
        })
    },
    saveAllDatabaseModeling(record) {
      return axios
        .post(
          `${basePath}${controllerPath}/database-modeling/save-all`,
          record,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al registrar las base de datos',
          })
        })
    },
    saveDatabaseModeling(record) {
      return axios
        .post(
          `${basePath}${controllerPath}/database-modeling/save`,
          record,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al registrar la base de dato',
          })
        })
    },
    deleteDatabaseModelingColumn(recordToDelete) {
      return axios
        .post(
          `${basePath}${controllerPath}/database-modeling/delete-column`,
          recordToDelete,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al eliminar la base de datos',
          })
        })
    },
    deleteDatabaseModeling(recordToDelete) {
      return axios
        .post(
          `${basePath}${controllerPath}/database-modeling/delete`,
          recordToDelete,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al eliminar la base de datos',
          })
        })
    },
    getDatabaseModelingByClientId(ClientId) {
      return axios
        .get(
          `${basePath}${controllerPath}/database-modeling/${ClientId}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar el detalle de la base de datos!',
          })
        })
    },
  },
}

export default customTableBffMixin
