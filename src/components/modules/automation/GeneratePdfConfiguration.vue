<!-- eslint-disable prefer-destructuring -->
<template>
  <div>
    <v-tabs color="primary">
      <v-tab class="caption">
        <v-badge
          v-if="
            selectedActivity.config.pdfName !== '' &&
            selectedActivity.config.listParameters.charged
          "
          bordered
          color="success"
          icon="mdi-check"
          overlap
        >
          <v-icon size="30" class="mt-1"> mdi-numeric-1-circle </v-icon>
        </v-badge>
        <v-icon v-else size="30" class="mt-1"> mdi-numeric-1-circle </v-icon>
        <div class="ml-2">GENERACION PDF</div>
      </v-tab>
      <v-tab
        :disabled="
          selectedActivity.config.pdfName === '' ||
          !selectedActivity.config.listParameters.charged
        "
        class="caption px-1"
      >
        <v-badge
          v-if="createdParameters"
          bordered
          color="success"
          icon="mdi-check"
          overlap
        >
          <v-icon size="30" class="mt-1"> mdi-numeric-2-circle </v-icon>
        </v-badge>
        <v-icon v-if="!createdParameters" size="30" class="mt-1">
          mdi-numeric-2-circle
        </v-icon>
        <div class="ml-2">CONFIGURACIÓN DE DATOS</div>
      </v-tab>
      <v-tab-item>
        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="ma-6 font-weight-bold accent--text">Cargar archivo</div>
          <div class="px-6">
            <div class="d-flex align-start">
              <v-select
                v-model="selectedActivity.config.type"
                dense
                :items="typeList"
                :rules="fieldRules"
                label="Tipo"
                placeholder="Seleccione tipo"
                outlined
                @change="changeType()"
              />
              <tooltip message="Tipo de archivo a generar." />
            </div>
          </div>
          <div class="ml-6 mt-0 font-weight-bold accent--text">General</div>
          <div class="pl-6 pr-9">
            <div class="text-right">
              <v-btn text color="primary" @click="addVariableName()">
                AGREGAR VARIABLE
                <v-icon right color="primary"> mdi-plus-circle-outline </v-icon>
              </v-btn>
            </div>
          </div>
          <div class="px-6 mb-4">
            <div class="d-flex align-start">
              <v-text-field
                v-model="selectedActivity.config.pdfName"
                label="Nombre PDF"
                :rules="textRules"
                outlined
                dense
                class="ml-1"
                @change="$emit('change-element')"
              />
              <tooltip
                message="Nombre que se designará a<br>archivos generados. Puede<br>ser fijo o contener variables."
              />
            </div>
            <div class="d-flex align-start mb-1">
              <v-checkbox
                v-model="selectedActivity.config.password.generate"
                label="Generar contraseña"
                hide-details
                class="mr-1 mt-0"
                @change="$emit('change-element')"
              />
              <tooltip
                message="Generación de contraseña<br>para cuando los usuarios<br>realicen apertura de<br>archivos."
              />
            </div>
            <div v-if="selectedActivity.config.password.generate" class="mb-2">
              <v-card outlined>
                <v-card-text>
                  <v-select
                    v-model="selectedActivity.config.password.type"
                    dense
                    :items="passwordTypeList"
                    label="Tipo"
                    :rules="fieldRules"
                    placeholder="Seleccione tipo"
                    outlined
                    @change="$emit('change-element')"
                  />
                  <div v-if="selectedActivity.config.password.type === 'RUT'">
                    <v-select
                      v-model="
                        selectedActivity.config.password.databaseColumnName
                      "
                      dense
                      :items="selectedActivity.config.dataBase"
                      item-text="name"
                      item-value="name"
                      label="Columna RUT contraseña"
                      :rules="fieldRules"
                      placeholder="Selecciona columna"
                      outlined
                      @change="$emit('change-element')"
                    />
                    <v-select
                      v-model="selectedActivity.config.password.format"
                      dense
                      :items="passwordFormatList"
                      label="Formato"
                      :rules="fieldRules"
                      placeholder="Selecciona formato"
                      outlined
                      @change="$emit('change-element')"
                    />
                  </div>
                  <div
                    v-if="
                      selectedActivity.config.password.type === 'Personalizado'
                    "
                  >
                    <div class="d-flex justify-end">
                      <v-btn
                        text
                        color="primary"
                        class="pr-0"
                        @click="addPasswordVariable()"
                      >
                        agregar VARIABLE
                        <v-icon right> mdi-plus-circle-outline </v-icon>
                      </v-btn>
                    </div>
                    <v-text-field
                      v-model="selectedActivity.config.password.structure"
                      label="Estructura contraseña"
                      :rules="textRules"
                      outlined
                      dense
                      @change="$emit('change-element')"
                    />
                    <v-select
                      v-model="selectedActivity.config.password.operation"
                      dense
                      :items="passwordOperationList"
                      label="Rango"
                      placeholder="Seleccione operación"
                      outlined
                      @change="$emit('change-element')"
                    />
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model="selectedActivity.config.password.from"
                          label="Desde"
                          placeholder="Ingresar"
                          type="number"
                          :rules="textRules"
                          outlined
                          dense
                          :disabled="
                            selectedActivity.config.password.operation !== 'cut'
                          "
                          @change="$emit('change-element')"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="selectedActivity.config.password.to"
                          label="Hasta"
                          placeholder="Ingresar"
                          type="number"
                          :rules="textRules"
                          outlined
                          dense
                          :disabled="
                            selectedActivity.config.password.operation !== 'cut'
                          "
                          @change="$emit('change-element')"
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </div>
            <div class="d-flex align-start mb-1">
              <v-checkbox
                v-model="selectedActivity.config.compressZip"
                label="Comprimir zip"
                hide-details
                class="mr-1 mt-0"
                @change="$emit('change-element')"
              />
              <tooltip message="Comprimir archivos en<br>formato zip." />
            </div>
          </div>
          <div class="ml-6 mt-6 font-weight-bold accent--text">Archivos</div>
          <div class="px-6 mb-1">
            <div class="d-flex align-start mb-3 mt-1">
              Generación por lote
              <tooltip
                message="Cantidad de archivos<br>máximos generados por<br>lote."
              />
            </div>
            <v-select
              v-model="selectedActivity.config.maxBatch"
              dense
              :items="fieldRulesList"
              :rules="fieldRules"
              label="Lote máximo"
              placeholder="Seleccione lote máximo"
              outlined
              @change="$emit('change-element')"
            />
          </div>
          <div v-if="selectedActivity.config.type === 'HTML'">
            <div class="ml-6 font-weight-bold accent--text d-flex align-start">
              Creación plantilla PDF
              <tooltip
                message="Creación de plantilla que<br>será utilizada para<br>generación de archivos."
              />
            </div>
            <div v-if="selectedActivity.config.template.localContent === ''">
              <div class="px-6 mb-1">
                <v-btn
                  class="mt-4"
                  outlined
                  block
                  x-large
                  color="primary"
                  @click="showNewTemplate = !showNewTemplate"
                >
                  <v-icon left> mdi-plus-circle-outline </v-icon>
                  CREAR NUEVA PLANTILLA
                </v-btn>
              </div>
              <div class="px-6 mb-1">
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
                  ELEGIR PLANTILLA
                </v-btn>
                <v-card
                  v-else
                  outlined
                  max-height="240"
                  class="overflow-y-auto"
                >
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
                        @open-dialog="selectTemplate"
                        @open-view="openView"
                      />
                    </v-sheet>
                  </v-card-text>
                </v-card>
              </div>
            </div>
            <v-sheet v-else outlined color="primary" rounded class="mx-6 mt-6">
              <hover-card-image-template
                :item-template="selectedActivity.config.template"
                label-btn="editar plantilla"
                @open-dialog="showNewTemplate = !showNewTemplate"
                @open-view="openView"
              />
            </v-sheet>
            <div class="mx-6">
              <v-btn
                v-if="
                  !deleteTemplate &&
                  selectedActivity.config.template.localContent !== ''
                "
                text
                color="primary"
                class="pl-0"
                @click="deleteTemplate = !deleteTemplate"
              >
                eliminar plantilla
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
                    ¿Está seguro de eliminar PDF?
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
          <div v-if="selectedActivity.config.type === 'JASPER'">
            <div class="mx-6">
              <div class="d-flex">
                Carga de template JASPER
                <tooltip
                  message="Carga de archivos Jasper,<br>imágenes u otros archivos<br>para crear template en directorio."
                />
              </div>
              <div class="caption">
                Carga archivos de template en directorio
              </div>
              <v-btn
                v-if="!createDirectory"
                class="mt-2 justify-start"
                text
                block
                small
                color="primary"
                style="margin-left: -10px"
                @click="createDirectory = !createDirectory"
              >
                <v-icon left> mdi-folder-plus </v-icon>
                cargar archivos
              </v-btn>
              <div v-if="createDirectory">
                <v-card outlined class="mt-4">
                  <v-btn
                    color="accent"
                    text
                    @click="jasperDirectory = !jasperDirectory"
                  >
                    <v-icon left>
                      {{
                        jasperDirectory ? 'mdi-chevron-up' : 'mdi-chevron-down'
                      }}
                    </v-icon>
                    <v-icon left> mdi-folder </v-icon>
                    /
                  </v-btn>
                  <div v-if="jasperDirectory">
                    <v-card-text class="pt-0">
                      <div
                        v-for="itemName in directory.fileJasper"
                        :key="itemName.id"
                      >
                        <div
                          class="d-flex justify-space-between align-center accent--text"
                        >
                          <div class="ml-5" style="font-size: 0.875rem">
                            {{ itemName.name }}
                          </div>
                          <div class="caption">
                            <v-btn icon @click="deleteItemJasper(itemName)">
                              <v-icon color="primary"> mdi-delete </v-icon>
                            </v-btn>
                          </div>
                        </div>
                        <delete-folder-or-file
                          v-if="
                            activeDeleteJasper && itemJasperDelete === itemName
                          "
                          title="¿Estás seguro de eliminar archivo?"
                          element-to-delete="SÍ, ELIMINAR"
                          :file-item="itemName"
                          @delete-definitive-file="deleteDefiniyiveJasper"
                          @cancel-action="
                            activeDeleteJasper = !activeDeleteJasper
                          "
                        />
                      </div>
                      <v-btn
                        text
                        color="primary"
                        class="ml-1"
                        @click="loadJasper()"
                      >
                        <v-icon left> mdi-arrow-expand-up </v-icon>
                        cargar jasper
                      </v-btn>
                    </v-card-text>
                    <div class="d-flex justify-end">
                      <v-btn color="primary" text @click="createFolder()">
                        <v-icon left>mdi-plus-circle-outline</v-icon>
                        crear carpeta
                      </v-btn>
                    </div>
                    <v-card
                      v-if="directory.folders.length !== 0"
                      outlined
                      class="ml-6 mr-2 mb-2"
                    >
                      <div
                        v-for="(itemFolder, index) in directory.folders"
                        :key="index"
                      >
                        <list-folder-jasper
                          :item-folder="itemFolder"
                          @file-upload="fileUpload"
                          @delete-element-folder="deleteElementFolder"
                        />
                      </div>
                    </v-card>
                  </div>
                </v-card>
                <v-btn
                  v-if="!activeDeleteDirectory"
                  color="primary"
                  text
                  small
                  class="pl-0"
                  @click="activeDeleteDirectory = !activeDeleteDirectory"
                >
                  eliminar directorio
                </v-btn>
                <delete-folder-or-file
                  v-if="activeDeleteDirectory"
                  title="¿Está seguro de eliminar directorio?"
                  element-to-delete="SÍ, ELIMINAR"
                  :file-item="{}"
                  @delete-definitive-file="deleteDirectory()"
                  @cancel-action="
                    activeDeleteDirectory = !activeDeleteDirectory
                  "
                />
              </div>
            </div>
          </div>
          <div>
            <div
              v-if="selectedActivity.config.type === 'HTML'"
              class="px-6 mb-1"
            >
              <div
                class="mt-4 font-weight-bold accent--text d-flex"
                :class="!activateFileParameters ? 'darkgray--text' : ''"
              >
                Parámetros del archivo
                <tooltip
                  :active-color="activateFileParameters"
                  message="Parámetros o variables que<br>contiene la plantilla HTML<br>creada."
                />
              </div>
              <div class="caption mt-1">
                Verifica y carga parámetros de plantilla creada
              </div>
              <v-btn
                class="mt-4"
                style="height: 78px"
                outlined
                block
                x-large
                color="primary"
                :disabled="!activateFileParameters"
                @click="activeChooseParameters('HTML')"
              >
                <div class="d-flex flex-column py-2">
                  <div class="d-flex">
                    <v-icon left> mdi-view-list </v-icon>
                    VER PARÁMETROS
                  </div>
                  <div class="caption">{{ nameParameters }}</div>
                  <div v-if="isLoadedParameters">
                    <v-chip
                      color="greencheck"
                      text-color="white"
                      small
                      class="mt-1"
                    >
                      Cargados
                    </v-chip>
                  </div>
                </div>
              </v-btn>
            </div>
            <div
              v-if="selectedActivity.config.type === 'JASPER'"
              class="px-6 mb-1"
            >
              <div
                class="mt-4 font-weight-bold accent--text d-flex"
                :class="
                  directory.fileJasper.length === 0 ? 'darkgray--text' : ''
                "
              >
                Parámetros del archivo
                <v-tooltip left color="accent">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="pl-2"
                      v-bind="attrs"
                      :color="
                        directory.fileJasper.length !== 0 ? 'primary' : ''
                      "
                      v-on="on"
                    >
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  <div>
                    <div class="py-1 white--text font-weight-bold accent--text">
                      <div>Parámetros o variables que</div>
                      <div>contiene el archivo jasper</div>
                      <div>cargado en directorio.</div>
                    </div>
                  </div>
                </v-tooltip>
              </div>
              <v-btn
                v-if="directory.fileJasper.length === 0"
                class="mt-4"
                style="height: 78px"
                outlined
                block
                x-large
                color="primary"
                disabled
              >
                <v-icon left> mdi-view-list </v-icon>
                VER PARÁMETROS
              </v-btn>
              <v-btn
                v-for="itemName in directory.fileJasper"
                :key="itemName.id"
                class="mt-4"
                style="height: 78px"
                outlined
                block
                x-large
                color="primary"
                @click="activeChooseParameters(itemName.name)"
              >
                <div class="d-flex flex-column py-2">
                  <div class="d-flex">
                    <v-icon left> mdi-view-list </v-icon>
                    VER PARÁMETROS
                  </div>
                  <div class="caption">{{ itemName.name }}</div>
                  <div
                    v-if="
                      selectedActivity.config.listParameters.name ===
                        itemName.name &&
                      selectedActivity.config.listParameters.charged
                    "
                  >
                    <v-chip
                      color="greencheck"
                      text-color="white"
                      small
                      class="mt-1"
                    >
                      Cargados
                    </v-chip>
                  </div>
                </div>
              </v-btn>
            </div>
          </div>
        </v-form>
      </v-tab-item>
      <v-tab-item>
        <data-configuration
          :selected-activity="selectedActivity"
          :client-id="clientId"
          :process-id="processId"
          :atomation-id="atomationId"
          :list-variables-template="listVariablesTemplate"
          @change-element="$emit('change-element')"
        />
      </v-tab-item>
    </v-tabs>
    <generate-parameters
      v-if="selectedActivity.config.listParameters"
      v-model="viewParameters"
      :client-id="clientId"
      :process-id="processId"
      :atomation-id="atomationId"
      :list-parameters="selectedActivity.config.listParameters"
      @is-loaded="activeIsLoader()"
    />
    <create-new-template
      v-if="showNewTemplate"
      v-model="showNewTemplate"
      :client-id="clientId"
      :selected-activity="selectedActivity"
      @save-template="saveTemplate()"
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
        <v-card-text style="height: 500px">
          <span v-html="viewDialog.localContent"></span>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="previewDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-file-input
      v-show="false"
      id="inputUpload"
      ref="inputUpload"
      v-model="fileToUpload"
      :accept="fileExtension"
      @change="onChangeFileInput"
    />
  </div>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import CreateNewTemplate from '@/components/modules/automation/CreateNewTemplate.vue'
import automationBffMixin from '@/mixins/services/automationBffMixin'
import ListFolderJasper from '@/components/modules/automation/ListFolderJasper.vue'
import html2canvas from 'html2canvas'
import filesMixin from '@/mixins/util/filesMixin'
import HoverCardImageTemplate from '@/components/modules/automation/HoverCardImageTemplate.vue'
import GenerateParameters from '@/components/modules/automation/GenerateParameters.vue'
import DeleteFolderOrFile from '@/components/modules/automation/DeleteFolderOrFile.vue'
import Tooltip from '@/components/util/Tooltip.vue'
import DataConfiguration from '@/components/modules/automation/DataConfiguration.vue'

export default {
  name: 'GeneratePdfConfiguration',
  components: {
    CreateNewTemplate,
    ListFolderJasper,
    HoverCardImageTemplate,
    GenerateParameters,
    DeleteFolderOrFile,
    Tooltip,
    DataConfiguration,
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
    directory: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      valid: false,
      createdParameters: false,
      typeList: ['HTML', 'JASPER'],
      passwordOperationList: [
        { text: 'Ninguno', value: '' },
        { text: 'Recortar', value: 'cut' },
      ],
      passwordTypeList: ['RUT', 'Personalizado'],
      passwordFormatList: [
        'Primeros 4 dígitos',
        'Últimos 4 dígitos antes del código verificador ',
        'RUT completo con código verificador',
        'RUT completo sin código verificador',
        'Otro',
      ],
      viewDialog: {},
      activeDeleteJasper: false,
      itemJasperDelete: null,
      passwordVariable: 0,
      variableAux: false,
      createNewTemplate: false,
      chooseTemplate: false,
      templateImage: null,
      previewDialog: false,
      deleteTemplate: false,
      activateFileParameters: false,
      widthDialog: 1200,
      listTemplate: null,
      createDirectory: false,
      jasperDirectory: true,
      fileExtension: '',
      fileToUpload: null,
      changeFileInput: null,
      createItemFolder: null,
      activeDeleteDirectory: false,
      base64image: '',
      nameParameters: '',
      chooseParameters: false,
      viewParameters: false,
      isLoadedParameters: false,
      isLoadedJasperParameters: [],
      jasperName: '',
      idFile: 0,
      contadorFile: 100,
      fieldRulesList: [
        '100',
        '200',
        '500',
        '1000',
        '2000',
        '5000',
        '10000',
        '20000',
        '30000',
        '40000',
        '50000',
        '60000',
        '70000',
        '80000',
        '90000',
        '100000',
      ],
      showNewTemplate: false,
      listVariablesTemplate: [],
    }
  },
  computed: {
    fieldRules() {
      return [(v) => this.isRequired(v, 'Campo')]
    },
    textRules() {
      return [(v) => this.isRequired(v, '')]
    },
  },
  watch: {
    'selectedActivity.config.type': {
      handler(value) {
        this.isLoadedParameters = false
        if (value === 'HTML') {
          if (this.selectedActivity.config.template.localContent === '') {
            this.nameParameters = ''
            this.activateFileParameters = false
          } else {
            this.nameParameters = 'plantilla.html'
            this.activateFileParameters = true
          }
        }
      },
    },
    'selectedActivity.config.template.localContent': {
      handler(value) {
        if (this.selectedActivity.config.type === 'HTML') {
          if (value === '') {
            this.nameParameters = ''
            this.activateFileParameters = false
          } else {
            this.nameParameters = 'plantilla.html'
            this.activateFileParameters = true
          }
        } else {
          this.nameParameters = ''
          this.activateFileParameters = false
        }
      },
    },
    'selectedActivity.config.listParameters.charged': {
      handler(value) {
        if (value) {
          this.createVariablesTemplate()
        }
      },
    },
  },
  created() {
    this.searchlistTemplate()
  },
  methods: {
    async searchlistTemplate() {
      this.listTemplate =
        await this.getTemplatePdfListAutomationProcessesByClientId(
          this.clientId
        )
    },
    previsualizacion(type) {
      if (type === 'pc') {
        this.widthDialog = 1200
      } else {
        this.widthDialog = 390
      }
    },
    async clearTemplate() {
      this.selectedActivity.config.template.localContent = ''
      this.selectedActivity.config.template.name = ''
      this.selectedActivity.config.template.description = ''
      this.selectedActivity.config.template.id = '-1'
      this.deleteTemplate = false
      this.$emit('change-element')
      this.chooseTemplate = false
    },
    openView(item) {
      this.viewDialog = item
      this.previewDialog = true
    },
    selectTemplate(item) {
      this.selectedActivity.config.template.localContent = item.localContent
      this.selectedActivity.config.template.name = item.templateName
      this.selectedActivity.config.template.description =
        item.templateDescription
      this.selectedActivity.config.template.id = item.templateId
      this.selectedActivity.config.template.imageContent = item.imageContent
      this.selectedActivity.config.template.imageExtension = item.imageExtension
      this.$emit('change-element')
    },
    addPasswordVariable() {
      this.passwordVariable += 1
      this.selectedActivity.config.password.structure += `{{${this.passwordVariable}}}`
    },
    createFolder() {
      this.variableAux = true
      const newItem = {
        id: '-1',
        name: '',
        url: '',
        active: false,
        fileList: [],
      }
      this.directory.folders.push(newItem)
    },
    async loadJasper() {
      this.fileExtension = await '.jasper'
      this.changeFileInput = await 'jasper'
      document.getElementById('inputUpload').click()
    },
    async fileUpload(item) {
      this.fileExtension = await ''
      this.changeFileInput = await 'folder'
      this.createItemFolder = item
      document.getElementById('inputUpload').click()
    },
    deleteElementFolder(item) {
      const index = this.directory.folders.indexOf(item)
      this.directory.folders.splice(index, 1)
    },
    deleteDirectory() {
      this.directory.fileJasper = []
      this.directory.folders = []
      this.activeDeleteDirectory = false
      this.$emit('change-element')
    },
    deleteItemJasper(itemJasper) {
      this.itemJasperDelete = itemJasper
      this.activeDeleteJasper = true
    },
    deleteDefiniyiveJasper(itemJasper) {
      const index = this.directory.fileJasper.findIndex(
        (t) => t.name === itemJasper.name
      )
      this.deleteJasper(itemJasper)
      this.directory.fileJasper.splice(index, 1)
      this.activeDeleteJasper = false
    },
    async deleteJasper(itemJasper) {
      const deleteItem = {
        clientId: this.clientId,
        processId: this.processId,
        atomationId: this.atomationId,
        activityId: this.selectedActivity.id,
        config: itemJasper,
      }
      await this.jasperSettingDelete(deleteItem)
    },
    async changeJasper(itemJasper) {
      const changeItem = {
        clientId: this.clientId,
        processId: this.processId,
        atomationId: this.atomationId,
        activityId: this.selectedActivity.id,
        config: itemJasper,
      }
      const result = await this.jasperSettingChanges(changeItem)
      return result
    },
    async onChangeFileInput() {
      if (this.changeFileInput !== 'folder') {
        let fBase64 = ''
        await this.fileToBase64(this.fileToUpload).then((result) => {
          fBase64 = result
        })
        const newItem = {
          id: '-1',
          name: this.fileToUpload.name,
          fileBase64: fBase64,
          fileExtension: await this.getFileExtension(this.fileToUpload),
        }
        const idnew = await this.changeJasper(newItem)
        if (idnew === this.idFile) {
          this.contadorFile += 1
          newItem.id = this.contadorFile
        } else {
          this.idFile = idnew
          newItem.id = idnew
        }
        this.directory.fileJasper.push(newItem)
      } else {
        let base64 = null
        await this.fileToBase64(this.fileToUpload).then((result) => {
          base64 = result
        })
        const newItem = {
          name: this.fileToUpload.name,
          fileBase64: base64,
          fileExtension: await this.getFileExtension(this.fileToUpload),
        }
        this.createItemFolder.fileList.push(newItem)
      }
      this.fileToUpload = null
    },
    changeType() {
      if (this.selectedActivity.config.type === 'HTML') {
        if (Object.keys(this.selectedActivity.config.template).length === 0) {
          const newItem = {
            generateTemplate: false,
            localContent: '',
            name: '',
            description: '',
            id: '-1',
          }
          this.selectedActivity.config.template = newItem
        }
      }
      this.createdParameters = false
      this.$emit('change-element')
    },
    async saveTemplate() {
      if (this.selectedActivity.config.template.generateTemplate) {
        await this.saveNewTemplate()
      }
      await this.makeImageContent()
      this.showNewTemplate = false
      this.$emit('change-element')
    },
    async saveNewTemplate() {
      const newItem = {
        clientId: this.clientId,
        templateName: this.selectedActivity.config.template.name,
        templateDescription: this.selectedActivity.config.template.description,
        templateId: this.templateId,
        localContent: this.selectedActivity.config.template.localContent,
      }
      const returId = await this.createOrEditTemplatePdf(newItem)
      if (returId) {
        this.selectedActivity.config.template.id = returId
      }
    },
    makeImageContent() {
      const screenDiv = document.createElement('div')
      screenDiv.style.width = '8.5in'
      screenDiv.id = 'temporal'
      screenDiv.innerHTML = this.selectedActivity.config.template.localContent
      document.body.appendChild(screenDiv)
      const screenTMP = document.getElementById('temporal')
      html2canvas(screenTMP).then((canvas) => {
        this.unloadImage(canvas.toDataURL('image/png'))
      })
      document.body.removeChild(screenTMP)
      this.selectedActivity.config.template.imageContent = this.base64image
    },
    unloadImage(screenTMP) {
      this.base64image = screenTMP
      // eslint-disable-next-line prefer-destructuring
      this.selectedActivity.config.template.imageContent =
        screenTMP.split(',')[1]
      this.selectedActivity.config.template.imageExtension = 'png'
    },
    async activeChooseParameters(item) {
      await this.$emit('save-automations')
      if (this.selectedActivity.config.listParameters.name !== item) {
        this.selectedActivity.config.listParameters.name = item
        this.selectedActivity.config.listParameters.charged = false
        const newList =
          await this.getParametersInPdfGenerationByClientIdProcessIdAndAtomationId(
            this.clientId,
            this.processId,
            this.atomationId
          )
        this.selectedActivity.config.listParameters.list = newList.dataList
      }
      this.chooseParameters = !this.chooseParameters
      this.viewParameters = true
    },
    activeIsLoader() {
      this.selectedActivity.config.listParameters.charged = true
      if (this.selectedActivity.config.listParameters.name === 'HTML') {
        this.isLoadedParameters = true
      }
    },
    verifyJasperParameters(element) {
      if (this.selectedActivity.config.listParameters.name === element) {
        return false
      }
      return true
    },
    loadParameters(item) {
      console.log(item)
    },
    addVariableName() {
      this.selectedActivity.config.pdfName += '{{nombre}}'
    },
    async createVariablesTemplate() {
      this.listVariablesTemplate = []
      if (this.selectedActivity.config.type === 'HTML') {
        const template = this.selectedActivity.config.template.localContent
        const listVar = template.split('{{')
        listVar.forEach((item, index) => {
          if (index > 0) {
            this.listVariablesTemplate.push(item.split('}}')[0])
          }
        })
      } else {
        await this.getVariablesTemplateJasper()
      }
      this.createListColumns()
    },
    async getVariablesTemplateJasper() {
      const itemJasper = {
        clientId: this.clientId,
        processId: this.processId,
        atomationId: this.atomationId,
        activityId: this.selectedActivity.id,
        jasperName: this.selectedActivity.config.listParameters.name,
      }
      this.listVariablesTemplate = await this.getListVariablesTemplateBYJasper(
        itemJasper
      )
    },
    createListColumns() {
      const listItems = this.selectedActivity.config.listParameters.list
      listItems.forEach((item) => {
        if (!item.ignoreColumn) {
          const items = {
            variable: item.name,
            column: '',
          }
          this.selectedActivity.config.dataConfiguration.listColumns.push(items)
        }
      })
    },
  },
}
</script>
<style scoped>
.zoom-div {
  transform: scale(0.7);
}
.over-plantilla:hover {
  background-color: var(--v-lightcyan-base);
}
</style>
