import { read, utils } from 'xlsx'

const SUPPORTED_EXTENSIONS = ['txt', 'xls', 'csv', 'xlsx']
const SHEET_ROWS_TO_LOAD = 10

export default {
  methods: {
    getFileExtension(file) {
      return (
        file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length) ||
        file.name
      )
    },
    isExtensionSupported(file) {
      return SUPPORTED_EXTENSIONS.includes(
        this.getFileExtension(file).toLowerCase()
      )
    },
    fileToJsonArray(file) {
      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort()
          reject(new DOMException('Problem parsing input file.'))
        }
        reader.onload = (event) => {
          let data = event.target.result
          data = new Uint8Array(data)
          const workbook = read(data, {
            type: 'array',
            sheetRows: SHEET_ROWS_TO_LOAD,
          })

          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const json = utils.sheet_to_json(worksheet)
          resolve(json)
        }
        reader.readAsArrayBuffer(file)
      })
    },
    fileToBase64(file) {
      const index = 1
      let arrayAssistant = []
      const reader = new FileReader()
      reader.readAsDataURL(file)
      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort()
          reject(new DOMException('Problem parsing input file.'))
        }
        reader.onload = () => {
          const base64 = reader.result
          arrayAssistant = base64.split(',')
          resolve(arrayAssistant[index])
        }
      })
    },
  },
}
