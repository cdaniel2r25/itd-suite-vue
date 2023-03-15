// eslint-disable-next-line import/no-unresolved
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

const connectorsMixin = {
  methods: {
    testFtpConnector(serverIp, serverPort, user, password) {
      return axios
        .get(
          `${basePath}/connectors/ftp/test/${serverIp}/${serverPort}/${user}/${password}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar probar el conector ftp!',
          })
        })
    },
    testSftpConnector(connector) {
      return axios
        .post(`${basePath}/connectors/sftp/test`, connector, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar probar el conector sftp!',
          })
        })
    },
    testApiConnector(connector) {
      return axios
        .post(`${basePath}/connectors/api-rest/test`, connector, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar probar el conector api!',
          })
        })
    },
    testSmtpConnector(connector) {
      return axios
        .post(`${basePath}/connectors/smtp/test`, connector, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar probar el conector smtp!',
          })
        })
    },
    testFtpPath(path) {
      return axios
        .post(`${basePath}/paths/ftp/test`, path, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar probar la ruta ftp!',
          })
        })
    },
    testSftpPath(path) {
      return axios
        .post(`${basePath}/paths/sftp/test`, path, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar probar la ruta ftp!',
          })
        })
    },
    createFtpPath(path) {
      return axios
        .post(`${basePath}/paths/ftp`, path, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar crear la ruta ftp!',
          })
        })
    },
    createSftpPath(path) {
      return axios
        .post(`${basePath}/paths/sftp`, path, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar crear la ruta sftp!',
          })
        })
    },
    testConnectorByClientId(connectorId, clientId) {
      return axios
        .get(
          `${basePath}/connectors/test/${connectorId}/client/${clientId}'`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar probar el conector!',
          })
        })
    },
    getConnectorById(connectorId) {
      return axios
        .get(`${basePath}/connectors/get-connector/${connectorId}'`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar obtener el conector!',
          })
        })
    },
    createFtpConnector(connector) {
      return axios
        .post(`${basePath}/connectors/create/ftp`, connector, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar crear el conector ftp!',
          })
        })
    },
    createSftpConnector(connector) {
      return axios
        .post(`${basePath}/connectors/create/sftp`, connector, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar crear el conector sftp!',
          })
        })
    },
    saveFtpConnector(connector) {
      return axios
        .post(`${basePath}/connectors/save/ftp`, connector, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar guardar el conector ftp!',
          })
        })
    },
    saveSftpConnector(connector) {
      return axios
        .post(`${basePath}/connectors/save/sftp`, connector, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar guardar el conector sftp!',
          })
        })
    },
    saveApiConnector(connector) {
      return axios
        .post(`${basePath}/connectors/save/api`, connector, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar guardar el conector api!',
          })
        })
    },
    saveSmtpConnector(connector) {
      return axios
        .post(`${basePath}/connectors/save/smtp`, connector, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al intentar guardar el conector smtp!',
          })
        })
    },
    getAllTypesConnectorsByClientId(clientId, connectorType) {
      return axios
        .get(
          `${basePath}/connectors/types/${clientId}/${connectorType}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar todos los tipos de conectores por cliente!',
          })
        })
    },
    deleteConnectorByConnectorId(clientId, connectorId) {
      return axios
        .delete(`${basePath}/connectors/${clientId}/${connectorId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para eliminar el conector!',
          })
        })
    },
    deletePathById(pathId) {
      return axios
        .get(`${basePath}/paths/delete/${pathId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para eliminar la ruta!',
          })
        })
    },
    deleteApiParameterById(paramId) {
      return axios
        .get(`${basePath}/connectors/parameters/delete/${paramId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para eliminar el parámetro!',
          })
        })
    },
    deleteApiHeaderById(headerId) {
      return axios
        .get(`${basePath}/connectors/headers/delete/${headerId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para eliminar el header!',
          })
        })
    },
    deleteApiBodyParameterById(bodyParamId) {
      return axios
        .get(`${basePath}/connectors/body/delete/${bodyParamId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para eliminar el parámetro del body!',
          })
        })
    },
  },
}

export default connectorsMixin
