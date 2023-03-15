const clientStore = {
  state: {
    id: null,
    email: null,
    name: null,
    legalName: null,
    availableModules: null,
    servicesAvalibleConfig: null,
  },
  getters: {
    clientId: (state) => state.id,
    clientEmail: (state) => state.email,
    clientName: (state) => state.name,
    clientLegalName: (state) => state.legalName,
    availableModules: (state) => state.availableModules,
    servicesAvalibleConfig: (state) => state.servicesAvalibleConfig,
  },
  mutations: {
    setAvailableModules(state, modules) {
      state.availableModules = modules
    },
    setClient(state, client) {
      state.id = client.id
      state.email = client.email
      state.name = client.name
      state.legalName = client.legalName
      state.servicesAvalibleConfig = client.servicesAvalibleConfig
    },
  },
}
export default clientStore
