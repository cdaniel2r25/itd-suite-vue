<template>
  <v-container fluid fill-height class="white">
    <v-col class="fill-height">
      <v-form ref="form" v-model="valid">
        <v-row no-gutters>
          <v-col cols="12">
            <v-btn
              text
              color="primary"
              class="px-0"
              @click="$router.push({ name: 'Contacts' })"
            >
              <v-icon color="primary"> mdi-arrow-left </v-icon>
              VOLVER A CONTACTOS
            </v-btn>
          </v-col>
          <v-col cols="12">
            <div class="mt-5 text-h4">Importar contactos</div>
          </v-col>
        </v-row>
        <v-stepper v-model="e6" vertical flat>
          <v-stepper-step :complete="e6 > 1" step="1" editable>
            <div class="text-h5">Importar y configuración de columnas</div>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-row no-gutters>
              <v-col cols="12">
                <v-checkbox
                  v-model="assignContact"
                  label="Asignar contactos de la importación a una o más listas existente."
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-expand-transition>
                <v-col v-if="assignContact" lg="2" md="2" sm="12">
                  <v-select
                    v-model="selectedContactsList"
                    :items="contactsLists"
                    return-object
                    item-value="id"
                    item-text="name"
                    label="Lista de contactos"
                    placeholder="Seleccionar lista(s)"
                    persistent-placeholder
                    outlined
                    multiple
                    class="mt-5"
                  >
                    <template v-slot:selection="{ item }">
                      <div
                        v-if="selectedContactsList.indexOf(item) < 1"
                        class="accent--text"
                      >
                        Seleccionar lista(s)
                      </div>
                    </template>
                  </v-select>
                </v-col>
              </v-expand-transition>
            </v-row>
            <v-row
              no-gutters
              :class="
                assignContact && selectedContactsList.length ? 'mt-5 mb-10' : ''
              "
            >
              <v-expand-transition>
                <v-col
                  v-if="assignContact && selectedContactsList.length"
                  class="overflow-y-auto"
                  style="max-height: 100px"
                  lg="3"
                  md="3"
                  sm="12"
                >
                  <v-chip
                    v-for="contactList in selectedContactsList"
                    :key="contactList.id"
                    color="success"
                    class="ma-2"
                    close
                    @click:close="removeContactList(contactList)"
                  >
                    <v-icon class="mr-2">mdi-check</v-icon>
                    {{ contactList.name }}
                  </v-chip>
                </v-col>
              </v-expand-transition>
            </v-row>
            <v-row no-gutters>
              <v-col v-if="!active && !endProcess" md="4" sm="12">
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
            <v-row v-if="activeWait && !endProcess" class="mt-2" no-gutters>
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
              <v-col lg="2" md="5" sm="12">
                <v-sheet
                  outlined
                  color="gray300"
                  rounded
                  class="mt-4"
                  style="min-width: 280px"
                >
                  <v-card outlined flat>
                    <v-card-text class="text-subtitle-1">
                      <div>
                        Se ha cargado lista de contactos:
                        <div style="font-weight: 500">
                          {{ customTable.name }}.
                        </div>
                      </div>
                      <div class="mr-5">
                        <v-btn
                          text
                          plain
                          class="primary--text pl-0"
                          style="text-transform: none"
                          @click="dialogDelete = true"
                        >
                          Eliminar importación
                          <v-icon class="pl-2 mr-5">mdi-delete </v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-sheet>
              </v-col>
            </v-row>
            <v-row class="mt-10 mb-2">
              <v-col cols="12">
                <v-btn
                  outlined
                  color="primary"
                  class="mr-5"
                  @click="$router.push({ name: 'Contacts' })"
                >
                  cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  :disabled="!customTable.headerConfigList.length"
                  @click="e6 = 2"
                >
                  Continuar
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step
            :complete="e6 > 2"
            step="2"
            :editable="customTable.headerConfigList.length > 0"
          >
            <div class="text-h5">Mapeo de columnas</div>
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-row>
              <v-col cols="12">
                Asigna columnas de archivo a encabezados de tabla de contactos
              </v-col>
            </v-row>
            <column-mapping
              v-if="customTable.headerConfigList.length"
              :mapping="mapping"
              :columns="customTable.headerConfigList"
              :cols="6"
            />
            <v-row v-if="!contactsImported && !contactsError" class="mt-10">
              <v-col cols="12">
                <v-btn
                  outlined
                  color="primary"
                  class="mr-5"
                  @click="$router.push({ name: 'Contacts' })"
                >
                  cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  :disabled="mappingValidation()"
                  @click="importContacts()"
                >
                  importar
                </v-btn>
              </v-col>
            </v-row>
            <v-row
              v-if="contactsImported || contactsError"
              class="mt-2"
              no-gutters
            >
              <v-col cols="4">
                <v-sheet
                  outlined
                  :color="!contactsError ? 'greencheck' : 'red'"
                  rounded
                  class="mt-4"
                >
                  <v-card outlined flat>
                    <v-card-text class="text-subtitle-1">
                      <v-icon
                        :color="!contactsError ? 'greencheck' : 'red'"
                        class="mr-2"
                      >
                        mdi-check-circle
                      </v-icon>
                      {{
                        !contactsError
                          ? '¡Se ha importado con éxito base de datos '
                          : 'Error al importar la lista de contactos '
                      }}
                      <strong> {{ customTable.name }} </strong>.
                    </v-card-text>
                  </v-card>
                </v-sheet>
                <v-row no-gutters class="mt-6">
                  <v-col cols="1">
                    <v-btn depressed color="primary" @click="goToContacts()">
                      IR A LISTADO DE CONTACTOS
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper>
        <v-dialog
          v-model="active"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar color="white">
              <v-btn
                text
                color="primary"
                class="px-0"
                @click="dialogDelete = true"
              >
                <v-icon color="primary"> mdi-arrow-left </v-icon>
                VOLVER
              </v-btn>
              <v-spacer />
              <v-toolbar-title class="ml-15 text-h4">
                Importar contactos
              </v-toolbar-title>
              <v-spacer />
              <v-toolbar-items>
                <div class="d-flex align-center">
                  <v-btn
                    class="mr-5"
                    color="primary"
                    outlined
                    @click="dialogDelete = true"
                  >
                    cancelar
                  </v-btn>
                  <v-btn
                    color="primary"
                    :disabled="!valid"
                    @click="acceptImport()"
                  >
                    importar
                  </v-btn>
                </div>
              </v-toolbar-items>
            </v-toolbar>
            <v-row class="pa-5">
              <v-col v-if="active" cols="12">
                <div class="pl-4 mt-2">
                  <div class="text-h5">Previsualización y configuración</div>
                  <div class="text-h6" style="font-weight: 400">
                    Ingresa nombre y previsualiza los primeros 10 registros del
                    archivo. Configura columnas que requieres y para las que no
                    requieras selecciona ‘ignorar’.
                  </div>
                </div>
              </v-col>
              <v-col cols="4" class="mt-6 mb-n5 pa-5">
                <v-text-field
                  v-model="customTable.name"
                  :rules="nameRules"
                  label="Nombre"
                  placeholder="Ingresar nombre de base de datos"
                  type="text"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row v-if="active" class="pa-7" no-gutters>
              <v-col cols="12">
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
                  <v-card flat class="primary100 mx-8 mt-8 d-flex flex-row">
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
                          v-for="(
                            header, index
                          ) in customTable.headerConfigList"
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
                                  <v-icon
                                    color="primary"
                                    v-bind="attrs"
                                    v-on="on"
                                  >
                                    mdi-help-circle-outline
                                  </v-icon>
                                </template>
                                <div>
                                  <div
                                    class="pb-2 white--text font-weight-bold"
                                  >
                                    Formatos sugeridos:
                                  </div>
                                  <div class="pa-0 white--text">
                                    - “DD-MM-YYYY”
                                  </div>
                                  <div class="pa-0 white--text">
                                    - “MM-DD-YYYY”
                                  </div>
                                  <div class="pa-0 white--text">
                                    - “DD/MM/YYYY”
                                  </div>
                                  <div class="pa-0 white--text">- “HH:mm”</div>
                                  <div class="pa-0 white--text">
                                    - “HH:mm:ss”
                                  </div>
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
          </v-card>
        </v-dialog>
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
import customTableDataBffMixin from '@/mixins/services/database/customTableDataBffMixin'
import customTableBffMixin from '@/mixins/services/database/customTableBffMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import ImportDocumentButton from '@/components/util/ImportDocumentButton.vue'
import validationMixin from '@/mixins/validation/validationMixin'
import ColumnMapping from '@/components/modules/whatsapp/contacts/ColumnMapping.vue'
import { mapGetters } from 'vuex'

moment.locale('ES')

export default {
  name: 'ImportContacts',
  components: { ImportDocumentButton, BaseDialog, ColumnMapping },
  mixins: [
    filesMixin,
    permissionsMixin,
    validationMixin,
    customTableBffMixin,
    customTableDataBffMixin,
    adminBffMixin,
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
      e6: 1,
      assignContact: false,
      selectedContactsList: [],
      contactsLists: [
        {
          id: '1',
          name: 'Lista 01',
        },
        {
          id: '2',
          name: 'Lista 02',
        },
        {
          id: '3',
          name: 'Lista 03',
        },
      ],
      mapping: { name: '', phone: '' },
      contactsImported: false,
      contactsError: false,
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
            this.deleteExcel()
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
        this.activeWait = false
        this.endProcess = true
        this.active = false
        this.$emit('selected-custom-table', this.customTable)
        this.$emit('selected-custom-table-data', this.customTableData)
        this.$emit('headers-rules', this.headers)
        this.$emit('close-dialog', false)
      }
    },
    async importContacts() {
      const contactsObject = {
        importFile: this.customTable,
        contactAssign: {
          assignToExistingList: false,
          contactsList: this.selectedContactsList,
        },
        mappedColumns: this.mapping,
      }
      const response = await this.importWhatsappContacts(contactsObject)
      if (response) {
        this.contactsImported = true
      } else {
        this.contactsError = true
      }
    },
    goToContacts() {
      this.$router.push({ name: 'Contacts' })
    },
    deleteExcel() {
      this.fileToUpload = null
      this.dialogDelete = false
      this.cleanCustomTable()
      this.mapping = { name: '', phone: '' }
      this.headers = []
      this.active = false
      this.endProcess = false
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
    //
    //
    //
    //
    removeContactList(contactList) {
      const index = this.selectedContactsList.indexOf(contactList)
      if (index > -1) {
        this.selectedContactsList.splice(index, 1)
      }
    },
    cleanCustomTable() {
      this.customTable = {
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
      }
      this.customTableData = {
        jsonDataRow: [],
        disabled: false,
        deleted: false,
      }
    },
    mappingValidation() {
      if (this.mapping.name !== '' && this.mapping.phone !== '') return false
      return true
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
