// eslint-disable-next-line import/no-unresolved
import axios from 'axios'

const basePath = `/admin-bff`

const controllerPath = `/autoresponses`

const config = {
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem('bearerToken')
        ? localStorage.getItem('bearerToken')
        : ''
    }`,
  },
}

const autoresponsesBffMixin = {
  methods: {
    getExistingSenders(clientId) {
      return axios
        .get(`${basePath}${controllerPath}/sender/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar lista de remitentes!',
          })
        })
    },
    getListOfTriggerConditionsByClientId(clientId) {
      return axios
        .get(`${basePath}${controllerPath}/condition/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar lista de disparadores!',
          })
        })
    },
    getAutoresponseByClientIdAndAutoresponsesId(clientId, autoresponsesId) {
      return axios
        .get(
          `${basePath}${controllerPath}/autoresponders/${clientId}/${autoresponsesId}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar autorrespuesta!',
          })
        })
    },
    getVariableListByClientId(clientId) {
      return axios
        .get(`${basePath}${controllerPath}/variable-list/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar lista de variables!',
          })
        })
    },
    getAgentGroupListByClientId(clientId) {
      return axios
        .get(`${basePath}${controllerPath}/group-list/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar lista de grupo de agentes!',
          })
        })
    },
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
            text: '¡Problemas para cargar el listado de autorrespuestas!',
          })
        })
    },
    changeAutoresponseByclientId(change) {
      return axios
        .post(`${basePath}${controllerPath}/change`, change, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para registrar la autorrespuesta!',
          })
        })
    },
    changeValidationByClientId(change) {
      return axios
        .post(`${basePath}${controllerPath}/validated`, change, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cambiar la validación!',
          })
        })
    },
    changeAssignedByClientId(assign) {
      return axios
        .post(`${basePath}${controllerPath}/assigned`, assign, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cambiar la asignación por defecto!',
          })
        })
    },
    deleteAutoresponseByClientIdAndAutoresponsesId(assign) {
      return axios
        .post(`${basePath}${controllerPath}/delete`, assign, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para eliminar la autorrespuesta!',
          })
        })
    },
    changeStatusByClientId(assign) {
      return axios
        .post(`${basePath}${controllerPath}/status`, assign, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cambiar el status!',
          })
        })
    },
    createAutoresponder(assign) {
      return axios
        .post(`${basePath}${controllerPath}/create`, assign, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para crear un autorespuesta!',
          })
        })
    },
  },
}

export default autoresponsesBffMixin
