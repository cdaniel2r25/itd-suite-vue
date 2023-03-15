import adminBffMixin from '@/mixins/services/adminBffMixin'

const userStore = {
  state: {
    email: null,
    name: null,
    givenName: null,
    familyName: null,
    defaultClient: null,
    clientsList: null,
    permissions: null,
    role: null,
  },
  getters: {
    userEmail: (state) => state.email,
    userName: (state) => state.name,
    userGivenName: (state) => state.givenName,
    userFamilyName: (state) => state.familyName,
    userDefaultClient: (state) => state.defaultClient,
    userClientsList: (state) => state.clientsList,
    userPermissions: (state) => state.permissions,
    userRole: (state) => state.role,
  },
  mutations: {
    setUser(state, user) {
      state.email = user.email
      state.name = user.name
      state.givenName = user.given_name
      state.familyName = user.family_name
      state.defaultClient = user.defaultClient
      state.role = user.role
    },
    setUserClientsList(state, clientsList) {
      state.clientsList = clientsList
    },
    setUserPermissions(state, permissions) {
      state.permissions = permissions
    },
    setRole(state, role) {
      state.role = role
    },
  },
  actions: {
    async getUserPermissions({ commit, state }) {
      // TODO: esperar a eliminar si el ajuste en index.js no da problema

      const userPermissions =
        await adminBffMixin.methods.getUserPermissionsByClientId(
          state.defaultClient
        )
      commit('setUserPermissions', userPermissions.permission)
    },
    async getClientInfo({ commit }) {
      const userInfo = await adminBffMixin.methods.getUserInfo()
      commit('setUser', userInfo)
    },
  },
}
export default userStore
