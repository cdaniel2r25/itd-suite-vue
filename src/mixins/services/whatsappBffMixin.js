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

const whatsappBffMixin = {
  methods: {
    getAllConnectors() {
      return axios
        .get(`${basePath}/connectors`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Problemas para cargar los remitentes!',
          })
        })
    },
    getAllNonOficialTemplates() {
      return axios
        .get(`${basePath}/nonOficialTemplates`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Problemas para cargar las plantillas no oficiales!',
          })
        })
    },
    createNonOficialTemplate(nonOficialTemplate) {
      return axios
        .post(`${basePath}/nonOficialTemplates`, nonOficialTemplate, config)
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
              text: 'Problemas para crear la plantilla no oficial!',
            })
          }
          return null
        })
    },
    createCampaign(campaign) {
      return axios
        .post(`${basePath}/campaigns/`, campaign, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Problemas para crear Campaña de Whatsapp!',
          })
        })
    },
    saveFile(file) {
      const formData = new FormData()
      formData.append('file', file)
      const { clientId } = this.$store.getters
      return axios
        .post(`${basePath}/submitFile/${clientId}`, formData, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al guardar el archivo!',
          })
        })
    },
    getNonOficialTemplateByName(name) {
      return axios
        .get(`${basePath}/nonOficialTemplates/name/${name}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Problemas para cargar plantilla no oficial!',
          })
        })
    },

    getRestrictionsByClient() {
      return axios
        .get(`${basePath}/restrictions/whatsapp`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el listado de restricciones',
          })
        })
    },
    changeRestrictionStatus(restriction) {
      return axios
        .post(`${basePath}/restrictions/status`, restriction, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cambiar estado de la restricción',
          })
        })
    },
    saveRestriction(restriction) {
      return axios
        .post(`${basePath}/restrictions/save/whatsapp`, restriction, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al guardar la restricción',
          })
        })
    },
    deleteRestrictionById(restrictionId) {
      return axios
        .delete(`${basePath}/restrictions/${restrictionId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al eliminar restricción',
          })
        })
    },
    getLabelsListByClientId(clientId) {
      return axios
        .get(`${basePath}/chats/labels/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar lista de etiquetas',
          })
        })
    },
    getChatsByClient(clientId) {
      return axios
        .get(`${basePath}/chats/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el listado de chats',
          })
        })
    },
    getFilterAgent(filter) {
      return axios
        .post(`${basePath}/chats/filter/agent/`, filter, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el listado de agentes',
          })
        })
    },
    getChatsFilter(filter) {
      return axios
        .post(`${basePath}/chats/filter/`, filter, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Problema para cargar las lista de conversacion!',
          })
        })
    },
    getSenderListByClient(clientId) {
      return axios
        .get(`${basePath}/chats/sender-list/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el listado de remitentes',
          })
        })
    },
    createChatByContactId(contact) {
      return axios
        .post(`${basePath}/chats`, contact, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear nuevo chat',
          })
        })
    },
    createNewBroadcastList(contacts) {
      return axios
        .post(`${basePath}/chats/broadcast-lists`, contacts, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear nueva lista de difusión',
          })
        })
    },
    switchTochatsList(contacts) {
      return axios
        .post(`${basePath}/chats/switchTo-lists`, contacts, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al actualizar a no asignados',
          })
        })
    },
    getMessagesByChat(filter) {
      return axios
        .post(`${basePath}/chats/messages/filter`, filter, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar los mensajes del chat',
          })
        })
    },
    getSendersByClient(filter) {
      return axios
        .post(`${basePath}/senders/filter/`, filter, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el listado de remitentes',
          })
        })
    },
    getCampaignsByClientId(clientId) {
      return axios
        .get(`${basePath}/campaigns/clients/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el listado de campañas de whatsapp',
          })
        })
    },
    getCampaignById(campaignId) {
      return axios
        .get(`${basePath}/campaigns/clients/campaign/${campaignId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar la campaña de whatsapp',
          })
        })
    },
    campaignToEraserStatus(campaignId) {
      return axios
        .get(`${basePath}/campaigns/eraser/${campaignId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cambiar el estado de la campaña de whatsapp',
          })
        })
    },
    getTemplateCategories() {
      return axios
        .get(`${basePath}/templates/categories/clients`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el listado de categorías de plantillas',
          })
        })
    },
    getTemplateLanguages() {
      return axios
        .get(`${basePath}/templates/languages/clients`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el listado de lenguajes para plantillas',
          })
        })
    },
    createTemplate(template) {
      return axios
        .post(`${basePath}/templates/save`, template, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear o actualizar plantilla',
          })
        })
    },
    getLabelsFilter(filter) {
      return axios
        .post(`${basePath}/labels/filter`, filter, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el listado de etiquetas',
          })
        })
    },
    createOrUpdateLabel(label) {
      return axios
        .post(`${basePath}/labels`, label, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear o actualizar etiqueta',
          })
        })
    },
    assignLabelsToChatById(chatId, labelsIds) {
      const payload = {
        chatId,
        labelsIds,
      }
      return axios
        .post(`${basePath}/labels/assign-labels`, payload, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al asignar etiqueta(s)',
          })
        })
    },
    deleteLabelById(labelId) {
      return axios
        .delete(`${basePath}/labels/${labelId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al eliminar etiqueta',
          })
        })
    },
    deleteSenderById(senderId) {
      return axios
        .delete(`${basePath}/senders/${senderId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al eliminar el remitente',
          })
        })
    },
    duplicateCampaignById(campaignId) {
      return axios
        .get(`${basePath}/campaigns/duplicate/${campaignId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al duplicar campaña!',
          })
        })
    },
    cancelCampaignById(campaignId) {
      return axios
        .get(`${basePath}/campaigns/cancel/${campaignId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al anular la campaña',
          })
        })
    },
    deleteCampaignById(campaignId) {
      return axios
        .delete(`${basePath}/campaigns/${campaignId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al eliminar la campaña',
          })
        })
    },
    getWebhooksByClient() {
      return axios
        .get(`${basePath}/webhooks/whatsapp`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar la lista de los webhooks de whatsapp!',
          })
        })
    },
    getWebhookStatus(webhookId) {
      return axios
        .get(`${basePath}/webhooks/test/${webhookId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al consultar el estado del webhook!',
          })
        })
    },
    saveWebhook(webhook) {
      return axios
        .post(`${basePath}/webhooks/save/whatsapp`, webhook, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al guardar webhook!',
          })
        })
    },
    createMessageByclientIdContactId(message) {
      return axios
        .post(`${basePath}/chats/messages`, message, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al crear mensaje!',
          })
        })
    },
    deleteWebhook(webhookId) {
      return axios
        .delete(`${basePath}/webhooks/${webhookId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al eliminar webhook!',
          })
        })
    },
    changeWebhookStatus(webhook) {
      return axios
        .post(`${basePath}/webhooks/status`, webhook, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cambiar estado del webhook',
          })
        })
    },
    getAgentsPropertiesByClient() {
      return axios
        .get(`${basePath}/agent-conf/properties`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar las propiedades de agentes de whatsapp',
          })
        })
    },
    updateAgentsPropertiesByClient(properties) {
      return axios
        .patch(`${basePath}/agent-conf/properties`, properties, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para actualizar las propiedades de agentes de whatsapp',
          })
        })
    },
    getAllFlagsPrefix() {
      return axios
        .get(`${basePath}/senders/`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el listado de prefijo teléfonico internacional',
          })
        })
    },
    getReceivedMessages(filters) {
      return axios
        .post(`${basePath}/messages/clients/received`, filters, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar los mensajes recibidos de campañas o autorrespuestas de whatsapp!',
          })
        })
    },

    getReceivedMessagesStatusDataToCharts(filters) {
      return axios
        .post(`${basePath}/messages/reports/clients/received`, filters, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el reporte de los mensajes de campañas o autorrespuestas de whatsapp!',
          })
        })
    },
    getSessionsMessagesStatusDataToCharts(filters) {
      return axios
        .post(`${basePath}/messages/reports/clients/sessions`, filters, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el reporte de las sesiones de campañas o autorrespuestas de whatsapp!',
          })
        })
    },
    getSessionsMessages(filters) {
      return axios
        .post(`${basePath}/messages/clients/sessions`, filters, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar los mensajes de sesiones de campañas o autorrespuestas de whatsapp!',
          })
        })
    },
    getCampaignMessagesByCampaignId(
      clientId,
      campaignId,
      senderId,
      receiver,
      pageNumber,
      limit
    ) {
      return axios
        .get(
          `${basePath}/messages/clients/campaign/${clientId}/${senderId}/${campaignId}/${receiver}/${pageNumber}/${limit}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar los mensajes de sesiones de campañas o autorrespuestas de whatsapp!',
          })
        })
    },
    getCampaignButtonsDataToCharts(clientId, campaignId) {
      return axios
        .get(
          `${basePath}/messages/reports/campaign/buttons/${clientId}/${campaignId}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el reporte de los mensajes de campañas o autorrespuestas de whatsapp!',
          })
        })
    },
    getSelectedCampaignByCampaignId(campaignId) {
      return axios
        .get(`${basePath}/campaigns/clients/campaign/${campaignId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar la campaña seleccionada de whatsapp!',
          })
        })
    },
    getReceiversByCampaignId(clientId, campaignId) {
      return axios
        .get(
          `${basePath}/messages/clients/campaigns/receiver/${clientId}/${campaignId}`,
          config
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar el reporte de los mensajes de campañas o autorrespuestas de whatsapp!',
          })
        })
    },
    saveSender(sender) {
      return axios
        .post(`${basePath}/senders/save`, sender, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al guardar remitente!',
          })
        })
    },
    getWhatsappCampaignsListByClientId(params) {
      return axios
        .post(`${basePath}/campaigns/clients`, params, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cargar la lista de campañas de whatsapp!',
          })
        })
    },
    checkRestrictions() {
      return axios
        .get(`${basePath}/restrictions/check`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al consultar las restricciones',
          })
        })
    },
    sendWhatsappMessage(message) {
      return axios
        .post(`${basePath}/chats/send/message`, message, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al enviar el mensaje!',
          })
        })
    },
    assignAgenttoChat(userId, chatId) {
      return axios
        .get(`${basePath}/chats/assign/${userId}/chat/${chatId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al asignar un agente',
          })
        })
    },
  },
}

export default whatsappBffMixin
