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

const automationBffMixin = {
  methods: {
    getProcessAndAutomationListByClientIdAndProcessId(clientId, processId) {
      return axios
        .get(`${basePath}/processes/process/${clientId}/${processId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar las automatizaciones!',
          })
        })
    },
    getAutomationListByClientIdProcessIdAndAutomationId(
      clientId,
      processId,
      automationId
    ) {
      return axios
        .get(
          `${basePath}/processes/automation/${clientId}/${processId}/${automationId}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar la automatizacion!',
          })
        })
    },
    getTrackingListAutomationProcessesByClientIdAndSelectedIdAndFilter(
      clientId,
      trackingId,
      filter
    ) {
      return axios
        .get(
          `${basePath}/processes/tracking/${clientId}/${trackingId}/${filter}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar el tracking!',
          })
        })
    },
    getAutomationsProcessesListByClientId(ClientId) {
      return axios
        .get(`${basePath}/processes/${ClientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar el detalle de los procesos!',
          })
        })
    },
    getAutomationProcessListBy(clientId) {
      return axios
        .get(`${basePath}/officialTemplates/clients/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar las plantillas por cliente!',
          })
        })
    },
    renameProcessAutomationByClientIdProcessIdAndAutomationId(recordToAdd) {
      return axios
        .post(`${basePath}/processes/rename-automation`, recordToAdd)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cambiar nombre de automatización',
          })
        })
    },
    createNewAutomationItem(recordToAdd) {
      return axios
        .post(`${basePath}/processes/create-automation`, recordToAdd)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear nueva automatización',
          })
        })
    },
    createAutomationProcessByClienteIdAndNameProcess(recordToNew) {
      return axios
        .post(`${basePath}/processes/create-processes`, recordToNew)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear nuevo proceso',
          })
        })
    },
    getSearchAutomationsProcessesListByQuery(recordToSearch) {
      return axios
        .post(`${basePath}/processes/search`, recordToSearch)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar la consulta',
          })
        })
    },
    createNewAutomationByClientIdAndProcessId(recordToNew) {
      return axios
        .post(`${basePath}/processes/new-automation`, recordToNew)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear nueva automatizacion',
          })
        })
    },
    modifyProcessByClientIdAndProcessId(recordToModify) {
      return axios
        .post(`${basePath}/processes/modify-process`, recordToModify)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar la consulta',
          })
        })
    },
    getListVariablesTemplateBYJasper(recordToSearch) {
      return axios
        .post(`${basePath}/processes/variable-jasper`, recordToSearch)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al generar la consulta',
          })
        })
    },
    modifyProcessDirectoryByClientIdAndProcessId(recordToModify) {
      return axios
        .post(`${basePath}/processes/modify-directory`, recordToModify)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al modificar directorio',
          })
        })
    },
    getTemplatePdfLocalContentByClientIdAndTemplateId(clientId, templateId) {
      return axios
        .get(
          `${basePath}/processes/templatepdf/content/${clientId}/${templateId}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar la plantilla!',
          })
        })
    },
    getTemplatePdfListAutomationProcessesByClientId(clientId) {
      return axios
        .get(`${basePath}/processes/templatepdf/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar la lista de plantillas!',
          })
        })
    },
    getProcessesInEmailListOfHtmlTemplatesByClientId(clientId) {
      return axios
        .get(`${basePath}/processes/templatehtml/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar la lista de plantillas!',
          })
        })
    },
    createOrEditTemplatePdf(record) {
      return axios
        .post(`${basePath}/processes/create-template`, record)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear el template',
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
            text: '¡Problemas para cargar la lista de conexiones!',
          })
        })
    },
    getConnectorById(ConnectorId) {
      return axios
        .get(`${basePath}/connectors/get-connector/${ConnectorId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar la lista de headers!',
          })
        })
    },
    getColumnTypeslist(clientId) {
      return axios
        .get(`${basePath}/custom-tables-data/column-types/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar los registros de columna',
          })
        })
    },
    jasperSettingDelete(record) {
      return axios
        .post(`${basePath}/processes/jasper-delete`, record)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al eliminar archivo jasper',
          })
        })
    },
    jasperSettingChanges(record) {
      return axios
        .post(`${basePath}/processes/jasper-changes`, record)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al actualizar jasper',
          })
        })
    },
    getListSenderByClientIdProcessIdAndAtomationId(
      clientId,
      processId,
      atomationId
    ) {
      return axios
        .get(
          `${basePath}/send-emails/sender/list/${clientId}/${processId}/${atomationId}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar la lista de remitentes!',
          })
        })
    },
    getListOfFiltersByClientIdProcessIdAndAtomationId(
      clientId,
      processId,
      atomationId
    ) {
      return axios
        .get(
          `${basePath}/send-emails/filter/list/${clientId}/${processId}/${atomationId}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problemas para cargar la lista de filtros!',
          })
        })
    },
    getParametersInPdfGenerationByClientIdProcessIdAndAtomationId(
      clientId,
      processId,
      automationId
    ) {
      return axios
        .get(
          `${basePath}/processes/parameters/${clientId}/${processId}/${automationId}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: '¡Problema para cargar lista de parametros!',
          })
        })
    },
    modifyParametersByClientIdProcessIdAndAtomationId(record) {
      return axios
        .post(`${basePath}/processes/parameters-changes`, record)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al actualizar parametros',
          })
        })
    },
    modifyListOfStaticFilesInSendEmailsByClientIdProcessIdAtomationIdAndActivityId(
      record
    ) {
      return axios
        .post(`${basePath}/send-emails/static-files`, record)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al actualizar lista de archivos estaticos',
          })
        })
    },
  },
}

export default automationBffMixin
