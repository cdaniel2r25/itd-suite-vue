<template>
  <div>
    <div class="mb-4 mx-4">
      Importa archivo y configura el tipo de columnas.
    </div>
    <v-select
      v-model="selectionItemImport.encodingFormat"
      :items="columnTypesEncodingFormat"
      label="Codificación"
      dense
      outlined
      hide-details
      placeholder="Seleccionar codificación"
      class="mb-3 mx-4"
    />
    <import-document-button
      v-if="activeImportData"
      is-box
      text="Importar base de datos"
      title="Formatos permitidos csv, xlsx, xls, txt."
      background-color="gray100"
      class="mx-4"
      @open-file-input="openFile()"
    />
    <div class="mx-4">
      <v-progress-linear
        v-if="loadLinearProgress"
        indeterminate
        color="primary"
        class="mb-0"
      />
    </div>
    <div v-if="!activeImportData" class="mx-2">
      <v-card class="mx-auto py-4 overflow-y" outlined>
        <div v-for="column in selectionItemImport.columns" :key="column.id">
          <div class="d-flex align-center pr-4 pl-2 mb-4">
            <div style="width: 40%">
              {{ column.field }}
            </div>
            <div style="width: 10%">
              <v-icon> mdi-arrow-right </v-icon>
            </div>
            <div style="width: 45%">
              <v-select
                v-model="column.type"
                :items="columnTypeslist"
                label="Tipo"
                dense
                outlined
                hide-details
                placeholder="Seleccionar tipo"
              />
            </div>
            <div style="width: 5%">
              <v-icon
                color="primary"
                class="pt-1 pr-1"
                @click="deleteColumn(column)"
              >
                mdi-delete
              </v-icon>
            </div>
          </div>
          <v-divider class="mt-1 mb-3"></v-divider>
        </div>
      </v-card>
      <div class="mt-2 mx-2 d-flex">
        <v-btn
          outlined
          color="primary"
          @click="$emit('import-btn-close-action')"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          class="ml-4"
          @click="$emit('import-btn-accept-action')"
        >
          Importar
        </v-btn>
      </div>
    </div>
    <v-file-input
      v-show="false"
      id="inputUpload"
      ref="inputUpload"
      v-model="fileToUpload"
      accept=".xls, .xlsx, .csv, .txt"
      @change="onChangeFileInput"
    />
  </div>
</template>

<script>
import ImportDocumentButton from '@/components/util/ImportDocumentButton.vue'
import filesMixin from '@/mixins/util/filesMixin'

export default {
  name: 'ImportColumns',
  components: { ImportDocumentButton },
  mixins: [filesMixin],
  props: {
    selectionItemImport: {
      type: Object,
      default: () => {},
    },
    columnTypeslist: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fileToUpload: null,
      activeImportData: true,
      loadLinearProgress: false,
      colomnId: 1,
      columnTypesEncodingFormat: [
        {
          text: 'UTF-8',
          value: 'utf-8',
        },
        {
          text: 'ISO-8859-1',
          value: 'iso-8859-1',
        },
      ],
    }
  },
  methods: {
    openFile() {
      document.getElementById('inputUpload').click()
    },
    async onChangeFileInput() {
      this.loadLinearProgress = true
      const file = this.fileToUpload
      if (file !== null && this.isExtensionSupported(file)) {
        await this.fileToJsonArray(file)
          .then((result) => {
            this.setHeaders(result)
          })
          .then(() => {
            this.loading = false
            this.fileToUpload = {}
          })
          .catch((err) => {
            this.loading = false
            this.active = false
            console.error(err)
            this.$store.commit('alert', {
              type: 'error',
              text: '¡Error en la transformación de archivo!',
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
      this.loadLinearProgress = false
      this.activeImportData = false
    },
    setHeaders(jsonDataRow) {
      Object.keys(jsonDataRow[0]).forEach((header) => {
        const headertxt = header.replace(/ /g, '_')
        this.selectionItemImport.columns.push({
          id: this.colomnId,
          field: headertxt,
          type: this.verifyType(jsonDataRow, header),
          validate: false,
          format: '',
          hasFormat: false,
          comment: '',
          active: false,
        })
        this.colomnId += 1
      })
    },
    verifyType(jsonDataRow, header) {
      let valor = 'text_nor'
      const fila = jsonDataRow[1]
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
    deleteColumn(column) {
      const index = this.selectionItemImport.columns.indexOf(column)
      this.selectionItemImport.columns.splice(index, 1)
    },
  },
}
</script>
<style scoped>
.overflow-y {
  max-height: calc(100vh - 308px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
