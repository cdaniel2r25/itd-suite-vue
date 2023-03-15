const mailCampaignStore = {
  state: {
    database: {
      id: null,
      name: null,
      headerConfig: { fields: [] },
      singleUse: false,
      clientId: null,
      numberRows: 0,
      numberEmailTypeRow: 0,
      numberPhoneTypeRow: 0,
      typeId: 'string',
      verified: false,
      disabled: false,
      deleted: false,
    },
    generalData: {
      name: null,
      subject: null,
      body: null,
      sender: null,
      replyTo: null,
      duplicated: false,
      autoresend: false,
      interval: null,
      retrys: null,
      staticFileInput: [],
      dinamicUrl: null,
      dinamicFtp: {
        id: '',
        name: '',
        pathId: '',
        pathName: '',
      },
    },
  },
  getters: {
    database: (state) => state.database,
    generalData: (state) => state.generalData,
  },
  mutations: {
    setDatabase(state, database) {
      state.database = database
    },
    setGeneralData(state, generalData) {
      state.generalData = generalData
    },
  },
}

export default mailCampaignStore
