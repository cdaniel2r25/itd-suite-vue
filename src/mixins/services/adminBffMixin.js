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

const adminBffMixin = {
  methods: {
    getResellerAndClientInfo(clientId) {
      return axios
        .get(`${basePath}/resellers/clients/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar Información de Cliente!',
          })
        })
    },
    getClientsByUser() {
      config.headers.Authorization = `Bearer ${
        localStorage.getItem('bearerToken')
          ? localStorage.getItem('bearerToken')
          : ''
      }`
      return axios
        .get(`${basePath}/clients/users`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar Listado de Clientes!',
          })
        })
    },
    getAllClients() {
      return axios
        .get(`${basePath}/clients`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar los clientes!',
          })
        })
    },
    getFilterInit() {
      return axios
        .get(`${basePath}/clients/filter/init`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar los filtros iniciales!',
          })
        })
    },
    getClientList(filters) {
      return axios
        .post(`${basePath}/clients/filter`, filters, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar los clientes!',
          })
        })
    },
    getClientById(clientId) {
      return axios
        .get(`${basePath}/clients/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar el cliente!',
          })
        })
    },
    getUserInfo() {
      const accessToken = localStorage.getItem('accessToken')
        ? localStorage.getItem('accessToken')
        : ''
      config.headers.Authorization = `Bearer ${
        localStorage.getItem('bearerToken')
          ? localStorage.getItem('bearerToken')
          : ''
      }`
      return axios
        .get(`${basePath}/users/userInfo/${accessToken}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar Información de Usuario!',
          })
        })
    },
    getUserById(userId) {
      return axios
        .get(`${basePath}/users/user/${userId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar Información del usuario!',
          })
        })
    },
    deleteUserById(userId) {
      return axios
        .delete(`${basePath}/users/${userId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para eliminar el usuario!',
          })
        })
    },
    deleteClientById(clientId) {
      return axios
        .delete(`${basePath}/clients/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para eliminar el cliente!',
          })
        })
    },
    getRolesAndGroupedPermissionByClientId() {
      return axios
        .get(`${basePath}/permission/clients/`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar Permisos del Cliente!',
          })
        })
    },
    createReseller(reseller) {
      return axios
        .post(`${basePath}/resellers`, reseller, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para crear el Reseller!',
          })
        })
    },
    getResellersByClient() {
      // TODO
      // Esto se pasara a un axios
      return [{ id: 'abcfa87e-6fd3-11ec-8b9a-0242ac110002', name: 'ITD Chile' }]
    },
    createClient(client) {
      return axios
        .post(`${basePath}/clients`, client, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: '¡Problemas para crear el Cliente!',
          })
        })
    },
    getUserPermissionsByClientId(clientId) {
      return axios
        .get(`${basePath}/permission/clients/${clientId}/application`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar los permisos del usuario!',
          })
        })
    },
    getAllApplications() {
      return axios
        .get(`${basePath}/applications`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar las aplicaciones!',
          })
        })
    },
    getResellers() {
      return axios
        .get(`${basePath}/resellers`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar los resellers!',
          })
        })
    },
    getUsers() {
      return axios
        .get(`${basePath}/users`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar los resellers!',
          })
        })
    },
    getUsersByClient(clientId) {
      return axios
        .get(`${basePath}/users/clients/${clientId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar Listado de Usuarios!',
          })
        })
    },
    getUsersFiltered(filters) {
      return axios
        .post(`${basePath}/users/filter`, filters, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar listado de usuarios!',
          })
        })
    },
    getUsersInit() {
      return axios
        .get(`${basePath}/users/filter/init`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar el filtro inicial!',
          })
        })
    },
    createUser(user) {
      return axios
        .post(`${basePath}/users`, user, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para crear el Usuario!',
          })
        })
    },
    editUser(user) {
      return axios
        .post(`${basePath}/users/edit`, user, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para editar el Usuario!',
          })
        })
    },
    getAllowedRolesByClient() {
      return axios
        .get(`${basePath}/roles/client`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para obtener la lista de roles del cliente!',
          })
        })
    },
    createRolePermission(rolePermission) {
      return axios
        .post(`${basePath}/roles/permission/create`, rolePermission, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para crear el Rol!',
          })
        })
    },
    postPermissionByRole(permissions) {
      return axios
        .post(`${basePath}/roles/permission`, permissions, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para actualizar los permisos del rol!',
          })
        })
    },
    createFilter(databaseId, filterId) {
      // TODO: Create adminbff call to store selected database filter
      console.log(databaseId, filterId)
    },
    getWhatsappConnections(filter) {
      return axios
        .post(`${basePath}/whatsapp-connections/filter`, filter, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar las conexiones!',
          })
        })
    },
    assignSenderToWhatsappConnection(connection) {
      return axios
        .post(`${basePath}/whatsapp-connections/assign`, connection, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para asignar el remitente a una conexión!',
          })
        })
    },
    unassignSenderToWhatsappConnection(connection) {
      return axios
        .post(`${basePath}/whatsapp-connections/unassign`, connection, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para desasignar el remitente a una conexión!',
          })
        })
    },
    getAssignedSender(id) {
      return axios
        .get(`${basePath}/whatsapp-connections/sender/${id}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar el remitente asignado!',
          })
        })
    },
    updateUserApiToken(apiToken, userId) {
      return axios
        .put(`${basePath}/users/updateToken/${userId}`, apiToken, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para actualizar el User API TOKEN!',
          })
        })
    },
    getApplicationAvalible() {
      return axios
        .get(`${basePath}/applications/avalible`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para cargar las aplicaciones por cliente!',
          })
        })
    },
    importWhatsappContacts(contacts) {
      return axios
        .post(`${basePath}/contacts/import`, contacts, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al importar la lista de contactos',
          })
        })
    },
    getContactsByClient(filter) {
      return axios
        .post(`${basePath}/contacts/filter`, filter, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al obtener la lista de contactos',
          })
        })
    },
    createSingleContact(contacts) {
      return axios
        .post(`${basePath}/contacts/save`, contacts, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al guardar el contacto',
          })
        })
    },
    editSingleContact(contacts) {
      return axios
        .post(`${basePath}/contacts/save`, contacts, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al editar el contacto',
          })
        })
    },
    getContactsListsByClient(filter) {
      return axios
        .post(`${basePath}/contacts/list/filter`, filter, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al obtener la lista de contactos',
          })
        })
    },
    deleteContactById(contactId) {
      return axios
        .delete(`${basePath}/contacts/${contactId}`, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            color: 'error',
            text: 'Problemas para eliminar el contacto!',
          })
        })
    },
    changeWhatsappQueuePriority(queue) {
      return axios
        .post(`${basePath}/whatsapp-activequeue/priority/change`, queue, config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error)
          this.$store.commit('alert', {
            type: 'error',
            text: 'Error al cambiar la prioridad!',
          })
        })
    },
  },
}

export default adminBffMixin
