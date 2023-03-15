const senderStore = {
  state: {
    id: null,
    name: null,
    account: null,
    validatedAt: null,
    validatedBy: null,
    validated: null,
    typeId: null,
  },
  getters: {
    senderId: (state) => state.id,
    senderName: (state) => state.name,
    senderAccount: (state) => state.account,
    senderValidatedAt: (state) => state.validatedAt,
    senderValidatedBy: (state) => state.validatedBy,
    senderValidated: (state) => state.validated,
    senderTypeId: (state) => state.typeId,
  },
}

export default senderStore
