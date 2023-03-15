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

const notificationsBffMixin = {
  methods: {
    getNotificationsNewsByClientId(clientId) {
      return axios
        .get(`${basePath}/notifications/news/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar las notificaciones!',
          })
        })
    },
    getNotificationsAllByClientId(clientId) {
      return axios
        .get(`${basePath}/notifications/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar las notificaciones!',
          })
        })
    },
    markNotificationsAsReadByClientIdNotificationId(record) {
      return axios
        .post(`${basePath}/notifications/read`, record)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al marcar como leídos!',
          })
        })
    },
    getSearchAutomationsProcessesListByQuery(record) {
      return axios
        .post(`${basePath}/notifications/list-all/`, record)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Problema para cargar las notificaciones!',
          })
        })
    },
  },
}

export default notificationsBffMixin
