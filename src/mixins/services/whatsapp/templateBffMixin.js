// eslint-disable-next-line import/no-unresolved
import axios from 'axios'

const basePath = `/admin-bff`
const controllerPath = `/templates`

const config = {
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem('bearerToken')
        ? localStorage.getItem('bearerToken')
        : ''
    }`,
  },
}

const templateBffMixin = {
  methods: {
    getTemplates(filter) {
      return axios
        .post(`${basePath}${controllerPath}/filter`, filter, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Problemas para cargar las plantillas oficiales!',
          })
        })
    },
    getTemplate(id) {
      return axios
        .get(`${basePath}${controllerPath}/${id}`, config)
        .then((response) => response.data)
        .catch((error) => {
          if (error.response.status === 409) {
            this.$store.commit('alert', {
              type: 'error',
              text: 'Nombre de Plantilla oficial ya existe!',
            })
          } else {
            console.error(error)
            this.$store.commit('alert', {
              type: 'error',
              text: 'Problemas para crear la plantilla oficial!',
            })
          }
          return null
        })
    },
    duplicateTemplate(id) {
      return axios
        .get(`${basePath}${controllerPath}/duplicate/${id}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Problemas para duplicar la plantilla oficial!',
          })
        })
    },
    createTemplate(template) {
      return axios
        .post(`${basePath}${controllerPath}/save`, template, config)
        .then((response) => response.data)
        .catch((error) => {
          if (error.response.status === 409) {
            this.$store.commit('alert', {
              type: 'error',
              text: 'Nombre de Plantilla oficial ya existe!',
            })
          } else {
            console.error(error)
            this.$store.commit('alert', {
              type: 'error',
              text: 'Problemas para crear la plantilla oficial!',
            })
          }
          return null
        })
    },
    updateTemplate(template) {
      return axios
        .patch(`${basePath}${controllerPath}`, template, config)
        .then((response) => response.data)
        .catch((error) => {
          if (error.response.status === 409) {
            this.$store.commit('alert', {
              type: 'error',
              text: 'Nombre de Plantilla no oficial ya existe!',
            })
          } else {
            console.error(error)
            this.$store.commit('alert', {
              type: 'error',
              text: 'Problemas para crear la plantilla oficial!',
            })
          }
          return null
        })
    },
    deleteTemplate(id) {
      return axios
        .delete(`${basePath}${controllerPath}/${id}`, config)
        .then((response) => response.data)
        .catch((error) => {
          if (error.response.status === 409) {
            this.$store.commit('alert', {
              type: 'error',
              text: 'Nombre de Plantilla oficial ya existe!',
            })
          } else {
            console.error(error)
            this.$store.commit('alert', {
              type: 'error',
              text: 'Problemas para crear la plantilla oficial!',
            })
          }
          return null
        })
    },
  },
}

export default templateBffMixin
