const loaderStore = {
  state: {
    loader: {
      color: '#149BB7',
      loader: 'spinner',
      width: 64,
      height: 64,
      backgroundColor: '#F0F0F0',
      opacity: 0.7,
      zIndex: 999,
    },
  },
  getters: {
    loader: (state) => state.loader,
  },
}

export default loaderStore
