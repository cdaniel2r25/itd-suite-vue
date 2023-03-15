const whatsappUtil = {
  data() {
    return {
      CONTENT_TYPE: {
        Text: 0,
        Image: 1,
        Link: 2,
        File: 3,
        Audio: 4,
      },
    }
  },
  methods: {
    isContentTypeText: (contentTypeId) => contentTypeId === 0,
    isContentTypeImage: (contentTypeId) => contentTypeId === 1,
    isContentTypeLink: (contentTypeId) => contentTypeId === 2,
    isContentTypeDocument: (contentTypeId) => contentTypeId === 3,
    isContentTypeAudio: (contentTypeId) => contentTypeId === 4,
  },
}

export default whatsappUtil
