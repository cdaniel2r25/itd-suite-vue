<template>
  <div>
    <v-row class="text-left">
      <v-col class="text-h6 accent--text" cols="12">
        Revisa resumen y valida mensaje con datos cargados. Después puedes
        enviar o programar.
      </v-col>
      <v-col class="text-h6 accent--text" cols="12"> Resumen </v-col>
      <!--  -->
      <v-col v-if="isSendRestricted" cols="12">
        <v-icon color="warning">mdi-alert-circle</v-icon> Esta campaña estará
        sujeta a la restricción horaria configurada.
      </v-col>
      <!--  -->
      <v-col class="accent--text" cols="2"> Nombre campaña: </v-col>
      <v-col class="accent--text" cols="10">
        {{ campaign.name }}
      </v-col>
      <v-col class="accent--text" cols="2"> Destinatarios: </v-col>
      <v-col class="accent--text" cols="10">
        <span>
          {{ campaign.database.name }}
          {{ '(' + campaign.database.records + ' Registros)' }}
        </span>
      </v-col>
      <v-col class="accent--text" cols="2"> Remitente: </v-col>
      <v-col class="accent--text" cols="10">
        {{ campaign.sender.name + ' &lt;' + campaign.sender.phone + '>' }}
      </v-col>
      <v-col class="accent--text" cols="2"> Plantilla: </v-col>
      <v-col cols="10">
        '{{ template.name }}'.
        <span v-if="template.status" class="success--text pl-2">
          ACTIVADA
        </span>
        <span v-else class="error--text pl-2"> DESACTIVADA </span>
      </v-col>
    </v-row>
    <v-row v-if="firstRows.length > 0" class="mt-10 mb-2">
      <v-col v-for="item in firstRows" :key="item.id" cols="2">
        <hover-card-validate-whatsapp
          :selected-row="item"
          :selected-header="selectedHeader"
          @open-dialog-validate="modalactiveValidate"
        />
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      overlay-color="white"
      overlay-opacity=".8"
      width="35vw"
    >
      <v-card class="d-flex flex-column justify-space-between" height="70vh">
        <div class="d-flex justify-end mt-5">
          <v-btn color="grey" plain @click="dialog = false">
            <v-icon large color="accent">mdi-close</v-icon>
          </v-btn>
        </div>
        <v-card-title class="justify-center text-h4 accent--text">
          Validación de envío
        </v-card-title>
        <v-card-text>
          <v-col class="text-center accent--text">
            <v-icon color="success">mdi-check-bold</v-icon>
            Se cargaron las variables asignadas
          </v-col>
          <v-col class="text-center text-h5 accent--text mt-5"> Mensaje </v-col>
          <preview-official-template-validation
            v-if="tempStatus"
            :template-val="templateAux"
          />
        </v-card-text>
        <v-card-actions class="justify-center align-end mb-15 mt-n10">
          <v-btn color="primary" @click="dialog = false"> Cerrar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
        <v-switch v-model="campaign.scheduled" label="Programar envío" />
      </v-col>
    </v-row>
    <v-row
      v-if="campaign.scheduled"
      justify="start"
      no-gutters
      style="width: 20%"
    >
      <v-col cols="12">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="picker"
              class="iconColorChange"
              label="Fecha de la campaña"
              prepend-inner-icon="mdi-calendar"
              placeholder="Seleccionar fecha"
              outlined
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="picker"
            no-title
            scrollable
            locale="es-es"
            color="primary"
            @input="
              menu = false
              campaign.scheduledSendDate = picker
            "
          />
        </v-menu>
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="campaign.scheduledSendTime"
          :items="timeArray"
          class="d-flex text-center"
          outlined
          placeholder="Seleccionar hora"
        >
          <template v-slot:label>
            <v-icon color="primary" medium>mdi-clock</v-icon>
            Seleccionar hora
          </template>
          <template v-slot:item="{ item }">
            {{ item }}
          </template>
        </v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import HoverCardValidateWhatsapp from '@/components/modules/whatsapp/campaign/HoverCardValidate.vue'
import PreviewOfficialTemplateValidation from '@/components/modules/whatsapp/campaign/PreviewOfficialTemplateValidation.vue'
import stringsMixin from '@/mixins/util/stringsMixin'

export default {
  components: {
    HoverCardValidateWhatsapp,
    PreviewOfficialTemplateValidation,
  },
  mixins: [stringsMixin, whatsappBffMixin],
  props: {
    template: {
      type: Object,
      default: () => ({}),
    },
    campaign: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      menu: false,
      templateAux: {},
      tempStatus: false,
      scheduledSend: null,
      dialogs: {
        reschedule: false,
      },
      reschedule: {
        date: null,
        time: null,
        programCampaign: false,
        timeObject: null,
      },
      dialog: false,
      selectedValidationWsp: {},
      selectedHeader: '',
      rowsAux: [],
      isSendRestricted: false,
      timeArray: [
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
        '00:00',
      ],
      picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
    }
  },
  computed: {
    firstRows() {
      return this.campaign.database.firstRows
    },
  },
  watch: {
    'campaign.scheduled': {
      handler(value) {
        if (!value) {
          this.campaign.scheduledSendDate = null
          this.campaign.scheduledSendTime = null
        } else {
          this.campaign.scheduledSendDate = this.picker
        }
      },
    },
    picker: {
      handler(value) {
        if (value) {
          this.campaign.scheduledSendDate = value
        }
      },
    },
  },
  created() {
    this.picker = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10)
    this.getHoverTextArray()
    this.checkRestriccionCampaign()
  },
  methods: {
    getHoverTextArray() {
      this.rowsAux = this.campaign.database.headerConfigList.find(
        (header) => header.type === 'text_phone'
      )
      if (this.rowsAux && this.rowsAux.text)
        this.selectedHeader = this.rowsAux.text
    },
    async checkRestriccionCampaign() {
      this.isSendRestricted = await this.checkRestrictions()
    },
    modalactiveValidate(item) {
      this.templateAux = JSON.parse(JSON.stringify(this.template))
      this.selectedValidationWsp = {}
      this.selectedValidationWsp = Object.assign(
        this.selectedValidationWsp,
        item
      )
      this.linkVarsToTemplateByFirstRows()
      if (this.selectedValidationWsp) this.dialog = true
    },
    linkVarsToTemplateByFirstRows() {
      this.tempStatus = false
      this.templateAux.header = this.assignRowsToVars(
        this.template.header.content,
        this.selectedValidationWsp,
        this.campaign.template.headVars
      )
      this.templateAux.body = this.assignRowsToVars(
        this.template.body,
        this.selectedValidationWsp,
        this.campaign.template.bodyVars
      )
      this.tempStatus = true
    },
  },
}
</script>
<style scoped>
.vue__time-picker .dropdown ul li:not([disabled]).active {
  background: var(--v-primary-base);
}
.vue__time-picker .dropdown ul:hover li:not([disabled]).active {
  background: var(--v-primary-base) !important;
}
.iconColorChange :deep(.v-icon) {
  color: var(--v-primary-base);
}
</style>
