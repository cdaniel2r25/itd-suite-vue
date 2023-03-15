<template>
  <div>
    <div v-if="activeFilterList">
      <v-row no-gutters>
        <v-col cols="12">
          <v-btn
            text
            color="primary"
            class="px-0"
            @click="$emit('return-action')"
          >
            <v-icon color="primary"> mdi-arrow-left </v-icon>
            VOLVER A {{ returnLabel }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-4">
        <v-col cols="5">
          <h1>Filtros personalizados</h1>
        </v-col>
        <v-col cols="7">
          <div class="d-flex justify-end">
            <v-btn color="primary" @click="createCustomFilterNew()">
              <v-icon> mdi-plus </v-icon>CREAR FILTRO PERSONALIZADO
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <P class="my-2">
            Aquí podrás ver filtros creados para la base de datos.
          </P>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-10">
        <v-col cols="12">
          <v-tabs v-model="tab">
            <v-tabs-slider />
            <v-tab> TODOS </v-tab>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-row no-gutters>
                  <v-col md="6" sm="12">
                    <v-text-field
                      v-model="filterName"
                      label="Buscar por nombre"
                      placeholder="Busca por nombre de filtro"
                      @change="actionSearchByName()"
                    />
                  </v-col>
                </v-row>

                <custom-filters-table
                  v-model="customFiltersItem"
                  :loading="loading"
                  :custom-table-data="customTableDataTMP"
                  :headers="headers"
                  :total-elements="totalElements"
                  @update-list="updateTable"
                  @btn-edit-action="editItem()"
                  @btn-delete-action="dialogDelete = !dialogDelete"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <edit-custom-filter
        :edit-title="editTitle"
        :edit-sub-title="editSubTitle"
        :headers-search="headersSearch"
        :custom-filters-item-edit="customFiltersItemEdit"
        @btn-cancel-action="activeFilterList = !activeFilterList"
        @add-another-filter="addAnotherFilter()"
        @btn-register-action="registerCustomFilter($event)"
      />
    </div>
    <base-dialog
      v-model="dialogDelete"
      text-alert="¿Está seguro de eliminar registro?"
      primary-btn-text="Sí, Eliminar"
      @primary-btn-action="deleteItem()"
    />
  </div>
</template>

<script>
import CustomFiltersTable from '@/components/modules/database/database/CustomFiltersTable.vue'
import validationMixin from '@/mixins/validation/validationMixin'
import BaseDialog from '@/components/util/BaseDialog.vue'
import EditCustomFilter from '@/components/modules/database/database/EditCustomFilter.vue'
import customTableFilterBffMixin from '@/mixins/services/database/customTableFilterBffMixin'

export default {
  name: 'DatabaseCustomFilters',
  components: { CustomFiltersTable, BaseDialog, EditCustomFilter },
  mixins: [customTableFilterBffMixin, validationMixin],
  props: {
    returnLabel: {
      type: String,
      default: '',
    },
    customTableId: {
      type: String,
      default: '',
    },
    headersSearch: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      customFiltersList: [],
      customFiltersItem: {},
      customTableDataTMP: [],
      customFiltersItemEdit: {},
      filterName: '',
      activeFilterList: true,
      loading: false,
      dialogDelete: false,
      tab: 0,
      totalElements: 0,
      itemsPerPage: 5,
      actualPage: 1,
      headers: [
        { text: 'Nombre', align: 'start', value: 'name', sortable: false },
        { text: 'Nº de filtros', value: 'totalCriterial', sortable: false },
        { text: ' ', align: 'right', value: 'menu', sortable: false },
      ],
      editTitle: 'Editar filtro personalizado',
      editSubTitle: 'Ingresa los datos para crear nuevo filtro.',
      labelButton: 'GUARDAR',
    }
  },
  methods: {
    async updateTable(event) {
      this.actualPage = event.actualPage
      this.itemsPerPage = event.itemsPerPage
      this.generateSearch()
    },
    async generateSearch() {
      this.loading = true

      const searchFilter = {
        customTableId: this.customTableId,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
      }
      const objDetailsData = await this.getDatabaseCustomFiltersById(
        searchFilter
      )
      this.customFiltersList = await objDetailsData.dataList
      this.customTableDataTMP = this.customFiltersList
      this.totalElements = await objDetailsData.totalElements
      this.loading = false
    },
    createCustomFilterNew() {
      const customFiltersItemTMP = {
        id: '',
        customTableId: this.customTableId,
        name: '',
        totalCriterial: 1,
        criterialList: [
          {
            id: 0,
            field: '',
            condition: '',
            value: '',
          },
        ],
      }
      this.customFiltersItemEdit = customFiltersItemTMP
      this.editTitle = 'Crear filtro personalizado'
      this.editSubTitle = 'Ingresa los datos para crear nuevo filtro.'
      this.labelButton = 'CREAR'
      this.activeFilterList = false
    },
    addAnotherFilter() {
      const idAddRecords =
        this.customFiltersItemEdit.criterialList[
          this.customFiltersItemEdit.criterialList.length - 1
        ].id + 1
      const itemTMP = {
        id: idAddRecords,
        field: '',
        condition: '',
        value: '',
      }
      this.customFiltersItemEdit.criterialList.push(itemTMP)
      this.customFiltersItemEdit.totalCriterial =
        this.customFiltersItemEdit.criterialList.length
    },
    actionSearchByName() {
      this.customTableDataTMP = this.customFiltersList
      if (this.filterName !== '') {
        this.customTableDataTMP = this.customTableDataTMP.filter(
          (e) => e.name.toLowerCase() === this.filterName.toLowerCase()
        )
      }
    },
    editItem() {
      const customFiltersItemTMP = this.customFiltersItem
      this.customFiltersItemEdit = JSON.parse(
        JSON.stringify(customFiltersItemTMP)
      )
      this.editTitle = 'Editar filtro personalizado'
      this.editSubTitle = 'Ingresa los datos para editar el filtro.'
      this.labelButton = 'GUARDAR'
      this.activeFilterList = false
    },
    async deleteItem() {
      // eslint-disable-next-line no-unused-vars
      const validated = await this.deleteCustomFilter(
        this.customTableId,
        this.customFiltersItem.id
      )
      this.generateSearch()
      this.dialogDelete = false
    },
    async registerCustomFilter(customFilterAux) {
      Object.assign(customFilterAux, this.customFiltersItemEdit)
      const obj = await this.createCustomFilter(this.customFiltersItemEdit)
      if (this.customFiltersItemEdit.id === '') {
        this.customFiltersItemEdit.id = obj.id
        this.customTableDataTMP.push(this.customFiltersItemEdit)
      } else {
        const index = this.customTableDataTMP.findIndex(
          (t) => t.id === this.customFiltersItemEdit.id
        )
        this.customTableDataTMP[index].name = this.customFiltersItemEdit.name
        this.customTableDataTMP[index].totalCriterial =
          this.customFiltersItemEdit.totalCriterial
        this.customTableDataTMP[index].criterialList =
          this.customFiltersItemEdit.criterialList
      }
      this.activeFilterList = true
    },
  },
}
</script>
<style scoped>
.icon-delete {
  position: absolute;
  right: -6px;
  top: 2px;
}
</style>
