<template>
  <v-container fluid :fill-height="!isSent">
    <v-col v-if="!isSent" class="fill-height">
      <h1 class="accent--text">Vista de creación de campaña</h1>
      <v-stepper v-model="currentStep" non-linear elevation="0" vertical>
        <v-stepper-step editable step="1" :complete="currentStep > 1">
          <span class="accent--text">Configuración destinatarios</span>
        </v-stepper-step>
        <v-stepper-content step="1">
          <database-table-uploader
            v-model="whatsappCampaign.database"
            :campaign="whatsappCampaign"
            :base-path="basePath"
            @change-template="changeTemplate()"
          />
          <div class="d-flex mt-4 mb-5">
            <v-btn
              color="primary"
              :disabled="
                whatsappCampaign.database.id === null ||
                whatsappCampaign.filter.length === 0
              "
              @click="currentStep = 2"
            >
              Siguiente
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-step
          :editable="whatsappCampaign.database.id !== null"
          step="2"
          :complete="currentStep > 2"
        >
          <span class="accent--text">Información de Campaña</span>
        </v-stepper-step>
        <v-stepper-content step="2">
          <create-campaign-info-form
            v-if="whatsappCampaign.database.id"
            :campaign="whatsappCampaign"
            :validation="validation"
          />
          <div class="d-flex mt-4 mb-5">
            <v-btn
              color="primary"
              :disabled="!validation.valid"
              @click="currentStep = 3"
            >
              Siguiente
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-step
          :editable="validation.valid"
          step="3"
          :complete="currentStep > 3"
        >
          <span class="accent--text">Mensajes y Plantillas</span>
        </v-stepper-step>
        <v-stepper-content step="3">
          <create-campaign-template-form
            :is-template-name-repeated="isTemplateNameRepeated"
            :campaign="whatsappCampaign"
            :validation="templateValidation"
            @edit-template-selected="editSelectedTemplate"
            @clean-edit-template-selected="cleanEditTemplateSelected"
          />
          <div v-if="whatsappCampaign.template.id" class="d-flex mt-10 mb-5">
            <!-- <v-btn
              outlined
              color="primary"
              :disabled="!templateValidation.head || !templateValidation.body"
              @click="saveAndExitCampaign()"
            >
              Guardar y Salir
            </v-btn> -->
            <v-btn
              :disabled="!templateValidation.head || !templateValidation.body"
              color="primary"
              @click="currentStep = 4"
            >
              Siguiente
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-step
          :editable="
            templateValidation.head &&
            templateValidation.body &&
            whatsappCampaign.template.id !== null
          "
          :complete="currentStep > 4"
          step="4"
        >
          <span class="accent--text">Validación y envío</span>
        </v-stepper-step>
        <v-stepper-content step="4">
          <create-campaign-validation-send
            v-if="
              selectedOfficialTemplate.id !== null &&
              whatsappCampaign.database.firstRows &&
              whatsappCampaign.database.firstRows.length > 0
            "
            :template="selectedOfficialTemplate"
            :campaign="whatsappCampaign"
          />
          <div class="d-flex mt-4">
            <v-btn
              outlined
              color="primary"
              :disabled="
                whatsappCampaign.scheduled &&
                (!whatsappCampaign.scheduledSendDate ||
                  !whatsappCampaign.scheduledSendTime)
              "
              @click="saveAndExitCampaign()"
            >
              Guardar y Salir
            </v-btn>
            <v-btn
              v-if="!whatsappCampaign.scheduled"
              class="ml-5"
              color="primary"
              @click="sendCampaign()"
            >
              Enviar ahora
            </v-btn>
            <v-btn
              v-else
              :disabled="
                whatsappCampaign.scheduled &&
                (!whatsappCampaign.scheduledSendDate ||
                  !whatsappCampaign.scheduledSendTime)
              "
              class="ml-5"
              color="primary"
              @click="sendCampaign()"
            >
              Programar
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper>
    </v-col>
    <v-col v-if="isSent">
      <v-row class="text-left">
        <v-col cols="5">
          <v-card
            class="d-flex justify-start align-center"
            outlined
            flat
            height="5vh"
          >
            <v-card-text>
              <v-icon class="pb-1 pr-4" color="success">mdi-check-bold</v-icon>
              <span class="text-h6 accent--text">
                Se ha enviado con éxito la campaña.
              </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="whatsappCampaign.scheduled" cols="12">
          <span class="accent--text">
            Programado para:
            {{ whatsappCampaign.scheduledSendDate }}
          </span>
          <span class="accent--text">
            a las:
            {{ ' ' + whatsappCampaign.scheduledSendTime }}.
          </span>
        </v-col>
        <v-col class="text-h6 accent--text" cols="12"> Resumen campaña </v-col>
        <v-col cols="2"> Nombre campaña: </v-col>
        <v-col class="accent--text" cols="10">
          {{ whatsappCampaign.name }}
        </v-col>
        <v-col class="accent--text" cols="2"> Destinatarios: </v-col>
        <v-col class="accent--text" cols="10">
          <span>
            {{ whatsappCampaign.database.name }}
            {{ '(' + whatsappCampaign.database.numberRows + ' Registros)' }}
          </span>
        </v-col>
        <v-col class="accent--text" cols="2"> Remitente: </v-col>
        <v-col class="accent--text" cols="10">
          <span>
            {{
              whatsappCampaign.sender.name +
              ' &lt;' +
              whatsappCampaign.sender.phone +
              '>'
            }}
          </span>
        </v-col>
        <v-col class="accent--text" cols="2"> Agente: </v-col>
        <v-col class="accent--text" cols="10">
          {{ whatsappCampaign.userBy }}
        </v-col>
        <v-col cols="2" class="mt-4 accent--text"> Plantilla: </v-col>
        <v-col cols="10" class="mt-4 accent--text">
          '{{ selectedOfficialTemplate.name }}'.
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col cols="2">
          <v-btn
            outlined
            color="primary"
            @click="$router.push({ name: 'WhatsappCampaigns' })"
          >
            IR A LISTADO CAMPAÑAS
          </v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn color="primary" @click="currentStep = 4"> IR A REPORTE </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import 'vue2-timepicker/dist/VueTimepicker.css'
import whatsappUtil from '@/mixins/util/whatsapp'
import permissionsMixin from '@/mixins/permissionsMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import DatabaseTableUploader from '@/components/util/DatabaseTableUploader.vue'
import CreateCampaignInfoForm from '@/components/modules/whatsapp/campaign/CreateCampaignInfoForm.vue'
import CreateCampaignTemplateForm from '@/components/modules/whatsapp/campaign/CreateCampaignTemplateForm.vue'
import CreateCampaignValidationSend from '@/components/modules/whatsapp/campaign/CreateCampaignValidationSend.vue'

export default {
  components: {
    CreateCampaignInfoForm,
    CreateCampaignTemplateForm,
    CreateCampaignValidationSend,
    DatabaseTableUploader,
  },
  mixins: [whatsappBffMixin, permissionsMixin, whatsappUtil],
  data() {
    return {
      basePath: '/admin-bff',
      valid: true,
      validation: {
        valid: false,
      },
      isSent: false,
      currentStep: 1,
      templateValidation: { head: false, body: false },
      whatsappCampaign: {
        eraser: false,
        id: null,
        name: '',
        sender: null,
        scheduled: false,
        scheduledSendDate: null,
        scheduledSendTime: null,
        template: {
          id: null,
          headVars: [],
          bodyVars: [],
        },
        options: {
          allowDuplicates: false,
          allowShortLinks: false,
          agentColumn: null,
          aliasColumn: null,
          approval: false,
        },
        database: {
          id: null,
          name: '',
          headerConfig: { fields: [] },
          firstRows: [],
        },
        filter: [],
      },
      isTemplateNameRepeated: false,
      selectedOfficialTemplate: {
        id: null,
        name: null,
        clientId: null,
        description: null,
        contentType: null,
        language: null,
        status: false,
        header: null,
        body: null,
        footer: null,
        createdAt: null,
      },
    }
  },
  computed: {
    ...mapGetters(['userName']),
  },
  watch: {
    'whatsappCampaign.database.id': {
      handler(value) {
        if (value) {
          this.templateValidation = { head: false, body: false }
        }
      },
    },
  },
  async beforeMount() {
    if (this.$route.params.id !== 'create') {
      this.whatsappCampaign = await this.getCampaignById(this.$route.params.id)
    }
    this.whatsappCampaign.userBy = this.userName
  },
  methods: {
    addWhatsappCampaignInfoForm() {
      this.currentStep = 2
    },
    addWhatsappCampaignTemplateForm() {
      this.currentStep = 3
    },
    async submitWhatsappCampaign() {
      if (this.valid) {
        await this.createCampaign(this.whatsappCampaign)
      }
    },
    editSelectedTemplate(selectedTemplate) {
      this.selectedOfficialTemplate = selectedTemplate
    },
    cleanEditTemplateSelected() {
      this.selectedOfficialTemplate = {
        id: null,
        name: null,
        clientId: null,
        description: null,
        contentType: null,
        language: null,
        status: false,
        header: null,
        body: null,
        footer: null,
        createdAt: null,
      }
    },
    sendCampaign() {
      this.currentStep = 4
      this.isSent = true
      this.whatsappCampaign.eraser = false
      this.submitWhatsappCampaign()
    },
    saveAndExitCampaign() {
      this.whatsappCampaign.eraser = true
      this.submitWhatsappCampaign()
      this.$router.push({ name: 'WhatsappCampaigns' })
    },
    changeTemplate() {
      if (
        this.whatsappCampaign.template.bodyVars &&
        this.whatsappCampaign.template.bodyVars.length > 0
      ) {
        this.whatsappCampaign.template.bodyVars.forEach((item) => {
          item.value = ''
        })
      }
      if (
        this.whatsappCampaign.template.headVars &&
        this.whatsappCampaign.template.headVars.length > 0
      ) {
        this.whatsappCampaign.template.headVars.forEach((item) => {
          item.value = ''
        })
      }
    },
  },
}
</script>
