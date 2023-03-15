<template>
  <v-tabs>
    <v-tab>Bases de Datos</v-tab>
    <v-tab-item>
      <v-row>
        <v-col align="end">
          <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ attrs }">
              <v-btn
                color="primary"
                outlined
                v-bind="attrs"
                @click="dialog = true"
              >
                Importar nueva base
                <v-icon dark class="ml-2"> mdi-plus-box-multiple </v-icon>
              </v-btn>
            </template>
            <v-card tile>
              <v-card-title class="primary">
                <v-btn text color="white" class="px-0" @click="dialog = false">
                  <v-icon color="white" class="mx-1"> mdi-arrow-left </v-icon>
                  VOLVER A LISTADO
                </v-btn>
              </v-card-title>
              <import-database
                @selected-custom-table="
                  customTable = JSON.parse(JSON.stringify($event))
                "
                @selected-custom-table-data="customTableData = $event"
                @headers-rules="headersRules = $event"
                @close-dialog="pushExcelToList"
              />
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table
            v-model="selectedDatabases"
            class="striped-table"
            :headers="headers"
            :items="databasesList"
            :page.sync="actualPage"
            :items-per-page.sync="itemsPerPage"
            :server-items-length="totalElements"
            :footer-props="{
              'show-current-page': true,
              'show-first-last-page': true,
              'items-per-page-text': 'Elementos por página',
              'items-per-page-options': [5, 10, 15, 20, 25],
            }"
            single-select
            item-key="id"
            show-select
            :loading="loading"
            loading-text="Cargando Tablas... espere por favor"
            @update:options="printEvent"
            @item-selected="verifySelectedDatabase"
          >
            <template v-slot:[`item.verified`]="{ item }">
              <div
                v-if="
                  verifyLoader &&
                  selectedDatabases.length !== 0 &&
                  item.id === selectedDatabases[0].id
                "
              >
                <v-icon :color="verifiedItem.color">
                  {{ verifiedItem.icon }}
                </v-icon>
                <span :class="verifiedItem.spanClass">
                  {{ verifiedItem.spanText }}
                </span>
              </div>
            </template>
            <template
              v-slot:[`item.data-table-select`]="{ isSelected, select, item }"
            >
              <v-simple-checkbox
                v-ripple
                color="primary"
                :value="isSelected"
                :disabled="item.state === 'waiting'"
                @input="select"
              />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row v-if="selectedDatabases.length != 0" class="pl-2">
        <v-col>
          <v-row class="accent--text">
            <v-icon class="mr-2" color="primary">mdi-information</v-icon> Se va
            a hacer un envio a {{ selectedDatabases[0].name }} seleccionada, la
            cual posee {{ selectedDatabases[0].numberRows }} contactos.
          </v-row>
          <v-row class="mt-16">
            <v-col>
              <v-row class="accent--text">
                <span class="text-h8 mb-5">
                  Selecciona y añade nuevos filtros a bases de datos
                  seleccionadas
                </span>
              </v-row>
              <v-row v-if="filters" class="my-4">
                <database-filter-form
                  :custom-table="selectedDatabases[0]"
                  :filter-list="filters"
                  :campaign="campaign"
                  @update-data="updateFilterList()"
                />
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-tab-item>
  </v-tabs>
</template>
<script>
import filesMixin from '@/mixins/util/filesMixin'
import { mapGetters } from 'vuex'
import DatabaseFilterForm from '@/components/util/DatabaseTableFilter.vue'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import customTableBffMixin from '@/mixins/services/database/customTableBffMixin'
import customTableDataBffMixin from '@/mixins/services/database/customTableDataBffMixin'
import customTableFilterBffMixin from '@/mixins/services/database/customTableFilterBffMixin'
import ImportDatabase from '@/components/modules/whatsapp/campaign/ImportDatabase.vue'

const VERIFY_COLUMN_PARAMS = {
  verify: {
    color: 'green',
    icon: 'mdi-check',
    spanClass: 'ml-4 green--text',
    spanText: 'VERIFICADA',
    btnText: '',
  },
  pending: {
    color: 'orange',
    icon: 'mdi-autorenew mdi-spin',
    spanClass: 'ml-4 orange--text',
    spanText: 'VERIFICANDO',
    btnText: '',
  },
  uploading: {
    color: 'orange',
    icon: 'mdi-autorenew mdi-spin',
    spanClass: 'ml-4 orange--text',
    spanText: 'IMPORTANDO',
    btnText: '',
  },
  failed: {
    color: 'red',
    icon: 'mdi-close',
    spanClass: 'ml-4 red--text text-caption',
    spanText: 'VERIFICACIÓN FALLIDA',
    btnText: 'verificar manualmente',
  },
}

export default {
  name: 'DatabaseTableUploader',
  components: { DatabaseFilterForm, ImportDatabase },
  mixins: [
    filesMixin,
    adminBffMixin,
    customTableBffMixin,
    customTableDataBffMixin,
    customTableFilterBffMixin,
  ],
  props: {
    basePath: {
      type: String,
      default: '/admin-bff',
    },
    campaign: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: true,
      dialog: false,
      destroy: false,
      fileToUpload: null,
      addFilter: false,
      selectedFilter: null,
      databasesList: [],
      customTable: {},
      itemsPerPage: 5,
      actualPage: 1,
      totalElements: 0,
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      customTableData: { jsonDataRow: [], disabled: false, deleted: false },
      resultDataFirstRows: [],
      selectedDatabases: [],
      headersRules: [],
      filters: null,
      verifyLoader: false,
      verifiedItem: {
        color: '',
        icon: '',
        spanClass: '',
        spanText: '',
        btnText: '',
      },
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          value: 'name',
        },
        { text: 'Nº de contactos', value: 'records' },
        { text: '', value: 'verified' },
      ],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  watch: {
    selectedDatabases: {
      handler(value) {
        if (value.length === 0) {
          this.campaign.database = {
            id: null,
            name: '',
          }
        }
      },
    },
    'campaign.database.id': {
      async handler(value) {
        if (value && this.selectedDatabases.length === 0) {
          this.selectedDatabases.push(this.campaign.database)
          if (this.campaign.database.verified === 1) {
            this.verifyItemColorsIconsAndText('verify')
          } else {
            this.verifyItemColorsIconsAndText('failed')
          }
          this.verifyLoader = true
          const searchFilter = {
            customTableId: this.campaign.database.id,
            page: -1,
          }
          const filterObj = await this.getDatabaseCustomFiltersById(
            searchFilter
          )
          this.filters = await filterObj.dataList
          this.getFirstRows()
        }
      },
    },
  },
  methods: {
    printEvent(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      this.getCustomTablesList()
    },
    openFile() {
      document.getElementById('inputUpload').click()
    },
    async onChange() {
      const file = this.fileToUpload
      if (file !== null && this.isExtensionSupported(file)) {
        await this.fileToJsonArray(file)
          .then((result) => {
            this.customTableData.jsonDataRow = result
            this.destroy = true
            this.dialog = true
          })
          .then(() => {
            this.$refs.inputUpload.reset()
          })
          .catch((err) => {
            console.error(err)
            this.$store.commit('alert', {
              type: 'error',
              text: '¡Error al cargar el archivo!',
            })
          })
      } else if (file !== null && !this.isExtensionSupported(file)) {
        this.$store.commit('alert', {
          type: 'error',
          text: '¡Esta extensión de archivo no es soportada por el sistema!',
        })
      }
    },
    verifyItemColorsIconsAndText(state) {
      this.verifiedItem = { ...VERIFY_COLUMN_PARAMS[state] }
    },
    async getCustomTablesList() {
      let sortBy = '-1'
      let sortDesc = '-1'
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      const customTableFilter = {
        clientId: this.clientId,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
        validatePhone: true,
      }
      const databasesObjectQuery = await this.getDatabasesListByClientId(
        customTableFilter
      )
      this.databasesList = await databasesObjectQuery.dataList
      this.totalElements = await databasesObjectQuery.totalElements
      this.loading = false
    },
    async verifySelectedDatabase(event) {
      this.verifyLoader = false
      if (event.value) {
        this.$emit('input', event.item)
        this.campaign.database = event.item

        const searchFilter = {
          customTableId: this.campaign.database.id,
          page: -1,
        }
        const filterObj = await this.getDatabaseCustomFiltersById(searchFilter)
        this.filters = await filterObj.dataList
        this.verifyItemColorsIconsAndText('pending')
        this.verifyLoader = true
        await this.getDatabaseDetailById(event.item.id)
          .then((result) => {
            if (result.verified === 1) {
              this.verifyItemColorsIconsAndText('verify')
            } else {
              this.verifyItemColorsIconsAndText('failed')
            }
          })
          .catch((err) => {
            console.log(err)
          })
        this.getFirstRows()
        this.$emit('change-template')
      } else this.verifyLoader = true
    },

    async getFirstRows() {
      this.loading = true

      const searchFilter = {
        customTableId: this.campaign.database.id,
        page: -1,
        limit: 10,
        rand: true,
      }
      const objDetailsData = await this.getDatabaseDetailsByIdAndCriteria(
        searchFilter
      )
      this.customTableData = await objDetailsData.dataList

      this.resultDataFirstRows = this.customTableData.map(
        // eslint-disable-next-line no-return-assign, no-sequences
        (a) => (a.jsonDataRow.id = a.id)
      )
      this.resultDataFirstRows = this.customTableData.map((a) => a.jsonDataRow)

      this.campaign.database.firstRows = this.resultDataFirstRows
      this.loading = false
    },

    updateCustomTableList(database, uploading) {
      this.customTableData = {
        jsonDataRow: [],
        disabled: false,
        deleted: false,
      }
      if (uploading) {
        this.selectedDatabases = []
        this.selectedDatabases.push(database)
        this.verifyItemColorsIconsAndText('uploading')
        this.loading = true
        this.getCustomTablesList()
      } else {
        this.verifyItemColorsIconsAndText('verify')
        this.destroy = false
        this.loading = true
        this.getCustomTablesList()
      }
    },
    async updateFilterList() {
      const searchFilter = {
        customTableId: this.campaign.database.id,
        page: -1,
      }
      const filterObj = await this.getDatabaseCustomFiltersById(searchFilter)
      this.filters = await filterObj.dataList
    },
    async pushExcelToList(response) {
      await this.getCustomTablesList()
      this.dialog = response
    },
  },
}
</script>
