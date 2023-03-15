<template>
  <div>
    <v-tabs grow color="primary">
      <v-tab class="caption">LECTURA DATOS</v-tab>
      <v-tab class="caption">
        CONFIGURACION de CARGA
        <tooltip message="Configurar aquí unión de parametros." />
      </v-tab>
      <v-tab-item>
        <div class="ma-6 font-weight-bold accent--text">Cargar archivo</div>
        <div class="mb-2 ml-6">
          Prefijo: {{ selectedActivity.config.prefix }}
        </div>
        <div class="mb-6 ml-6">Extensión: {{ listType() }}</div>
        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="pa-6">
            <div class="mb-4 font-weight-bold accent--text">
              Ajustes de lectura de archivo
            </div>
            <div class="d-flex align-start">
              <v-select
                v-model="selectedActivity.config.coding"
                dense
                :items="codingList"
                :rules="fieldRules"
                label="Codificación"
                placeholder="Seleccione codificación"
                outlined
                @change="$emit('change-element')"
              />
              <tooltip
                message="Tipo de codificación para<br>interpretar carácteres del<br>archivo."
              />
            </div>
            <div class="d-flex align-start">
              <v-select
                v-model="selectedActivity.config.readingMode"
                dense
                :items="readingModeList"
                :rules="fieldRules"
                label="Modo de lectura"
                placeholder="Seleccione modo de lectura"
                outlined
                @change="$emit('change-element')"
              />
              <tooltip
                message="Modo de lectura de datos<br>del archivo. Si los datos irán<br>separados por un carácter o<br>por línea de registro."
              />
            </div>
            <div
              v-if="selectedActivity.config.readingMode === 'Por separador'"
              class="d-flex align-start"
            >
              <v-text-field
                v-model="selectedActivity.config.separators"
                :rules="textRules"
                label="Tipo de separadores"
                placeholder="Coloque separador"
                outlined
                dense
                @change="$emit('change-element')"
              />
              <tooltip
                message="Carácter que hará la<br>separación entre datos.<br>Ej. ; o , u otro."
              />
            </div>
            <div
              class="font-weight-bold accent--text"
              :class="estructuraArchivoDisable ? '' : 'gray300--text'"
            >
              Estructura del archivo
              <tooltip
                message="Estructura de columnas del<br>archivo a cargar."
              />
            </div>
            <v-btn
              v-if="!createStructure"
              class="px-8 mt-4"
              outlined
              x-large
              color="primary"
              :disabled="!estructuraArchivoDisable"
              @click="createStructure = !createStructure"
            >
              <v-icon left> mdi-format-list-bulleted-square </v-icon>
              CREAR ESTRUCTURA
            </v-btn>
          </div>
          <div v-if="createStructure" class="pl-2 mb-6">
            <v-card outlined>
              <v-card-text class="text-right pa-0 mb-2">
                <v-btn
                  text
                  color="primary"
                  @click="$emit('new-file-structure')"
                >
                  <v-icon color="primary"> mdi-plus-circle-outline </v-icon>
                  AGREGAR COLUMNA
                </v-btn>
              </v-card-text>
              <v-card-text>
                <v-row no-gutters>
                  <v-col cols="5">
                    <span class="font-weight-medium">Columna</span>
                  </v-col>
                  <v-col cols="6">
                    <span class="ml-1 font-weight-medium">Tipo </span>
                  </v-col>
                  <v-col cols="1" />
                </v-row>
              </v-card-text>
              <div class="y-overflow">
                <div
                  v-for="(item, i) in selectedActivity.config.listFileStructure"
                  :key="i"
                >
                  <v-divider class="mb-6"></v-divider>
                  <v-row no-gutters>
                    <v-col cols="5">
                      <v-text-field
                        v-model="item.name"
                        label="Nombre"
                        :rules="textRules"
                        outlined
                        dense
                        class="ml-1"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        v-model="item.setting"
                        dense
                        :items="fileStructureList"
                        :rules="fieldRules"
                        label="Configuración"
                        placeholder="Seleccione configuración"
                        outlined
                        class="ml-1"
                        @click="item.format = ''"
                        @change="$emit('change-element')"
                      />
                      <v-select
                        v-if="item.setting === 'date'"
                        v-model="item.format"
                        dense
                        :items="formatList"
                        :rules="fieldRules"
                        label="Formato"
                        placeholder="Seleccione formato"
                        outlined
                        class="ml-1"
                        style="margin-top: -15px"
                        @change="$emit('change-element')"
                      />
                    </v-col>
                    <v-col cols="1" class="text-center">
                      <v-icon
                        color="primary"
                        class="mt-1"
                        @click="$emit('delete-file-structure', item)"
                      >
                        mdi-delete
                      </v-icon>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-card>
            <div v-if="!activateDeleteStructure" class="mt-1">
              <v-btn
                text
                small
                color="primary"
                class="pl-0"
                @click="activateDeleteStructure = !activateDeleteStructure"
              >
                eliminar estructura
              </v-btn>
              <v-btn small outlined color="gray300" @click="dowloadJson()">
                <v-icon left color="gray300"> mdi-download </v-icon>
                DESCARGAR JSON
              </v-btn>
            </div>

            <v-sheet v-else outlined rounded color="secondary" class="mt-2">
              <v-card color="white" flat>
                <v-card-text class="d-flex">
                  <v-icon color="secondary" class="mr-1">
                    mdi-alert-circle
                  </v-icon>
                  ¿Está seguro de eliminar estructura del archivo?
                </v-card-text>
                <v-card-text class="mt-6 d-flex justify-end">
                  <v-btn
                    text
                    color="primary"
                    @click="activateDeleteStructure = !activateDeleteStructure"
                  >
                    CANCELAR
                  </v-btn>
                  <v-btn
                    outlined
                    color="primary"
                    @click="deleteAllFileStructure()"
                  >
                    SÍ, ELIMINAR
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-sheet>
          </div>
        </v-form>
      </v-tab-item>
      <v-tab-item>
        <div class="ma-6 font-weight-bold accent--text">
          Unión de parámetros
        </div>
        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="px-6">
            <div class="d-flex align-start">
              <v-select
                v-model="selectedActivity.config.sourceDatabase"
                dense
                :items="sourceDatabaseList"
                :rules="fieldRules"
                label="Base de datos origen"
                placeholder="Seleccione origen"
                outlined
              />
              <tooltip
                message="Selección de Base de datos<br>creada en Modelo de Datos."
              />
            </div>
            <div class="d-flex align-start">
              <v-select
                v-model="selectedActivity.config.action"
                dense
                :items="actionList"
                :rules="fieldRules"
                label="Acción"
                placeholder="Seleccione acción"
                outlined
              />
              <tooltip
                message="Seleccione opción a utilizar<br>obre base de datos<br>(modelo de datos)"
              />
            </div>
          </div>
          <div class="mx-6 font-weight-bold accent--text d-flex align-start">
            Mapeo de datos
            <tooltip
              message="Mapeo de columnas de<br>BBDD origen (modelo de<br>datos), con estructura de<br>archivo a cargar."
            />
          </div>
          <div class="px-6">
            <v-btn
              v-if="!mapColumns"
              class="px-8 mt-4"
              outlined
              x-large
              color="primary"
              :disabled="!mapColumnsDisable"
              @click="mapColumns = !mapColumns"
            >
              <v-icon left> mdi-format-list-bulleted-square </v-icon>
              MAPEAR COLUMNAS
            </v-btn>
          </div>
          <div class="px-1">
            <div v-if="mapColumns" class="pl-2 mb-6 mt-2">
              <v-card outlined>
                <v-card-text class="text-right pa-0 mb-2">
                  <v-row no-gutters class="mx-1 align-center">
                    <v-col cols="1" class="text-left">
                      <v-checkbox
                        v-model="allStructureColumns"
                        hide-details
                        class="mt-0"
                        @change="changeStructureColumns()"
                      />
                    </v-col>
                    <v-col cols="5" class="text-left">
                      <span class="font-weight-medium"> Columnas de BBDD </span>
                    </v-col>
                    <v-col cols="1" class="text-left">
                      <tooltip
                        message="Columnas cargadas<br>desde base de datos<br>(modelo de datos)"
                      />
                    </v-col>
                    <v-col cols="5" class="text-center">
                      <span class="ml-1 font-weight-medium">
                        Columnas de estructura
                      </span>
                    </v-col>
                  </v-row>
                  <div class="y-overflow">
                    <div
                      v-for="(item, i) in selectedActivity.config
                        .listMapColumns"
                      :key="i"
                    >
                      <v-divider class="mb-2"></v-divider>
                      <v-row
                        no-gutters
                        class="mx-1 mb-2 align-center justify-start"
                      >
                        <v-col cols="1" class="text-left">
                          <v-checkbox
                            v-model="item.active"
                            hide-details
                            class="mt-0"
                            @change="$emit('change-element')"
                          />
                        </v-col>
                        <v-col cols="5" class="text-left">
                          <span class="font-weight-medium">
                            {{ item.name }}
                          </span>
                        </v-col>
                        <v-col cols="1" class="text-left">
                          <v-icon color="gray300"> mdi-arrow-right </v-icon>
                        </v-col>
                        <v-col cols="5" class="text-left">
                          <v-autocomplete
                            v-model="item.value"
                            hide-details
                            dense
                            :items="selectedActivity.config.listFileStructure"
                            item-text="name"
                            item-value="name"
                            outlined
                            @change="$emit('change-element')"
                          />
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <v-btn
                v-if="!activateDeleteMapColumns"
                text
                small
                color="primary"
                class="pl-0 mt-1"
                @click="activateDeleteMapColumns = !activateDeleteMapColumns"
              >
                eliminar estructura
              </v-btn>
              <v-sheet
                v-if="activateDeleteMapColumns"
                outlined
                rounded
                color="secondary"
                class="mt-2"
              >
                <v-card color="white" flat>
                  <v-card-text class="d-flex">
                    <v-icon color="secondary" class="mr-1">
                      mdi-alert-circle
                    </v-icon>
                    ¿Está seguro de eliminar estructura del archivo?
                  </v-card-text>
                  <v-card-text class="mt-6 d-flex justify-end">
                    <v-btn
                      text
                      color="primary"
                      @click="
                        activateDeleteMapColumns = !activateDeleteMapColumns
                      "
                    >
                      CANCELAR
                    </v-btn>
                    <v-btn
                      outlined
                      color="primary"
                      @click="deleteAllFileMapColumns()"
                    >
                      SÍ, ELIMINAR
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-sheet>
            </div>
          </div>
        </v-form>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import automationBffMixin from '@/mixins/services/automationBffMixin'
import Tooltip from '@/components/util/Tooltip.vue'

export default {
  name: 'UploadFilesConfiguration',
  components: { Tooltip },
  mixins: [validationMixin, automationBffMixin],
  props: {
    selectedActivity: {
      type: Object,
      default: () => ({}),
    },
    clientId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      valid: false,
      codingList: ['UTF-8', 'ISO-8859-1'],
      readingModeList: ['Por separador', 'Por línea de registro'],
      sourceDatabaseList: ['lista 1', 'lista 2'],
      estructuraArchivoDisable: true,
      createStructure: false,
      mapColumns: false,
      mapColumnsDisable: true,
      fileStructureList: [],
      activateDeleteStructure: false,
      allStructureColumns: false,
      activateDeleteMapColumns: false,
      actionList: [
        'Insertar',
        'Actualizar',
        'Eliminar',
        'Insertar o actualizar',
        'Consultar',
      ],
      formatList: [
        'DD-MM-YYYY',
        'MM-DD-YYY',
        'YYYY-MM-DD',
        'DD/MM/YYYY',
        'DD-MM-YY HH:mm:ss',
        'Epoch',
      ],
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
    'selectedActivity.config.coding': {
      handler() {
        this.activateStructure()
      },
    },
    'selectedActivity.config.readingMode': {
      handler() {
        this.activateStructure()
      },
    },
    'selectedActivity.config.separators': {
      handler() {
        this.activateStructure()
      },
    },
    'selectedActivity.config.sourceDatabase': {
      handler() {
        this.activateMapColumns()
      },
    },
    'selectedActivity.config.action': {
      handler() {
        this.activateMapColumns()
      },
    },
  },
  created() {
    this.getColumnType()
  },
  methods: {
    async getColumnType() {
      this.fileStructureList = await this.getColumnTypeslist(this.clientId)
    },
    listType() {
      let label = ''
      if (this.selectedActivity.config.fileTypeCSV) {
        label += 'CSV'
      }
      if (this.selectedActivity.config.fileTypeCSV) {
        if (label !== '') {
          label += ', '
        }
        label += 'TXT'
      }
      if (this.selectedActivity.config.fileTypeXLS) {
        if (label !== '') {
          label += ', '
        }
        label += 'XLS'
      }
      if (this.selectedActivity.config.fileTypeXLSX) {
        if (label !== '') {
          label += ', '
        }
        label += 'XLSX'
      }
      if (this.selectedActivity.config.fileTypeOTHER) {
        if (label !== '') {
          label += ', '
        }
        label += this.selectedActivity.config.extensionOTHER
      }
      return label
    },
    activateStructure() {
      if (
        this.selectedActivity.config.coding !== '' &&
        this.selectedActivity.config.readingMode !== '' &&
        this.selectedActivity.config.separators !== ''
      ) {
        this.estructuraArchivoDisable = true
      } else {
        this.estructuraArchivoDisable = false
      }
    },
    activateMapColumns() {
      if (
        this.selectedActivity.config.sourceDatabase !== '' &&
        this.selectedActivity.config.action !== ''
      ) {
        this.mapColumnsDisable = true
      } else {
        this.mapColumnsDisable = false
      }
    },
    deleteAllFileStructure() {
      this.activateDeleteStructure = false
      this.$emit('delete-all-file-structure')
    },
    dowloadJson() {
      const filename = 'file_structure.json'
      const json = JSON.stringify(
        this.selectedActivity.config.listFileStructure
      )
      this.download(filename, json)
    },
    download(filename, text) {
      const element = document.createElement('a')
      element.setAttribute(
        'href',
        `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
      )
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    changeStructureColumns() {
      this.selectedActivity.config.listMapColumns.forEach((element) => {
        element.active = this.allStructureColumns
      })
      this.$emit('change-element')
    },
    deleteAllFileMapColumns() {
      this.selectedActivity.config.listMapColumns.forEach((element) => {
        element.active = false
        element.value = ''
      })
      this.activateDeleteMapColumns = false
      this.mapColumns = false
      this.$emit('change-element')
    },
  },
}
</script>
<style scoped>
.y-overflow {
  max-height: 280px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
