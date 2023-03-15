<template>
  <v-container fluid fill-height>
    <v-skeleton-loader
      v-if="loadingIni"
      type="date-picker, table-heading, list-item-two-line"
    />
    <v-col v-else class="fill-height">
      <v-row no-gutters>
        <v-col cols="12">
          <v-btn
            text
            color="primary"
            class="px-0"
            @click="
              $router.push({ name: 'DatabaseView', params: { id: idDatabase } })
            "
          >
            <v-icon color="primary"> mdi-arrow-left </v-icon>
            VOLVER BASE DE DATOS
          </v-btn>
          <h1 class="mt-5">Añadir registros</h1>
          <div class="my-2">
            Añade un archivo de registros a la base de
            <strong>{{ databaseClient.name }}</strong>
            .
          </div>
        </v-col>
      </v-row>
      <v-row v-if="!active" no-gutters>
        <v-col cols="5" class="mt-6 text-right">
          <v-btn color="primary" text @click="exportExcel()">
            Descarga archivo ejemplo .xlsx
            <v-icon color="primary" class="mr-2"> mdi-download </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col v-if="!active" cols="5">
          <import-document-button
            is-box
            text="AÑADIR REGISTROS"
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
            <h3>Previsualización</h3>
            <div>
              Previsualiza columnas de archivo con los primeros 10 registros.
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="active" no-gutters>
        <v-col cols="12" class="mt-5">
          <v-card elevation="0" outlined class="pb-6">
            <div class="btn-delete-table">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    x-small
                    fab
                    color="gray100"
                    v-on="on"
                    @click="changeExcel"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>Cambiar la tabla excel</span>
              </v-tooltip>
            </div>
            <v-data-table
              dense
              :headers="headers"
              :items="customTableData"
              :items-per-page="10"
              class="mx-8 rounded-sm striped-table"
            />
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="activeBtn" class="mt-2" no-gutters>
        <v-col cols="1">
          <v-btn depressed color="primary" @click="addRecords()">
            AÑADIR
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="activeWait" class="mt-2" no-gutters>
        <v-col cols="12">
          <v-card outlined class="mt-4">
            <v-card-text>
              Espera un momento.
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
            <v-card outlined elevation="0">
              <v-card-text class="text-subtitle-1">
                <v-icon color="greencheck" class="mr-2">
                  mdi-check-circle
                </v-icon>
                Se han añadido con éxito contactos a base de datos:
                <strong> {{ databaseClient.name }}</strong>
                .
              </v-card-text>
            </v-card>
          </v-sheet>
          <v-row no-gutters class="mt-6">
            <v-col cols="1">
              <v-btn
                depressed
                color="primary"
                @click="
                  $router.push({
                    name: 'DatabaseView',
                    params: { id: idDatabase },
                  })
                "
              >
                IR A LISTADO
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
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
    <base-dialog
      v-model="dialogError"
      text-alert="Las columnas del archivo no corresponden a las de la base de datos. Descargue archivo de ejemplo xlsx."
      primary-btn-text="IR A DESCARGAR"
      :is-cancel="cancelError"
      @primary-btn-action="errorExcel()"
    />
  </v-container>
</template>

<script>
import customTableBffMixin from '@/mixins/services/database/customTableBffMixin'
import customTableDataBffMixin from '@/mixins/services/database/customTableDataBffMixin'
import customTableFilterBffMixin from '@/mixins/services/database/customTableFilterBffMixin'
import BaseDialog from '@/components/util/BaseDialog.vue'
import ImportDocumentButton from '@/components/util/ImportDocumentButton.vue'
import filesMixin from '@/mixins/util/filesMixin'
import * as XLSX from 'xlsx'

export default {
  name: 'AddRecords',
  components: { ImportDocumentButton, BaseDialog },
  mixins: [
    filesMixin,
    customTableBffMixin,
    customTableDataBffMixin,
    customTableFilterBffMixin,
  ],
  data() {
    return {
      idDatabase: '',
      active: false,
      activeBtn: false,
      activeWait: false,
      endProcess: false,
      loading: false,
      loadingIni: false,
      dialogDelete: false,
      dialogError: false,
      cancelError: false,
      fileToUpload: null,
      headers: [],
      customTableDataTmp: [],
      customTableData: [],
      dataToExportArray: [],
      dataToExportTmp: {},
      databaseClient: {},
    }
  },
  created() {
    this.idDatabase = this.$route.params.id
    this.getRecord()
  },
  methods: {
    async getRecord() {
      this.loadingIni = true
      this.databaseClient = await this.getDatabaseDetailById(this.idDatabase)
      this.headers = await this.databaseClient.headerList
      this.loadingIni = false
      this.databaseList()
    },
    async onChangeFileInput() {
      this.active = true
      this.activeBtn = true
      this.loading = true
      const file = this.fileToUpload
      if (file !== null && this.isExtensionSupported(file)) {
        await this.fileToJsonArray(file)
          .then((result) => {
            this.customTableDataTmp = result
            this.createTableData()
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
        this.activeBtn = false
        this.$store.commit('alert', {
          type: 'error',
          text: '¡Esta extensión de archivo no es soportada por el sistema!',
        })
      }
    },
    createTableData() {
      if (this.customTableDataTmp.length > 0) {
        this.customTableData = []
        let noData = true
        Object.values(this.customTableDataTmp).forEach((items, index) => {
          const selectedDatabaseAdd = {}
          this.headers.forEach((header) => {
            if (header.text === 'id') {
              selectedDatabaseAdd[header] = index
            } else {
              let value = ''
              Object.entries(items).forEach((entry) => {
                const [key2, value2] = entry
                if (header.text.toLowerCase() === key2.toLowerCase()) {
                  value = value2
                  noData = false
                }
              })
              selectedDatabaseAdd[header.text] = value
            }
          })
          this.customTableData.push(selectedDatabaseAdd)
        })
        if (noData) {
          this.customTableData = []
          this.dialogError = true
        }
      }
    },
    async databaseList() {
      this.loading = true
      this.createHeader()
      this.loading = false
    },
    async createHeader() {
      await this.headers.forEach((header) => {
        this.dataToExportTmp[header.text] = ''
      })
      this.dataToExportArray.push(this.dataToExportTmp)
    },
    openFile() {
      document.getElementById('inputUpload').click()
    },
    changeExcel() {
      this.dialogDelete = true
    },
    deleteExcel() {
      this.dialogDelete = false
      this.customTableData = []
      this.active = false
    },
    errorExcel() {
      this.dialogError = false
      this.deleteExcel()
    },
    exportExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.dataToExportArray)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ejemplo')
      XLSX.writeFile(workbook, 'ejemplo.xlsx')
    },
    async addRecords() {
      const customTableDataImport = {
        customTableId: this.idDatabase,
        fileBase64: '',
        fileExtension: '',
      }
      await this.fileToBase64(this.fileToUpload).then((result) => {
        customTableDataImport.fileBase64 = result
      })
      customTableDataImport.fileExtension = await this.getFileExtension(
        this.fileToUpload
      )
      this.activeBtn = false
      this.activeWait = true
      await this.addDatabaseRecordsByImport(customTableDataImport)
      this.activeWait = false
      this.endProcess = true
    },
  },
}
</script>

<style scoped>
.btn-delete-table {
  position: absolute;
  top: -18px;
  right: -18px;
}
</style>
