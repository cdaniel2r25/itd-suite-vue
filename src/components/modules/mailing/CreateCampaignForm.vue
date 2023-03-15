<template>
  <v-row class="mb-2 pt-5 d-flex flex-column" style="width: 50%">
    <v-col
      v-for="input in createCampaignInputs"
      :key="input.id"
      class="mb-n5"
      cols="6"
    >
      <add-variable-button
        v-if="input.type === 'emojiTextArea'"
        v-model="mailCampaign.generalData[input.input]"
        :disabled="mailCampaign.database.headerConfig.fields.length < 1"
        :headers="mailCampaign.database.headerConfig.fields"
        class="d-flex justify-end"
      />

      <v-text-field
        v-if="['text', 'number'].includes(input.type)"
        v-show="input.type === 'text' || mailCampaign.generalData.autoresend"
        v-model="mailCampaign.generalData[input.input]"
        :label="input.label"
        :placeholder="input.placeholder"
        :rules="
          input.type === 'number' && !mailCampaign.generalData.autoresend
            ? []
            : _self[input.rules]
        "
        :type="input.type"
        :append-outer-icon="input.icon"
        outlined
        row
        dense
      />
      <v-select
        v-else-if="input.type === 'select' && _self[input.items].length"
        v-model="mailCampaign.generalData[input.input]"
        :items="_self[input.items]"
        :item-text="(item) => item.name + ' <' + item.account + '> '"
        item-value="id"
        :rules="_self[input.rules]"
        :label="input.label"
        outlined
        dense
      />
      <v-checkbox
        v-else-if="input.type === 'checkbox'"
        v-model="mailCampaign.generalData[input.input]"
        class="mt-n1"
      >
        <template v-slot:label>
          <span v-if="input.label.length > 35" class="pt-4">
            {{ input.label }}</span
          >
          <span v-if="input.label.length < 35"> {{ input.label }}</span>
          <v-icon class="pl-2" color="primary"> {{ input.icon }} </v-icon>
        </template>
      </v-checkbox>
      <emoji-textarea
        v-else-if="input.type === 'emojiTextArea'"
        v-model="subjectEmo"
      />
      <file-uploader
        v-if="input.type === 'fileUploader'"
        v-model="mailCampaign.generalData[input.input]"
        multiple
        hide-input-after-select-file
        label="ADJUNTAR ARCHIVOS ADJUNTOS"
        :preview-max-height="250"
      />
      <div v-else-if="input.type === 'subtitle'" class="mt-2 mb-4">
        {{ input.label }}
      </div>
      <v-dialog
        v-else-if="
          input.type === 'dynamicInput' && mailCampaign.database !== null
        "
        v-model="dialog"
        max-width="720"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mt-3 v-btn-fix"
            text
            color="primary"
            v-bind="attrs"
            v-on="on"
          >
            {{ input.label }}<v-icon class="ml-1">mdi-paperclip</v-icon>
          </v-btn>
        </template>
        <v-card v-if="mailCampaign.database !== null" class="pa-5">
          <v-card-title class="justify-center text-h5 mt-2">
            {{ input.dialogTitle }}
          </v-card-title>
          <v-flex class="justify-center">
            <v-radio-group v-model="dinamicInputRadio" row>
              <v-spacer />
              <v-radio
                label="URL Pública"
                value="url"
                @click="dinamicInputDialogHandler(true)"
              />
              <v-spacer />
              <v-radio
                label="Ruta FTP"
                value="ftp"
                @click="dinamicInputDialogHandler(false)"
              />
              <v-spacer />
            </v-radio-group>
          </v-flex>
          <v-card-subtitle v-if="urlCheckbox" class="text-center">
            Selecciona el campo de la base de datos
          </v-card-subtitle>
          <div v-if="urlCheckbox" class="d-flex">
            <v-spacer />
            <v-select
              v-model="mailCampaign.generalData.dinamicUrl"
              :items="mailCampaign.database.headerConfig.fields"
              item-text="field"
              label="Campo dinámico"
              outlined
              style="width: 60%"
              :disabled="!mailCampaign.database.headerConfig.fields.length"
            />
            <v-spacer />
          </div>
          <v-card-subtitle v-if="!urlCheckbox" class="text-center">
            Selecciona la ruta de ubicación y el tipo de conector
          </v-card-subtitle>
          <div v-if="!urlCheckbox" class="d-flex">
            <v-spacer />
            <v-select
              v-if="ftpConnections.length"
              v-model="ftpConnectionSelected"
              :items="ftpConnections"
              :item-text="(item) => item.name + ' (' + item.type + ') '"
              label="Conector"
              outlined
              append-outer-icon="mdi-help-circle"
              style="width: 60%"
              :disabled="!ftpConnections.length"
              return-object
            />
            <v-spacer />
          </div>
          <div v-if="!urlCheckbox" class="d-flex">
            <v-spacer />
            <v-select
              v-model="ftpPathSelected"
              :items="ftpConnectionSelected.paths"
              item-text="path"
              label="Campo dinámico"
              outlined
              append-outer-icon="mdi-help-circle"
              style="width: 60%"
              return-object
              :disabled="!ftpConnectionSelected.id"
            />
            <v-spacer />
          </div>
          <v-card-actions
            v-if="dinamicInputRadio && dinamicInputRadio === 'url'"
          >
            <v-spacer />
            <v-btn
              color="primary"
              outlined
              @click="
                mailCampaign.generalData.dinamicUrl = ''
                dialog = false
              "
            >
              CANCELAR
            </v-btn>
            <v-btn
              color="primary"
              :disabled="publicUrlValidation()"
              @click="dialog = false"
            >
              GUARDAR
            </v-btn>
            <v-spacer />
          </v-card-actions>
          <v-card-actions
            v-if="dinamicInputRadio && dinamicInputRadio === 'ftp'"
          >
            <v-spacer />
            <v-btn color="primary" outlined @click="clearFtpSelection()">
              CANCELAR
            </v-btn>
            <v-btn
              color="primary"
              :disabled="ftpValidation()"
              @click="
                saveFtp()
                dialog = false
              "
            >
              GUARDAR
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col class="mt-2">
      <v-card
        v-if="
          mailCampaign.generalData.dinamicUrl === '' &&
          mailCampaign.generalData.dinamicFtp.name &&
          mailCampaign.generalData.dinamicFtp.pathName
        "
        elevation="0"
        class="d-flex"
        color="gray"
        width="50%"
        height="60%"
      >
        <v-col cols="12" class="d-flex">
          <v-list-item-content>
            <v-list-item-title
              class="accent--text pt-2 pb-2"
              v-text="
                `Conector FTP: ${mailCampaign.generalData.dinamicFtp.name}`
              "
            />
            <v-list-item-title
              class="accent--text pb-2"
              v-text="`Ruta FTP: ${ftpPathSelected.path}`"
            />
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="clearFtpSelection()">
              <v-icon color="accent"> mdi-close </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-col>
      </v-card>
      <v-card
        v-if="mailCampaign.generalData.dinamicUrl !== ''"
        elevation="0"
        class="d-flex"
        cols="6"
        color="gray"
        width="50%"
        height="60%"
      >
        <v-col cols="12" class="d-flex">
          <v-list-item-content>
            <v-list-item-title
              class="accent--text"
              v-text="`Campo dinámico: ${mailCampaign.generalData.dinamicUrl}`"
            />
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="mailCampaign.generalData.dinamicUrl = ''">
              <v-icon color="accent"> mdi-close </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-col>
      </v-card>
    </v-col>

    <v-col>
      <v-btn outlined color="primary" @click="uploadFiles">
        GUARDAR Y SALIR
      </v-btn>
      <v-btn color="primary" class="ml-4" @click="storeGeneralData">
        CONTINUAR
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import mailingBffMixin from '@/mixins/services/mailingBffMixin'
import validationMixin from '@/mixins/validation/validationMixin'
import EmojiTextarea from '@/components/EmojiTextarea.vue'
import AddVariableButton from '@/components/util/AddVariableButton.vue'
import FileUploader from '@/components/util/FileUploader.vue'

export default {
  name: 'CreateCampaignForm',
  components: {
    EmojiTextarea,
    AddVariableButton,
    FileUploader,
  },
  mixins: [mailingBffMixin, validationMixin],
  props: {
    mailCampaign: {
      type: Object,
      default: () => ({ generalData: {} }),
      require: true,
    },
  },
  data() {
    return {
      senders: [],
      ftpConnections: [],
      ftpConnectionSelected: {},
      ftpPathSelected: {},
      dinamicInputRadio: 'url',
      tempFiles: [],
      dialog: false,
      urlCheckbox: true,
      subjectEmo: {
        label: 'Asunto',
        textValue: '',
        rows: '1',
        autoGrow: true,
      },
      iconPicker: false,
      createCampaignInputs: [
        {
          id: 1,
          input: 'name',
          label: 'Nombre Campaña',
          rules: 'nameRules',
          placeholder: 'Ingresar nombre campaña...',
          type: 'text',
        },
        {
          id: 2,
          input: 'sender',
          items: 'senders',
          label: 'Remitente',
          rules: 'senderRules',
          placeholder: 'Ingresar remitente',
          type: 'select',
        },
        {
          id: 3,
          input: 'replyTo',
          label: 'Responder a',
          rules: 'replyToRules',
          placeholder: 'Ingresar correo de respuesta',
          type: 'text',
        },
        {
          id: 4,
          input: 'duplicated',
          label: 'Permitir envío de email a contactos duplicados',
          icon: 'mdi-help-circle',
          type: 'checkbox',
        },
        {
          id: 5,
          input: 'autoresend',
          label: 'Reenviar automáticamente',
          icon: 'mdi-help-circle',
          type: 'checkbox',
        },
        {
          id: 6,
          input: 'interval',
          label: 'Intervalo de días',
          rules: 'intervalRules',
          type: 'number',
        },
        {
          id: 7,
          input: 'retrys',
          label: 'Cantidad de reintentos',
          rules: 'retrysRules',
          type: 'number',
        },
        {
          id: 8,
          label: 'Adjuntar elementos al email',
          type: 'subtitle',
        },
        {
          id: 9,
          input: 'staticFileInput',
          label: 'ADJUNTAR ARCHIVOS ESTATICOS',
          icon: 'mdi-help-circle',
          type: 'fileUploader',
        },
        {
          id: 10,
          input: 'dynamicInput',
          dialogTitle: 'Adjuntar dinámico',
          label: 'ADJUNTAR DINÁMICO',
          type: 'dynamicInput',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['userDefaultClient']),
    nameRules() {
      return [
        (v) => this.isRequired(v, 'Nombre campaña'),
        (v) => this.minLength(v, 4),
      ]
    },
    subjectRules() {
      return [(v) => this.isRequired(v, 'Asunto'), (v) => this.minLength(v, 3)]
    },
    bodyRules() {
      return [(v) => this.isRequired(v, 'Bajada'), (v) => this.minLength(v, 3)]
    },
    senderRules() {
      return [(v) => this.isRequired(v, 'Remitente')]
    },
    replyToRules() {
      return [
        (v) => this.isRequired(v, 'Responder a'),
        (v) => this.isValidEmail(v),
      ]
    },
    retrysRules() {
      return [
        (v) => this.isRequired(v, 'Cantidad de reintentos'),
        (v) => this.noNegatives(v),
      ]
    },
    intervalRules() {
      return [
        (v) => this.isRequired(v, 'Intervalo de días'),
        (v) => this.noNegatives(v),
      ]
    },
  },
  watch: {
    'mailCampaign.generalData.autoresend': {
      handler(value) {
        if (!value) {
          this.mailCampaign.generalData.retrys = ''
          this.mailCampaign.generalData.interval = ''
        }
      },
    },
    'subjectEmo.textValue': {
      handler(value) {
        this.mailCampaign.generalData.subject = value
      },
    },
    'mailCampaign.generalData.subject': {
      handler(value) {
        this.subjectEmo.textValue = value
      },
    },
  },
  mounted() {
    this.senders = this.getSenders()
    this.ftpConnections = this.getFtpConnections()
  },
  methods: {
    async getSenders() {
      this.senders = await this.getSendersByClientId(this.userDefaultClient)
    },
    async getFtpConnections() {
      this.ftpConnections = await this.getFtpConnectionsByClientId(
        this.userDefaultClient
      )
    },
    async uploadFiles() {
      // eslint-disable-next-line no-restricted-syntax
      for (const file of this.mailCampaign.staticFileInput) {
        // eslint-disable-next-line no-await-in-loop
        const contents = await this.uploadAttachmentFile(
          this.userDefaultClient,
          file
        )
        this.tempFiles.push(contents)
      }
      this.mailCampaign.staticFileInput = this.tempFiles
    },
    dinamicInputDialogHandler(condition) {
      if (condition) {
        this.urlCheckbox = true
        this.clearFtpSelection()
      } else {
        this.urlCheckbox = false
        this.mailCampaign.generalData.dinamicUrl = ''
      }
    },
    saveFtp() {
      this.mailCampaign.generalData.dinamicFtp.id =
        this.ftpConnectionSelected.id
      this.mailCampaign.generalData.dinamicFtp.name =
        this.ftpConnectionSelected.name
      this.mailCampaign.generalData.dinamicFtp.pathId = this.ftpPathSelected.id
      this.mailCampaign.generalData.dinamicFtp.pathName =
        this.ftpPathSelected.name
    },
    ftpValidation() {
      if (this.ftpConnectionSelected.id && this.ftpPathSelected.id) {
        return false
      }
      return true
    },
    publicUrlValidation() {
      if (this.mailCampaign.generalData.dinamicUrl !== '') {
        return false
      }
      return true
    },
    clearFtpSelection() {
      this.ftpConnectionSelected = {}
      this.ftpPathSelected = {}
      this.mailCampaign.generalData.dinamicFtp = {
        id: '',
        name: '',
        pathId: '',
        pathName: '',
      }
      this.dialog = false
    },
    storeGeneralData() {
      this.$store.commit('setGeneralData', this.mailCampaign.generalData)
    },
  },
}
</script>
<style scoped>
.v-file-input-primary :deep(.v-label) {
  color: #0093b1;
}
.v-file-input-primary :deep(.v-icon) {
  color: #0093b1;
}
.v-file-input-primary :deep(.v-label--active) {
  margin-top: -10px;
}
.v-btn-fix:focus::before {
  opacity: 0 !important;
}
</style>
