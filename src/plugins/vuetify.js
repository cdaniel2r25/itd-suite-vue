import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#0093B1',
        primary100: '#B3DFE8',
        secondary: '#ED9C04',
        background: '#F0F0F0',
        accent: '#515151',
        error: '#F64B3C',
        info: '#0093B1',
        success: '#1EA13C',
        warning: '#ED9C04',
        complement: '#001D23',
        sidebar: '#EDEDED',
        gray: '#E7E7E7',
        gray100: '#EEEEEE',
        gray300: '#979797',
        gainsboro: '#DCDCDC',
        darkgray: '#C4C4C4',
        greencheck: '#35AA50',
        green100: '#D2ECD8',
        blue200: '#B3DFE8',
        lightcyan: '#E6F4F7',
        bluelagoon: '#00677C',
        lightgreen: '#DFF6E4',
        lightgray: '#F3F3F3',
        whatsappgreen: '#DCF8C6',
        whatsappblue: '#4546E9',
      },
    },
  },
})
