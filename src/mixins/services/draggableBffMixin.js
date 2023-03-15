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

const draggableBffMixin = {
  methods: {
    getIconSocialList() {
      return axios
        .get(`${basePath}/draggable/list/iconsocial`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar la lista de Iconos sociales!',
          })
        })
    },
    getsocialDetailList() {
      return axios
        .get(`${basePath}/draggable/list/socialdetail`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar la lista de detalle de iconos sociales!',
          })
        })
    },
    getListOfFoldersAndFilesByClientId(clientId) {
      return axios
        .get(`${basePath}/draggable/list/directory/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar la lista de directorio!',
          })
        })
    },
    registerNewImageFile(record) {
      return axios
        .post(`${basePath}/draggable/new-image`, record)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al actualizar jasper',
          })
        })
    },
    registerNewHtmlTemplate(record) {
      return axios
        .post(`${basePath}/draggable/new-template`, record)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al registrar template',
          })
        })
    },
  },
}

export default draggableBffMixin
