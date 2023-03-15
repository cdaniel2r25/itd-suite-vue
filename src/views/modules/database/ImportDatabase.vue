<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <v-form ref="form" v-model="valid">
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn
              text
              color="primary"
              class="px-0"
              @click="$router.push({ name: 'Databases' })"
            >
              <v-icon color="primary"> mdi-arrow-left </v-icon>
              VOLVER A LISTADO
            </v-btn>
            <h1 class="mt-5">Importar base de datos</h1>
            <div class="my-2">
              Ingresa nombre e importa tu archivo para crear una nueva base de
              datos.
            </div>
          </v-col>
          <v-col cols="5" class="mt-6">
            <v-text-field
              v-model="customTable.name"
              :rules="nameRules"
              label="Nombre"
              placeholder="Ingresar nombre de base de datos"
              type="text"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col v-if="!active" cols="5">
            <import-document-button
              is-box
              text="Importar base de datos"
              title="Formatos permitidos csv, xlsx, xls, txt."
              background-color="gray100"
              @open-file-input="openFile()"
            />
          </v-col>
          <v-col v-if="loading" cols="4">
            <v-card outlined class="mt-4">
              <v-card-text>
                Espera un momento, estamos preparando la previsualización de
                datos.
                <div class="mt-7 warning--text">
                  CARGANDO DATOS
                  <v-progress-circular
                    width="2"
                    size="20"
                    color="warning"
                    indeterminate
                    class="ml-2"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="active" cols="12">
            <div class="pl-4 mt-2">
              <h3>Previsualización y configuración</h3>
              <div>
                Previsualiza los primeros 10 registros del archivo y configura
                columnas que requieres. Para las que no requieras selecciona
                ‘ignorar’.
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="active" no-gutters>
          <v-col cols="12" class="mt-5">
            <v-card flat outlined class="pb-6">
              <div v-if="!endProcess" class="btn-delete-table">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      x-small
                      fab
                      color="gray100"
                      v-on="on"
                      @click="dialogDelete = true"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                  <span>Cambiar la tabla excel</span>
                </v-tooltip>
              </div>
              <v-card flat class="primary100 mx-8 mt-2 d-flex flex-row">
                <v-switch
                  v-model="switchIgnoreAll"
                  label="Ignorar todos"
                  color="primary"
                  class="ml-4"
                  @change="ignoreAllColumns"
                />
                <v-switch
                  v-model="switchText"
                  label="Marcar todos como texto"
                  color="primary"
                  class="ml-4"
                  @change="markAllColumnsAsText"
                />
              </v-card>
              <v-data-table
                dense
                :headers="headers"
                :items="customTableData.jsonDataRow"
                :items-per-page="10"
                class="mx-8 rounded-sm striped-table"
                style="border: 2px solid gray300"
                hide-default-header
                hide-default-footer
              >
                <template v-slot:header="{ props }">
                  <tr>
                    <th
                      v-for="(header, index) in customTable.headerConfigList"
                      :key="index"
                      class="pt-6 px-3 text-caption"
                      :class="{ 'disabled-column': header.ignore }"
                    >
                      <div :class="{ 'high-row-format': hasFormatHeight }">
                        <v-select
                          v-model="header.type"
                          :items="columnTypeslist"
                          :rules="columnRules"
                          :disabled="header.ignore"
                          label="Configuración columna"
                          dense
                          outlined
                          hide-details
                          @change="verifyColumn(index, header.type)"
                        />
                        <div
                          v-if="header.hasFormat"
                          class="d-flex align-center mt-2"
                        >
                          <v-text-field
                            v-model="header.format"
                            class="mr-1"
                            dense
                            outlined
                            hide-details
                            type="text"
                            label="Ingrese formato"
                            placeholder="Ingrese formato de fecha"
                            :rules="dateFormatRules"
                            @change="changeFormat(index, header.field)"
                          />
                          <v-tooltip right color="primary">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon color="primary" v-bind="attrs" v-on="on">
                                mdi-help-circle-outline
                              </v-icon>
                            </template>
                            <div>
                              <div class="pb-2 white--text font-weight-bold">
                                Formatos sugeridos:
                              </div>
                              <div class="pa-0 white--text">- “DD-MM-YYYY”</div>
                              <div class="pa-0 white--text">- “MM-DD-YYYY”</div>
                              <div class="pa-0 white--text">- “DD/MM/YYYY”</div>
                              <div class="pa-0 white--text">- “HH:mm”</div>
                              <div class="pa-0 white--text">- “HH:mm:ss”</div>
                              <div class="pa-0 white--text">
                                - “DD-MM-YY HH:mm:ss”
                              </div>
                            </div>
                          </v-tooltip>
                        </div>
                      </div>
                      <v-switch
                        v-model="header.ignore"
                        label="Ignorar"
                        color="primary"
                        hide-details
                        @click="recolorColumnTable(header.ignore, index)"
                        @change="ignoreColumn"
                      />
                    </th>
                  </tr>
                  <tr>
                    <td
                      v-for="header in props.headers"
                      :key="header.value"
                      class="pa-4 text-caption header-lines font-weight-bold"
                    >
                      {{ header.text }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="mt-2" no-gutters>
          <v-col v-if="!endProcess && active" cols="1">
            <v-btn
              :disabled="!valid"
              depressed
              color="primary"
              @click="acceptImport()"
            >
              IMPORTAR
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="activeWait" class="mt-2" no-gutters>
          <v-col cols="12">
            <v-card outlined class="mt-4">
              <v-card-text>
                Espera un momento, estamos preparando la previsualización de
                datos {{ customTable.name }}.
                <div class="mt-7 warning--text">
                  AÑADIENDO DATOS
                  <v-progress-circular
                    width="2"
                    size="20"
                    color="warning"
                    indeterminate
                    class="ml-2"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="endProcess" class="mt-2" no-gutters>
          <v-col cols="12">
            <v-sheet outlined color="greencheck" rounded class="mt-4">
              <v-card outlined flat>
                <v-card-text class="text-subtitle-1">
                  <v-icon color="greencheck" class="mr-2">
                    mdi-check-circle
                  </v-icon>
                  ¡Se ha importado y configurado con éxito base de datos
                  <strong> {{ customTable.name }} </strong>.
                </v-card-text>
              </v-card>
            </v-sheet>
            <v-row no-gutters class="mt-6">
              <v-col cols="1">
                <v-btn depressed color="primary" @click="goToDatabases()">
                  IR A LISTADO
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
    <v-file-input
      v-show="false"
      id="inputUpload"
      ref="inputUpload"
      v-model="fileToUpload"
      accept=".xls, .xlsx, .csv, .txt"
      @change="onChangeFileInput"
    />
    <base-dialog
      v-model="dialogDelete"
      text-alert="¿Está seguro de cerrar la importación? Vas a perder los datos cargados."
      primary-btn-text="Sí, Cerrar"
      secondary-btn-text="Cancelar"
      @primary-btn-action="deleteExcel()"
    />
  </v-container>
</template>

<script>
import moment from 'moment'
import BaseDialog from '@/components/util/BaseDialog.vue'
import filesMixin from '@/mixins/util/filesMixin'
import customTableBffMixin from '@/mixins/services/database/customTableBffMixin'
import customTableDataBffMixin from '@/mixins/services/database/customTableDataBffMixin'
import customTableFilterBffMixin from '@/mixins/services/database/customTableFilterBffMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import ImportDocumentButton from '@/components/util/ImportDocumentButton.vue'
import validationMixin from '@/mixins/validation/validationMixin'
import { mapGetters } from 'vuex'

moment.locale('ES')

export default {
  name: 'ImportDatabase',
  components: { ImportDocumentButton, BaseDialog },
  mixins: [
    filesMixin,
    permissionsMixin,
    validationMixin,
    customTableBffMixin,
    customTableDataBffMixin,
    customTableFilterBffMixin,
  ],
  data() {
    return {
      hasFormatHeight: false,
      EndLoading: false,
      endProcess: false,
      activeWait: false,
      valid: false,
      fileToUpload: null,
      loading: false,
      active: false,
      dialogDelete: false,
      switchIgnoreAll: false,
      switchText: false,
      previousColumnConfiguration: [],
      customTableData: { jsonDataRow: [], disabled: false, deleted: false },
      customTable: {
        name: '',
        headerConfigList: [],
        fileBase64: '',
        fileExtension: '',
        singleUse: false,
        clientId: '',
        numberRows: 0,
        numberEmailTypeRow: 0,
        numberPhoneTypeRow: 0,
        typeId: 'string',
      },
      headers: [],
      columnTypeslist: [],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
    nameRules() {
      return [(v) => this.isRequired(v, 'Nombre'), (v) => this.minLength(v, 3)]
    },
    columnRules() {
      return [
        (v) => this.isRequired(v, 'Columna'),
        (v) => this.isValidColumn(v, this.customTableData.jsonDataRow),
      ]
    },
    dateFormatRules() {
      return [(v) => this.isRequired(v, 'Formato')]
    },
  },
  created() {
    this.getRecord()
  },
  methods: {
    async getRecord() {
      this.columnTypeslist = await this.getColumnTypeslist(this.clientId)
    },
    openFile() {
      document.getElementById('inputUpload').click()
    },
    setHeaders() {
      Object.keys(this.customTableData.jsonDataRow[0]).forEach((header) => {
        this.headers.push({
          text: header,
          value: header,
          class: 'disabled-column',
        })
        this.customTable.headerConfigList.push({
          field: header,
          type: this.verifyType(header),
          ignore: false,
          validate: false,
          format: '',
          hasFormat: false,
        })
      })
    },
    verifyType(header) {
      let valor = 'text_nor'
      const fila = this.customTableData.jsonDataRow[0]
      console.log(fila)
      if (typeof fila[header] === 'number') {
        valor = 'number'
      } else if (fila[header].includes('@')) {
        valor = 'text_email'
      } else if (
        fila[header].includes('http') ||
        fila[header].includes('https')
      ) {
        valor = 'text_url'
      }
      return valor
    },
    async onChangeFileInput() {
      this.active = true
      this.loading = true
      const file = this.fileToUpload
      if (file !== null && this.isExtensionSupported(file)) {
        await this.fileToJsonArray(file)
          .then((result) => {
            this.customTableData.jsonDataRow = result
            this.setHeaders()
          })
          .then(() => {
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.active = false
            console.error(err)
            this.$store.commit('alert', {
              type: 'error',
              text: '¡Error en la transformación de archivo a json!',
            })
          })
      } else if (file !== null && !this.isExtensionSupported(file)) {
        this.loading = false
        this.active = false
        this.$store.commit('alert', {
          type: 'error',
          text: '¡Esta extensión de archivo no es soportada por el sistema!',
        })
      }
    },
    async acceptImport() {
      if (this.$refs.form.validate()) {
        this.customTable.clientId = this.clientId
        await this.fileToBase64(this.fileToUpload).then((result) => {
          this.customTable.fileBase64 = result
        })
        this.customTable.fileExtension = await this.getFileExtension(
          this.fileToUpload
        )
        this.activeWait = true
        await this.createDatabaseByImport(this.customTable)
        this.activeWait = false
        this.endProcess = true
      }
    },
    goToDatabases() {
      this.$router.push({ name: 'Databases' })
    },
    deleteExcel() {
      this.fileToUpload = null
      this.dialogDelete = false
      this.customTable.headerConfigList = []
      this.customTableData.jsonDataRow = []
      this.headers = []
      this.active = false
    },
    ignoreColumn(column) {
      if (!column.ignore) {
        this.switchIgnoreAll = false
      }
    },
    recolorColumnTable(activo, index) {
      const tabla = document.getElementsByTagName('table')[0]
      const tr = tabla.getElementsByTagName('tr')
      for (let row = 0; row <= tr.length; row += 1) {
        if (tr[row] !== undefined) {
          const td = tr[row].getElementsByTagName('td')
          if (td[index] !== undefined) {
            if (activo) {
              td[index].style.background = '#EEEEEE'
              td[index].style.color = '#979797'
            } else {
              td[index].style.removeProperty('background')
              td[index].style.removeProperty('color')
            }
          }
        }
      }
    },
    verifyColumn(index, type) {
      this.hasFormatHeight = false
      this.customTable.headerConfigList.forEach((header) => {
        if (header.type === 'date') {
          this.hasFormatHeight = true
        }
      })
      const columnItem = this.customTable.headerConfigList[index]
      columnItem.hasFormat = false
      if (type === 'date') {
        columnItem.hasFormat = true
        this.hasFormatHeight = true
      }
    },
    changeFormat(index, field) {
      const columnItem = this.customTable.headerConfigList[index]
      let formatItem = columnItem.format
      formatItem = formatItem.toString()
      const fila = this.customTableData.jsonDataRow
      let isDate = true
      fila.forEach((rowsValue) => {
        const result = moment(rowsValue[field], formatItem, true).isValid()
        if (result === false) {
          isDate = false
        }
      })
      if (isDate === false) {
        this.$store.commit('alert', {
          type: 'error',
          text: 'Los datos no corresponde con el formato fecha.',
        })
      }
    },
    ignoreAllColumns(switchValue) {
      this.customTable.headerConfigList.forEach((field, index) => {
        field.ignore = switchValue
        this.recolorColumnTable(switchValue, index)
      })
    },
    markAllColumnsAsText(switchValue) {
      if (switchValue) {
        this.previousColumnConfiguration = []
        this.customTable.headerConfigList.forEach((field) => {
          this.previousColumnConfiguration.push(field.type)
          field.type = 'text_nor'
          field.hasFormat = false
        })
        this.hasFormatHeight = false
      } else {
        this.customTable.headerConfigList.forEach((field, index) => {
          field.type = this.previousColumnConfiguration[index]
          if (this.previousColumnConfiguration[index] === 'date') {
            field.hasFormat = true
            this.hasFormatHeight = true
          }
        })
      }
    },
  },
}
</script>

<style scoped>
.header-lines {
  border-top: thin solid rgba(0, 0, 0, 0.12);
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
.btn-delete-table {
  position: absolute;
  top: -18px;
  right: -18px;
}
.disabled-column {
  background-color: var(--v-gray100-base);
}
.high-row-format {
  height: 80px;
}
</style>
