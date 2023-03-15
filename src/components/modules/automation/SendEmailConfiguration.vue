<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <div class="px-6 mt-4">
        <v-select
          v-model="selectedActivity.config.filter"
          dense
          :items="listFilter"
          :rules="fieldRules"
          label="Filtro"
          placeholder="Seleccione filtro"
          outlined
          @change="$emit('change-element')"
        />
        <div class="font-weight-bold accent--text mb-4">Conexión</div>
        <v-select
          v-model="selectedActivity.config.connection.type"
          dense
          :items="listConnectionType"
          :rules="fieldRules"
          label="Tipo"
          placeholder="Seleccione tipo"
          outlined
          @change="changeListConnection()"
        />
        <v-select
          v-model="selectedActivity.config.connection.connection"
          dense
          :items="listConnectionByType"
          item-text="name"
          item-value="id"
          :rules="fieldRules"
          label="Conexión"
          placeholder="Seleccione conexión"
          outlined
          return-object
          @change="$emit('change-element')"
        />
      </div>
      <div class="px-6 font-weight-bold accent--text d-flex align-start">
        Verificación de conexión
        <tooltip message="Aqui mensaje" />
      </div>
      <v-card elevation="0" color="lightgreen" class="mx-6 mt-2">
        <v-card-text class="py-1">
          {{ selectedActivity.config.connection.connection.name }}
        </v-card-text>
      </v-card>
      <div>
        <div
          v-if="selectedActivity.config.connection.type === 'SMTP'"
          class="px-6 mt-4 caption"
        >
          Valida si requieres items en headers de conexión, y edita sus valores
          si lo necesitas.
        </div>
        <div v-else class="px-6 mt-4 caption">
          Valida si requieres items en Parámetros, Headers o Bodys de conexión y
          edita sus valores si lo necesitas.
        </div>
        <div
          v-if="
            !activateParameters &&
            selectedActivity.config.connection.type !== 'SMTP'
          "
          class="px-6"
        >
          <v-btn
            class="mt-4"
            outlined
            block
            x-large
            color="primary"
            @click="selectActivateParameters()"
          >
            <v-icon left> mdi-view-list </v-icon>
            VER PARÁMETROS
          </v-btn>
        </div>
        <div v-if="activateParameters" class="px-1">
          <div class="mt-4 pl-4 accent--text">Parámetros:</div>
          <v-card
            outlined
            max-height="200"
            min-height="200"
            class="overflow-y-auto mt-2 mx-1"
          >
            <v-row no-gutters class="caption mx-2 mt-3">
              <v-col cols="3" class="font-weight-bold">Requerido</v-col>
              <v-col cols="4" class="font-weight-bold">Key</v-col>
              <v-col cols="4" class="font-weight-bold">Valor</v-col>
              <v-col cols="1" class="font-weight-bold"></v-col>
            </v-row>
            <v-divider class="my-1"></v-divider>
            <table-headers-parameter
              :list-headers="listParameters"
              @edit-hearders="editParameters"
            />
          </v-card>
          <div class="px-1">
            <v-btn
              text
              color="primary"
              class="pl-0"
              @click="activateParameters = !activateParameters"
            >
              CERRAR PARÁMETROS
            </v-btn>
          </div>
        </div>
        <div v-if="!activateHeaders" class="px-6">
          <v-btn
            class="mt-4"
            outlined
            block
            x-large
            color="primary"
            @click="selectActivateHeaders()"
          >
            <v-icon left> mdi-view-list </v-icon>
            VER HEADERS
          </v-btn>
        </div>
        <div v-if="activateHeaders" class="px-1">
          <div class="mt-4 pl-4 accent--text">Headers:</div>
          <v-card
            outlined
            max-height="200"
            min-height="200"
            class="overflow-y-auto mt-2 mx-1"
          >
            <v-row no-gutters class="caption mx-2 mt-3">
              <v-col cols="3" class="font-weight-bold">Requerido</v-col>
              <v-col cols="4" class="font-weight-bold">Key</v-col>
              <v-col cols="4" class="font-weight-bold">Valor</v-col>
              <v-col cols="1" class="font-weight-bold"></v-col>
            </v-row>
            <v-divider class="my-1"></v-divider>
            <table-headers-parameter
              :list-headers="listHeaders"
              @edit-hearders="editHearders"
            />
          </v-card>
          <div class="px-1">
            <v-btn
              text
              color="primary"
              class="pl-0"
              @click="activateHeaders = !activateHeaders"
            >
              CERRAR HEADERS
            </v-btn>
          </div>
        </div>
        <div
          v-if="
            !activateBodys && selectedActivity.config.connection.type !== 'SMTP'
          "
          class="px-6"
        >
          <v-btn
            class="mt-4"
            outlined
            block
            x-large
            color="primary"
            @click="selectActivateBodys()"
          >
            <v-icon left> mdi-view-list </v-icon>
            VER BODYS
          </v-btn>
        </div>
        <div v-if="activateBodys" class="px-1">
          <div class="mt-4 pl-4 accent--text">Bodys:</div>
          <v-card
            outlined
            max-height="200"
            min-height="200"
            class="overflow-y-auto mt-2 mx-1"
          >
            <v-row no-gutters class="caption mx-2 mt-3">
              <v-col cols="3" class="font-weight-bold">Requerido</v-col>
              <v-col cols="4" class="font-weight-bold">Key</v-col>
              <v-col cols="4" class="font-weight-bold">Valor</v-col>
              <v-col cols="1" class="font-weight-bold"></v-col>
            </v-row>
            <v-divider class="my-1"></v-divider>
            <table-headers-parameter
              :list-headers="listBodys"
              @edit-hearders="editBodys"
            />
          </v-card>
          <div class="px-1">
            <v-btn
              text
              color="primary"
              class="pl-0"
              @click="activateBodys = !activateBodys"
            >
              CERRAR BODYS
            </v-btn>
          </div>
        </div>
      </div>
      <div class="px-6 mt-6 font-weight-bold accent--text">Ajustes envío</div>
      <div class="px-6 mt-2">
        <v-select
          v-model="selectedActivity.config.sender"
          dense
          :items="listSender"
          :rules="fieldRules"
          label="Remitente"
          placeholder="Seleccione remitente"
          outlined
          @change="$emit('change-element')"
        />
        <div class="text-right">
          <v-menu bottom origin="center center" transition="scale-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text color="primary" v-bind="attrs" v-on="on">
                AGREGAR VARIABLE
                <v-icon right color="primary"> mdi-plus-circle-outline </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, i) in selectedActivity.config.dataBase"
                :key="i"
                @click="addVariableAddressee(item.name)"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-text-field
          v-model="selectedActivity.config.addressee"
          label="Destinatario"
          placeholder="Escriba destinatario"
          :rules="textRules"
          outlined
          dense
          @change="$emit('change-element')"
        />
        <div class="d-flex align-start justify-end">
          <div class="text-right">
            <v-menu bottom origin="center center" transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn text color="primary" v-bind="attrs" v-on="on">
                  AGREGAR VARIABLE
                  <v-icon right color="primary">
                    mdi-plus-circle-outline
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, i) in selectedActivity.config.dataBase"
                  :key="i"
                  @click="addVariableAnswerTo(item.name)"
                >
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <tooltip
              message="Agrega variable para<br>insertar email de respuesta,<br>desde columna  de BBDD."
            />
          </div>
        </div>
        <v-text-field
          v-model="selectedActivity.config.answerTo"
          label="Responder a"
          placeholder="Escriba"
          :rules="textRules"
          outlined
          dense
          @change="$emit('change-element')"
        />
      </div>
      <div class="px-6 mt-4">
        <div class="font-weight-bold accent--text">Adjuntos</div>
        <div class="caption mt-2">
          Selecciona opción para adjuntar elementos en envio de email.
        </div>
        <div class="mt-4">
          <v-checkbox
            v-model="selectedActivity.config.attach.attachDynamic"
            label="Adjuntar dinámico"
            hide-details
            class="mr-1 mt-0"
            @change="changeAttachDynamic()"
          />
        </div>
        <v-btn text color="primary" class="mt-4 pl-0" @click="openFile()">
          ADJUNTAR ARCHIVO estático
          <v-icon right color="primary"> mdi-paperclip </v-icon>
        </v-btn>
      </div>
      <div
        v-if="selectedActivity.config.attach.staticList.lengh !== 0"
        class="px-6"
      >
        <v-card
          v-for="(item, i) in selectedActivity.config.attach.staticList"
          :key="i"
          color="gray100"
          elevation="0"
          class="mb-1"
        >
          <div class="d-flex justify-space-between align-center py-1">
            <div class="ml-2 text-overline">{{ item.fileName }}</div>
            <div class="d-flex justify-space-between align-center">
              <div class="gray300--text caption mr-1">
                tamaño: {{ item.size }}
              </div>
              <div>
                <v-icon
                  color="grey"
                  class="mr-2"
                  @click="deleteItemAttach(item)"
                >
                  mdi-close
                </v-icon>
              </div>
            </div>
          </div>
        </v-card>
      </div>
      <div class="px-6 my-6">
        <div class="font-weight-bold accent--text">Plantilla</div>
        <div v-if="selectedActivity.config.template.generateTemplate === false">
          <v-btn
            class="mt-4"
            outlined
            block
            x-large
            color="primary"
            @click="createNewTemplate()"
          >
            <v-icon left> mdi-plus-circle-outline </v-icon>
            CREAR PLANTILLA
          </v-btn>
          <v-btn
            v-if="!chooseTemplate"
            class="mt-4"
            outlined
            block
            x-large
            color="primary"
            @click="chooseTemplate = !chooseTemplate"
          >
            <v-icon left> mdi-file-multiple-outline </v-icon>
            SELECCIONAR PLANTILLA
          </v-btn>
          <v-card v-else outlined max-height="240" class="mt-2 overflow-y-auto">
            <v-card-text class="d-flex flex-column">
              <v-sheet
                v-for="item in listTemplate"
                :key="item.id"
                outlined
                color="primary"
                rounded
                class="mb-2"
              >
                <hover-card-image-template
                  :item-template="item"
                  @open-dialog="registerNewTemplate(item)"
                  @open-view="openView(item)"
                />
              </v-sheet>
            </v-card-text>
          </v-card>
        </div>
        <div v-else>
          <v-sheet outlined color="primary" rounded class="mt-4">
            <hover-card-image-template
              :item-template="selectedActivity.config.template"
              label-btn="editar"
              @open-dialog="editTemplate()"
              @open-view="openView(selectedActivity.config.template)"
            />
          </v-sheet>
          <v-btn
            text
            color="primary"
            class="pl-0"
            @click="deleteTemplate = !deleteTemplate"
          >
            Eliminar
          </v-btn>
          <v-sheet
            v-if="deleteTemplate"
            outlined
            color="secondary"
            rounded
            class="mt-2"
          >
            <v-card elevation="0">
              <v-card-text class="d-flex">
                <v-icon left color="secondary"> mdi-alert-circle </v-icon>
                ¿Está seguro de eliminar la plantilla?
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                  color="primary"
                  text
                  @click="deleteTemplate = !deleteTemplate"
                  >cancelar</v-btn
                >
                <v-btn outlined color="primary" @click="clearTemplate()">
                  SÍ, ELIMINAR
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-sheet>
        </div>
      </div>
    </v-form>
    <v-file-input
      v-show="false"
      id="inputUpload"
      ref="inputUpload"
      v-model="fileToUpload"
      @change="onChangeFileInput"
    />
    <edit-header-value-dialog
      v-model="activeEditHeader"
      title="Editar valor header"
      :select-item-hearders="selectItemHearders"
      :list-data-base="selectedActivity.config.dataBase"
      @btn-header-action="btnHeaderChanges"
    />
    <edit-header-value-dialog
      v-model="activeEditParams"
      title="Editar valor de parámetro"
      :select-item-hearders="selectItemHearders"
      :list-data-base="selectedActivity.config.dataBase"
      @btn-header-action="btnParamsChanges"
    />
    <edit-header-value-dialog
      v-model="activeEditBodys"
      title="Editar valor de body"
      :select-item-hearders="selectItemHearders"
      :list-data-base="selectedActivity.config.dataBase"
      @btn-header-action="btnBodysChanges"
    />
    <draggable-component
      v-if="stageContainerTMP"
      v-model="showNewTemplate"
      :client-id="clientId"
      :template-id="templateId"
      :stage-container="stageContainerTMP"
      @new-template="registerNewTemplate"
    />
    <v-dialog v-model="previewDialog" scrollable :width="widthDialog">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 d-flex">
          Previsualización
          <v-btn icon color="primary" @click="previsualizacion('cell')">
            <v-icon>mdi-cellphone</v-icon>
          </v-btn>
          <v-btn icon color="primary" @click="previsualizacion('pc')">
            <v-icon>mdi-laptop</v-icon>
          </v-btn>
        </v-card-title>
        <div style="width: 100%" v-html="viewDialog.localContent"></div>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="previewDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import filesMixin from '@/mixins/util/filesMixin'
import Tooltip from '@/components/util/Tooltip.vue'
import automationBffMixin from '@/mixins/services/automationBffMixin'
import EditHeaderValueDialog from '@/components/modules/automation/EditHeaderValueDialog.vue'
import TableHeadersParameter from '@/components/modules/automation/TableHeadersParameter.vue'
import DraggableComponent from '@/components/modules/draggable/DraggableComponent.vue'
import HoverCardImageTemplate from '@/components/modules/automation/HoverCardImageTemplate.vue'

export default {
  name: 'SendEmailConfiguration',
  components: {
    Tooltip,
    EditHeaderValueDialog,
    TableHeadersParameter,
    DraggableComponent,
    HoverCardImageTemplate,
  },
  mixins: [validationMixin, automationBffMixin, filesMixin],
  props: {
    selectedActivity: {
      type: Object,
      default: () => ({}),
    },
    clientId: {
      type: String,
      default: '',
    },
    processId: {
      type: String,
      default: '',
    },
    atomationId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      valid: false,
      showNewTemplate: false,
      deleteTemplate: false,
      chooseTemplate: false,
      listTemplate: null,
      activateHeaders: false,
      activateParameters: false,
      activateBodys: false,
      activeEditHeader: false,
      activeEditParams: false,
      activeEditBodys: false,
      selectItemHearders: {},
      listFilter: [],
      listConnectionType: ['SMTP', 'API REST'],
      listConnectionByType: [],
      listSender: [],
      listHeaders: [],
      listParameters: [],
      listBodys: [],
      fileToUpload: null,
      viewDialog: {},
      previewDialog: false,
      widthDialog: 1200,
      templateId: '-1',
      stageContainerTMP: null,
      stageContainerNew: {
        style: {
          width: '600',
          backgroundColor: '#E7E7E7',
        },
        rowContainer: [
          {
            id: 0,
            style: {
              backgroundColor: '#E7E7E7',
              backgroundImage: 'none',
              backgroundPosition: 'left top',
              backgroundRepeat: 'no-repeat',
              color: 'rgb(0, 0, 0)',
              width: '600px',
              maxWidth: '600px',
              margin: 'auto',
              display: 'flex',
              flexDirection: 'row',
              borderTopStyle: 'solid',
              borderTopWidth: '0',
              borderTopColor: '#E7E7E7',
              borderLeftStyle: 'solid',
              borderLeftWidth: '0',
              borderLeftColor: '#E7E7E7',
              borderRightStyle: 'solid',
              borderRightWidth: '0',
              borderRightColor: '#E7E7E7',
              borderBottomStyle: 'solid',
              borderBottomWidth: '0',
              borderBottomColor: '#E7E7E7',
            },
            active: false,
            over: false,
            stageColumns: [
              {
                id: 1,
                col: '12',
                presentation: true,
                activeColumn: false,
                over: false,
                style: {
                  width: '100%',
                  backgroundColor: '#E7E7E7',
                  paddingTop: '0px',
                  paddingRight: '0px',
                  paddingBottom: '0px',
                  paddingLeft: '0px',
                  borderTopStyle: 'solid',
                  borderTopWidth: '0',
                  borderTopColor: '#E7E7E7',
                  borderLeftStyle: 'solid',
                  borderLeftWidth: '0',
                  borderLeftColor: '#E7E7E7',
                  borderRightStyle: 'solid',
                  borderRightWidth: '0',
                  borderRightColor: '#E7E7E7',
                  borderBottomStyle: 'solid',
                  borderBottomWidth: '0',
                  borderBottomColor: '#E7E7E7',
                },
                content: [],
              },
            ],
          },
        ],
      },
    }
  },
  computed: {
    fieldRules() {
      return [(v) => this.isRequired(v, 'Campo')]
    },
    textRules() {
      return [(v) => this.isRequired(v, '')]
    },
    emailRules() {
      return [
        (v) => this.isRequired(v, 'Email responder a'),
        (v) => this.isValidEmail(v),
      ]
    },
  },
  created() {
    this.createListFilter()
  },
  methods: {
    createNewTemplate() {
      this.stageContainerTMP = JSON.parse(
        JSON.stringify(this.stageContainerNew)
      )
      this.templateId = '-1'
      this.showNewTemplate = !this.showNewTemplate
    },
    async createListFilter() {
      const listF =
        await this.getListOfFiltersByClientIdProcessIdAndAtomationId(
          this.clientId,
          this.processId,
          this.atomationId
        )
      this.listFilter = listF.listFilter
      this.changeListConnection()
      const listS = await this.getListSenderByClientIdProcessIdAndAtomationId(
        this.clientId,
        this.processId,
        this.atomationId
      )
      this.listSender = listS.listFilter
      this.searchlistTemplate()
    },
    async searchlistTemplate() {
      this.listTemplate =
        await this.getProcessesInEmailListOfHtmlTemplatesByClientId(
          this.clientId
        )
    },
    async changeListConnection() {
      const listItems = await this.getAllTypesConnectorsByClientId(
        this.clientId,
        this.selectedActivity.config.connection.type
      )
      this.listConnectionByType = []
      listItems.data.forEach((element) => {
        const itemNew = {
          id: element.id,
          name: element.name,
        }
        this.listConnectionByType.push(itemNew)
      })
      this.$emit('change-element')
    },
    async selectActivateParameters() {
      const itemList = await this.getConnectorById(
        this.selectedActivity.config.connection.connection.id
      )
      this.listParameters = itemList.params
      this.activateParameters = !this.activateParameters
    },
    async selectActivateBodys() {
      const itemList = await this.getConnectorById(
        this.selectedActivity.config.connection.connection.id
      )
      this.listBodys = itemList.body
      this.activateBodys = !this.activateBodys
    },
    async selectActivateHeaders() {
      const itemList = await this.getConnectorById(
        this.selectedActivity.config.connection.connection.id
      )
      this.listHeaders = itemList.headers
      this.activateHeaders = !this.activateHeaders
    },
    addVariableAddressee(item) {
      const newItem = `{{${item}}}`
      this.selectedActivity.config.addressee += newItem
      this.$emit('change-element')
    },
    addVariableAnswerTo(item) {
      const newItem = `{{${item}}}`
      this.selectedActivity.config.answerTo += newItem
      this.$emit('change-element')
    },
    changeAttachDynamic() {
      this.$emit('change-element')
    },
    async onChangeFileInput() {
      const file = this.fileToUpload
      if (file !== null) {
        let base64 = ''
        await this.fileToBase64(file).then((result) => {
          base64 = result
        })
        const itemNew = {
          fileName: file.name,
          fileExtension: await this.getFileExtension(file),
          fileToBase64: base64,
          size: file.size,
        }
        this.selectedActivity.config.attach.staticList.push(itemNew)
        await this.changeListStaticAttachment()
        this.$emit('change-element')
      }
      this.fileToUpload = null
    },
    openFile() {
      document.getElementById('inputUpload').click()
    },
    deleteItemAttach(item) {
      const index = this.selectedActivity.config.attach.staticList.findIndex(
        (t) => t === item
      )
      this.selectedActivity.config.attach.staticList.splice(index, 1)
      this.changeListStaticAttachment()
      this.$emit('change-element')
    },
    async changeListStaticAttachment() {
      const items = {
        clientId: this.clientId,
        processId: this.processId,
        atomationId: this.atomationId,
        activityId: this.selectedActivity.id,
        staticList: this.selectedActivity.config.attach.staticList,
      }
      const result =
        await this.modifyListOfStaticFilesInSendEmailsByClientIdProcessIdAtomationIdAndActivityId(
          items
        )
      if (!result) {
        // TODO: falta crear si supera kb
        console.log('no paso, supero kb')
      }
    },
    editParameters(itemParams) {
      this.selectItemHearders = JSON.parse(JSON.stringify(itemParams))
      this.activeEditParams = true
    },
    editHearders(itemHeader) {
      this.selectItemHearders = JSON.parse(JSON.stringify(itemHeader))
      this.activeEditHeader = true
    },
    editBodys(itemBody) {
      this.selectItemHearders = JSON.parse(JSON.stringify(itemBody))
      this.activeEditBodys = true
    },
    btnHeaderChanges(itemHeader) {
      const index = this.listHeaders.findIndex((t) => t.id === itemHeader.id)
      this.listHeaders[index].value = itemHeader.value
      this.activeEditHeader = false
      this.$emit('change-element')
    },
    btnParamsChanges(itemParams) {
      const index = this.listParameters.findIndex((t) => t.id === itemParams.id)
      this.listParameters[index].value = itemParams.value
      this.activeEditParams = false
      this.$emit('change-element')
    },
    btnBodysChanges(itemBody) {
      const index = this.listBodys.findIndex((t) => t.id === itemBody.id)
      this.listBodys[index].value = itemBody.value
      this.activeEditBodys = false
      this.$emit('change-element')
    },
    registerNewTemplate(newTemplate) {
      this.selectedActivity.config.template.generateTemplate = true
      this.selectedActivity.config.template.imageContent =
        newTemplate.imageContent
      this.selectedActivity.config.template.imageExtension =
        newTemplate.imageExtension
      this.selectedActivity.config.template.templateId = newTemplate.templateId
      this.selectedActivity.config.template.localContent =
        newTemplate.localContent
      this.selectedActivity.config.template.stageContainer =
        newTemplate.stageContainer
      this.showNewTemplate = false
    },
    openView(item) {
      this.viewDialog = item
      this.previewDialog = true
    },
    previsualizacion(type) {
      if (type === 'pc') {
        this.widthDialog = 1200
      } else {
        this.widthDialog = 390
      }
    },
    editTemplate() {
      this.stageContainerTMP = JSON.parse(
        JSON.stringify(this.selectedActivity.config.template.stageContainer)
      )
      this.templateId = this.selectedActivity.config.template.templateId
      this.showNewTemplate = !this.showNewTemplate
    },
    clearTemplate() {
      this.selectedActivity.config.template.generateTemplate = false
      this.selectedActivity.config.template.imageContent = ''
      this.selectedActivity.config.template.imageExtension = ''
      this.selectedActivity.config.template.templateId = -1
      this.selectedActivity.config.template.localContent = ''
      this.selectedActivity.config.template.stageContainer = {}
      this.$emit('change-element')
    },
  },
}
</script>
