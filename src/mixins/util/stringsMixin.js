const regex = /(?<=\{\{)(.*?)(?=\}\})/gm
// eslint-disable-next-line no-useless-escape
const boldregex = /(?<=\*)(.*?)(?=\*)/gm
// eslint-disable-next-line no-useless-escape
const italicregex = /(?<=\_)(.*?)(?=\_)/gm
// eslint-disable-next-line no-useless-escape
const subregex = /(?<=\~)(.*?)(?=\~)/gm

export default {
  methods: {
    findSpacesOrDashAndReplace(str, isReverse) {
      if (isReverse)
        return str
          .split(/[-,]+/)
          .filter((v) => v !== '')
          .join(' ')
      return str
        .split(/[ ,]+/)
        .filter((v) => v !== '')
        .join('-')
    },
    bodyTextStyled(str) {
      const words = str.split(' ')
      const styledTextArray = []
      words.forEach((element) => {
        if (element.match(regex)) {
          styledTextArray.push({ isVar: true, text: element })
        } else {
          styledTextArray.push({ isVar: false, text: element })
        }
      })
      return styledTextArray
    },
    assignRowsToVars(str, row, tempVars) {
      const match = str.match(regex)
      if (match)
        str.match(regex).forEach((item) => {
          if (
            str.includes(item) &&
            tempVars[item - 1].value &&
            item === tempVars[item - 1].position
          )
            str = str.replace(
              `{{${item}}}`,
              `{{${this.findSpacesOrDashAndReplace(
                row[tempVars[item - 1].value],
                false
              )}}}`
            )
        })
      return str
    },
    getVariablesBetweenBrackets(str) {
      const varArrayResult = []
      const match = str.match(regex)
      if (match)
        match.forEach((item) => {
          varArrayResult.push(item.replace('{{', '').replace('}}', ''))
        })
      return varArrayResult
    },
    transformVariablesBetweenBrackets(str) {
      const match = str.match(regex)
      if (match)
        match.forEach((item) => {
          if (str)
            str = str.replace(
              `{{${item}}}`,
              `{{${this.findSpacesOrDashAndReplace(item, true)}}}`
            )
        })
      return str
    },
    transformVariablesBetweenBracketsToString(str) {
      const match = str.match(regex)
      if (match)
        match.forEach((item) => {
          if (str)
            str = str.replace(
              `{{${item}}}`,
              `${this.findSpacesOrDashAndReplace(item, true)}`
            )
        })
      return str
    },
    getTextBetweenBrackets(str) {
      const match = str.match(regex)
      if (match)
        match.forEach((item) => {
          if (str) str = str.replace(`{{${item}}}`, `${item}`)
        })
      return str
    },
    findBolds(str) {
      const char = '*'
      const match = str.match(boldregex)
      if (match) {
        match.forEach((item) => {
          str = str.replace(`${char}${item}${char}`, `${item}`)
        })
        return str
      }
      return ''
    },
    findItalic(str) {
      const char = '_'
      const match = str.match(italicregex)
      if (match) {
        match.forEach((item) => {
          str = str.replace(`${char}${item}${char}`, `${item}`)
        })
        return str
      }
      return ''
    },
    findSub(str) {
      const char = '~'
      const match = str.match(subregex)
      if (match) {
        match.forEach((item) => {
          str = str.replace(`${char}${item}${char}`, `${item}`)
        })
        return str
      }
      return ''
    },
    textCleaner(array) {
      array.forEach((element) => {
        if (element.bold) {
          element.text = element.text.replace(/\*/g, '')
        }
        if (element.italic) {
          element.text = element.text.replace(/_/g, '')
        }
        if (element.sub) {
          element.text = element.text.replace(/~/g, '')
        }
      })
      return array
    },
    isVariable(str) {
      const match = str.match(regex)
      if (match) return true
      return false
    },
    bodyTextRich(str) {
      const words = str.split(' ')
      let aux = ''
      const styledTextArray = []
      words.forEach((word) => {
        const response = {
          bold: false,
          italic: false,
          sub: false,
          isVar: false,
          text: '',
          textOnly: '',
        }
        aux = this.findBolds(word)
        if (aux !== '') {
          response.bold = true
        }
        aux = this.findItalic(word)
        if (aux !== '') {
          response.italic = true
        }
        aux = this.findSub(word)
        if (aux !== '') {
          response.sub = true
        }
        if (this.isVariable(word)) response.isVar = true
        response.textOnly = this.getTextBetweenBrackets(word)
        if (aux !== '') response.text = aux
        else response.text = word
        styledTextArray.push(response)
      })
      return this.textCleaner(styledTextArray)
    },
    getVariablesBetweenBracketsToAssign(str) {
      const varArrayResult = []
      const match = str.match(regex)
      if (match)
        match.forEach((item) => {
          varArrayResult.push({
            text: `${item}`,
            varText: `{{${item}}}`,
            varValue: '',
          })
        })
      return varArrayResult
    },
    transformVariablesBetweenBracketsToPreview(str) {
      const match = str.match(regex)
      if (match)
        match.forEach((item) => {
          str = str.replace(`{{${item}}}`, `{{Variable ${item}}}`)
        })
      return str
    },
    deleteVariablesFromString(str) {
      const match = str.match(regex)
      if (match)
        match.forEach((item) => {
          str = str.replace(`{{${item}}}`, '')
        })
      return str
    },
  },
}
