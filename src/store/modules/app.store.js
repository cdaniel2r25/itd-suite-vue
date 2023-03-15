const userStore = {
  state: {
    miniSideBar: true,
  },
  getters: {
    miniSideBar: (state) => state.miniSideBar,
  },
  mutations: {
    setMiniSideBar(state, miniSideBar) {
      state.miniSideBar = miniSideBar
    },
  },
}
export default userStore
