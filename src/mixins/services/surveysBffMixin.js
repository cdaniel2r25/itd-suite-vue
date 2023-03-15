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

const surveysBffMixin = {
  methods: {
    getListOfSurveysByClientId(params) {
      return axios
        .post(`${basePath}/surveys/list`, params, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar las encuestas!',
          })
        })
    },
    getLastSevenSurveysByClientId(clientId) {
      return axios
        .get(`${basePath}/surveys/list-new/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar la lista de las últimas encuestas',
          })
        })
    },
    registerSurveyByClientIdAndSurveyId(params) {
      return axios
        .post(`${basePath}/surveys/edit`, params, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para registrar nueva encuenta!',
          })
        })
    },
    getSurveyTemplateByClientIdAndSurveyId(params) {
      return axios
        .post(`${basePath}/surveys/get-item`, params, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para obtener encuestas!',
          })
        })
    },
  },
}
export default surveysBffMixin
