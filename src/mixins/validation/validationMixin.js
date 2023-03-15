const EMAIL_REGEX = /\S+@\S+\.\S+/
const PHONE_REGEX = /^\+?56?9\d{8}/
const HTTPS_URL_REGEX =
  /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/
const IP_REGEX =
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/

const validationMixin = {
  methods: {
    isRequired(value, fieldName) {
      return !!value || `${fieldName} es un campo requerido`
    },
    isRequiredMultiple(value, fieldName) {
      return value >= 1 || `Debe elegir al menos 1 ${fieldName}`
    },
    isValidEmail(value) {
      return EMAIL_REGEX.test(value) || 'E-mail debe ser válido'
    },
    isValidIp(value) {
      return IP_REGEX.test(value) || 'IP debe ser válido'
    },
    minLength(value, minLen) {
      return (
        (value !== undefined && value.length >= minLen) ||
        `El campo debe tener ${minLen} carácteres como mínimo`
      )
    },
    maxLength(value, maxLen) {
      return (
        (value !== undefined && value.length <= maxLen) ||
        `El campo debe tener ${maxLen} carácteres como máximo`
      )
    },
    valueBetween(value, min, max) {
      return (
        (value !== undefined && value >= min && value <= max) ||
        `El campo debe ser un valor entre ${min} y ${max}`
      )
    },
    matchingPasswords(password, confirmPassword) {
      return confirmPassword === password || `La contraseñas deben coincidir`
    },
    isValidPhone(value) {
      return PHONE_REGEX.test(value) || 'Teléfono debe ser válido'
    },
    onlyLetters(e) {
      const char = String.fromCharCode(e.keyCode)
      return /^[A-Za-zñáéíóúü]+$/.test(char) || e.preventDefault()
    },
    onlyNumbers(e) {
      const num = String.fromCharCode(e.keyCode)
      return /^[\d]+$/.test(num) || e.preventDefault()
    },
    typeCheck(value, type) {
      let valid = true
      switch (type) {
        case 'EMAIL':
          valid = EMAIL_REGEX.test(value)
          break
        case 'TELEFONO':
          valid = PHONE_REGEX.test(value)
          break
        case 'TEXTO':
          valid = /^[a-zA-Z]+$/.test(value)
          break
        default:
          break
      }
      return valid
    },
    isValidColumn(value, data) {
      let valid = true
      if (value) {
        const columnKey = value[0]
        const { type } = value[1]
        const length = data.length < 5 ? data.length : 5
        for (let index = 0; index < length; index += 1) {
          const element = data[index][columnKey]
          valid = this.typeCheck(element, type)
          if (!valid) break
        }
      }
      return valid || 'La columna posee valores inválidos'
    },
    isValidHttpsUrl(value) {
      return HTTPS_URL_REGEX.test(value) || 'URL debe ser válida y solo HTTPS'
    },
    noNegatives(value) {
      return value >= 0 || `No se permiten valores negativos`
    },
  },
}

export default validationMixin
