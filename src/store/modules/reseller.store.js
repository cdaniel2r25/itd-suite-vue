const resellerStore = {
  state: {
    id: null,
    name: null,
    description: null,
    email: null,
  },
  getters: {
    resellerId: (state) => state.id,
    resellerName: (state) => state.name,
    resellerDescription: (state) => state.description,
    resellerEmail: (state) => state.email,
  },
  mutations: {
    setReseller(state, reseller) {
      state.id = reseller.id
      state.name = reseller.name
      state.description = reseller.description
      state.email = reseller.email
    },
  },
}

export default resellerStore
