<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div v-if="!activateCustomFilter">
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
          </v-col>
        </v-row>
        <v-row no-gutters class="">
          <v-col cols="5">
            <h1>{{ databaseName }}</h1>
          </v-col>
          <v-col cols="7">
            <div class="d-flex justify-end">
              <v-btn color="primary" text @click="createRowToInsert()">
                <v-icon color="primary" class="mr-2">
                  mdi-plus-circle-outline
                </v-icon>
                AÑADIR REGISTRO MANUALMENTE
              </v-btn>
              <v-btn
                color="primary"
                @click="$router.push({ name: 'AddRecords' })"
              >
                <v-icon> mdi-plus </v-icon>añadir registros
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <P class="my-2">
              Aquí podrás ver y editar registros que contiene la base de datos.
            </P>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12">
            <v-card outlined>
              <div class="viewMore">
                <v-btn color="primary" text @click="viewMore">
                  {{
                    showMoreDetails
                      ? 'VER MENOS DETALLES '
                      : 'VER MÁS DETALLES '
                  }}
                  <v-icon
                    color="primary"
                    :class="{ rotateOne: showMoreDetails }"
                    class="toggleUpDown ml-2"
                  >
                    mdi-chevron-down
                  </v-icon>
                </v-btn>
              </div>
              <v-row no-gutters class="mx-10 my-6">
                <v-col cols="6">
                  <span class="font-weight-bold">
                    Fecha última actualización:
                  </span>
                  {{ databaseDateLastUpdate }}
                </v-col>
                <v-col cols="6">
                  <span class="font-weight-bold">Fecha de creación:</span>
                  {{ databaseDate }}
                </v-col>
              </v-row>
              <v-row v-if="showMoreDetails" no-gutters class="mx-10 my-6">
                <v-col cols="12">mas informacion</v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <div class="mt-10">
          <div class="viewMore mr-6">
            <v-btn
              color="primary"
              text
              @click="activateCustomFilter = !activateCustomFilter"
              >FILTROS PERSONALIZADOS</v-btn
            >
          </div>
          <v-row no-gutters>
            <v-col cols="12">
              <v-tabs v-model="tab">
                <v-tabs-slider />
                <v-tab> TODOS </v-tab>
                <v-tabs-items v-model="tab">
                  <v-tab-item>
                    <div class="my-2 mt-6">
                      <div v-if="advancedSearchFilter.totalCriterial === 0">
                        <v-btn
                          color="primary"
                          outlined
                          @click="openAdvancedSearchDialog()"
                        >
                          <v-icon> mdi-filter </v-icon>BÚSQUEDA AVANZADA
                        </v-btn>
                      </div>
                      <div v-else>
                        <v-card
                          elevation="0"
                          color="gray100"
                          class="d-flex justify-space-between"
                        >
                          <div>
                            <v-card-text class="py-0">
                              <div class="d-flex flex-wrap">
                                <v-chip
                                  v-for="item in advancedSearchFilter.criterialList"
                                  :key="item.id"
                                  class="ma-2"
                                  close
                                  color="gainsboro"
                                  @click:close="deleteAdvancedSearchItem(item)"
                                >
                                  {{ item.field }}
                                </v-chip>
                              </div>
                            </v-card-text>
                          </div>
                          <div
                            class="d-flex flex-column align-end justify-space-between"
                          >
                            <div class="pt-1 pr-1">
                              <v-icon
                                color="primary"
                                @click="openAdvancedSearchDialog()"
                              >
                                mdi-pencil
                              </v-icon>
                              <v-icon
                                color="primary"
                                class="ml-2"
                                @click="clearAdvancedFilters()"
                              >
                                mdi-delete
                              </v-icon>
                            </div>
                            <div class="pt-0 mt-4">
                              <v-btn
                                v-if="!saveActiveCustomFilter"
                                color="primary"
                                text
                                @click="
                                  saveActiveCustomFilter =
                                    !saveActiveCustomFilter
                                "
                              >
                                GUARDAR COMO FILTRO PERSONALIZADO
                              </v-btn>
                              <div
                                v-if="saveActiveCustomFilter"
                                class="pr-4 pb-4"
                              >
                                <div v-if="!isProcessFinished">
                                  <v-form ref="form" v-model="valid">
                                    <v-text-field
                                      v-model="filterName"
                                      :rules="nameRules"
                                      label="Nombre"
                                      placeholder="Nombre filtro"
                                    />
                                    <div class="d-flex justify-end">
                                      <v-btn
                                        color="grey"
                                        text
                                        @click="
                                          saveActiveCustomFilter =
                                            !saveActiveCustomFilter
                                        "
                                      >
                                        CANCELAR
                                      </v-btn>
                                      <v-btn
                                        :disabled="!valid"
                                        color="primary"
                                        text
                                        class="ml-2"
                                        @click="registerCustomFilters()"
                                      >
                                        GUARDAR
                                      </v-btn>
                                    </div>
                                  </v-form>
                                </div>
                                <div v-else>
                                  <v-icon
                                    :color="finishedProcessIconColor"
                                    class="mr-2"
                                  >
                                    {{ endedProcessIcon }}
                                  </v-icon>
                                  {{ finishedProcessLabel }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </v-card>
                      </div>
                      <database-table-details
                        :loading="loading"
                        :custom-table-data="resultData"
                        :headers="headers"
                        :total-elements="totalElements"
                        @update-list="updateTable"
                      />
                    </div>
                  </v-tab-item>
                </v-tabs-items>
              </v-tabs>
            </v-col>
          </v-row>
        </div>
      </div>
      <div v-else>
        <database-custom-filters
          :custom-table-id="idDatabase"
          :return-label="databaseName"
          :headers-search="headersSearch"
          @return-action="activateCustomFilter = !activateCustomFilter"
        />
      </div>
    </v-col>
    <add-database-row-dialog
      v-model="dialogAdd"
      :show-cancel-btn="showCancelBtn"
      :selected-database="selectedDatabaseAdd"
      :headers="headersTMP"
      @primary-btn-add-action="addRecord()"
    />
    <advanced-search-dialog
      v-model="dialogAdvancedSearch"
      :headers="headersSearch"
      :advanced-search-filter="advancedSearchFilterTMP"
      @btn-filter-action="addFilter()"
      @btn-close-action="closeFilterDialog()"
    />
  </v-container>
</template>

<script>
import permissionsMixin from '@/mixins/permissionsMixin'
import DatabaseTableDetails from '@/components/modules/database/database/DatabaseTableDetails.vue'
import customTableBffMixin from '@/mixins/services/database/customTableBffMixin'
import customTableDataBffMixin from '@/mixins/services/database/customTableDataBffMixin'
import customTableFilterBffMixin from '@/mixins/services/database/customTableFilterBffMixin'
import AddDatabaseRowDialog from '@/components/modules/database/database/AddDatabaseRowDialog.vue'
import validationMixin from '@/mixins/validation/validationMixin'
import DatabaseCustomFilters from '@/components/modules/database/database/DatabaseCustomFilters.vue'
import AdvancedSearchDialog from '@/components/modules/database/database/AdvancedSearchDialog.vue'

export default {
  name: 'DatabasesView',
  components: {
    DatabaseTableDetails,
    AddDatabaseRowDialog,
    DatabaseCustomFilters,
    AdvancedSearchDialog,
  },
  mixins: [
    permissionsMixin,
    customTableBffMixin,
    customTableDataBffMixin,
    customTableFilterBffMixin,
    validationMixin,
  ],
  data() {
    return {
      idAdd: 0,
      loading: false,
      tab: 0,
      showCancelBtn: true,
      idDatabase: '',
      showMoreDetails: false,
      dialogAdd: false,
      dialogAdvancedSearch: false,
      saveActiveCustomFilter: false,
      valid: false,
      databaseName: '',
      databaseDate: '',
      databaseDateLastUpdate: '',
      databaseClient: [],
      headers: [],
      headersTMP: {},
      headersSearch: [],
      customTableData: [],
      totalElements: 0,
      itemsPerPage: 5,
      actualPage: 1,

      resultData: [],
      selectedDatabaseAdd: {},
      advancedSearchFilter: {
        customTableId: 0,
        name: '',
        totalCriterial: 0,
        criterialList: [
          {
            id: 0,
            field: '',
            condition: '',
            value: '',
          },
        ],
      },
      advancedSearchFilterTMP: {},
      filterName: '',
      isProcessFinished: false,
      finishedProcessLabel: '',
      endedProcessIcon: '',
      finishedProcessIconColor: 'greencheck',
      activateCustomFilter: false,
    }
  },
  computed: {
    nameRules() {
      return [(v) => this.isRequired(v, ''), (v) => this.minLength(v, 5)]
    },
  },
  created() {
    this.idDatabase = this.$route.params.id
    this.getRecord()
  },
  methods: {
    async updateTable(event) {
      this.actualPage = event.actualPage
      this.itemsPerPage = event.itemsPerPage
      this.generateSearch()
    },
    async getRecord() {
      this.loading = true
      this.databaseClient = await this.getDatabaseDetailById(this.idDatabase)
      this.databaseName = this.databaseClient.name
      this.databaseDate = this.databaseClient.date
      this.headers = this.databaseClient.headerList
      // TODO: REVISAR header menu
      this.headers.push({
        text: '',
        value: 'menu',
        align: 'd-none',
        width: 0,
        sortable: false,
      })
      this.headers.forEach((header) => {
        if (header.text !== '') {
          this.headersSearch.push(header)
        }
      })
      this.databaseDateLastUpdate = this.databaseClient.dateLastUpdate
      this.loading = false
      this.generateSearch()
    },
    async addRecord() {
      this.selectedDatabaseAdd.customTableId = this.idDatabase
      const newId = await this.createOrEditDatabaseRecord(
        this.selectedDatabaseAdd
      )
      console.log(newId)
      this.generateSearch()

      this.dialogAdd = false
    },
    createRowToInsert() {
      this.selectedDatabaseAdd = {}
      this.headersTMP = {}
      this.headers.forEach((header) => {
        this.selectedDatabaseAdd[header.value] = ''
        this.headersTMP[header.value] = header.text
      })
      this.dialogAdd = true
    },
    viewMore() {
      this.showMoreDetails = !this.showMoreDetails
    },
    openAdvancedSearchDialog() {
      this.advancedSearchFilterTMP = JSON.parse(
        JSON.stringify(this.advancedSearchFilter)
      )
      this.dialogAdvancedSearch = true
    },
    addFilter() {
      this.advancedSearchFilterTMP.totalCriterial =
        this.advancedSearchFilterTMP.criterialList.length
      this.advancedSearchFilter = this.advancedSearchFilterTMP
      this.dialogAdvancedSearch = false
      this.generateSearch()
    },
    closeFilterDialog() {
      this.dialogAdvancedSearch = false
    },
    deleteAdvancedSearchItem(item) {
      const index = this.advancedSearchFilter.criterialList.indexOf(item)
      this.advancedSearchFilter.criterialList.splice(index, 1)
      this.advancedSearchFilter.totalCriterial =
        this.advancedSearchFilter.criterialList.length
      if (this.advancedSearchFilter.criterialList.length === 0) {
        this.advancedSearchFilter.criterialList.push({
          id: 0,
          field: '',
          condition: '',
          value: '',
        })
      }
      this.generateSearch()
    },
    clearAdvancedFilters() {
      this.advancedSearchFilterTMP = {
        customTableId: 0,
        name: '',
        totalCriterial: 0,
        criterialList: [
          {
            id: 0,
            field: '',
            condition: '',
            value: '',
          },
        ],
      }
      this.advancedSearchFilter = this.advancedSearchFilterTMP
      this.generateSearch()
    },
    async generateSearch() {
      this.loading = true

      const searchFilter = {
        customTableId: this.idDatabase,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        critealFilters: [],
      }
      if (this.advancedSearchFilter.criterialList.length >= 1) {
        if (this.advancedSearchFilter.criterialList[0].field !== '') {
          searchFilter.critealFilters = this.advancedSearchFilter.criterialList
        }
      }
      const objDetailsData = await this.getDatabaseDetailsByIdAndCriteria(
        searchFilter
      )
      this.customTableData = await objDetailsData.dataList

      this.resultData = this.customTableData.map(
        // eslint-disable-next-line no-return-assign, no-sequences
        (a) => (
          // eslint-disable-next-line no-sequences
          (a.jsonDataRow.customTableId = this.idDatabase),
          (a.jsonDataRow.id = a.id),
          (a.jsonDataRow.menu = 'menu')
        )
      )
      this.resultData = this.customTableData.map((a) => a.jsonDataRow)

      this.totalElements = await objDetailsData.totalElements
      this.loading = false
    },
    async registerCustomFilters() {
      this.advancedSearchFilter.name = this.filterName
      this.advancedSearchFilter.customTableId = this.idDatabase
      const validation = await this.createCustomFilter(
        this.advancedSearchFilter
      )
      this.isProcessFinished = true
      if (validation !== '') {
        this.endedProcessIcon = 'mdi-check-circle'
        this.finishedProcessIconColor = 'greencheck'
        this.finishedProcessLabel =
          'El filtro se ha creado con éxito en Filtros personalizados.'
      } else {
        this.endedProcessIcon = 'mdi-close-circle'
        this.finishedProcessIconColor = 'error'
        this.finishedProcessLabel =
          'El filtro no se creo con éxito en Filtros personalizados.'
      }
      setTimeout(() => {
        this.filterName = ''
        this.saveActiveCustomFilter = false
        this.isProcessFinished = false
      }, 3000)
    },
  },
}
</script>
<style scoped>
.viewMore {
  position: absolute;
  right: 0;
  z-index: 10;
}
.toggleUpDown {
  transition: transform 0.3s ease-in-out !important;
}

.toggleUpDown.rotateOne {
  transform: rotate(180deg);
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th:last-child {
  position: absolute !important;
  right: -58px;
  padding-top: 15px;
  width: 75px;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td:last-child {
  position: absolute;
  right: 0;
  width: 75px;
}
</style>
