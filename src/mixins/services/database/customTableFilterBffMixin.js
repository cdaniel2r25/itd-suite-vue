import axios from 'axios'

const basePath = `/admin-bff`

const controllerPath = `/custom-tables-filters`

const config = {
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem('bearerToken')
        ? localStorage.getItem('bearerToken')
        : ''
    }`,
  },
}

const customTableFilterBffMixin = {
  methods: {
    getDatabaseCustomFiltersById(payload) {
      return axios
        .post(`${basePath}${controllerPath}/filter`, payload, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar los registros de la base de datos!',
          })
        })
    },
    saveDatabaseFilter(filter) {
      return axios
        .post(`${basePath}${controllerPath}/save-filter`, filter)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Problemas para guardar el filtro',
          })
        })
    },
    deleteCustomFilter(customTableId, id) {
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
            text: 'Error al eliminar el filtro',
          })
        })
    },
    createCustomFilter(advancedSearchFilter) {
      return axios
        .post(
          `${basePath}${controllerPath}/create`,
          advancedSearchFilter,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear nuevo filtro de datos',
          })
        })
    },
  },
}

export default customTableFilterBffMixin
