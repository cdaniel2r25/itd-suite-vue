<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        v-model="campaign.filter"
        show-select
        :headers="headers"
        :items="filterList"
        single-select
        item-key="id"
        class="elevation-0 accent--text"
        :footer-props="{
          itemsPerPageText: 'Ítems por página',
          pageText: '',
        }"
      >
        <template v-slot:[`item.data-table-select`]="{ isSelected, select }">
          <v-simple-checkbox
            v-ripple
            color="primary"
            :value="isSelected"
            @input="select"
          />
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer />
            <v-dialog
              v-model="dialog"
              overlay-color="white"
              overlay-opacity=".8"
              max-width="40%"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  text
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon class="mr-2">mdi-plus-circle-outline</v-icon>
                  crear filtro
                </v-btn>
              </template>
              <v-card elevation="2" class="pa-5">
                <v-app-bar flat dense color="transparent">
                  <v-spacer />
                  <v-btn x-large color="white" icon @click="close">
                    <v-icon color="accent">mdi-close</v-icon>
                  </v-btn>
                </v-app-bar>
                <edit-custom-filter
                  v-if="dialog"
                  :headers-search="headersSearch"
                  :custom-filters-item-edit="customFiltersItemEdit"
                  :hide-back-button="true"
                  @btn-cancel-action="dialog = false"
                  @add-another-filter="addAnotherFilter()"
                  @btn-register-action="registerCustomFilters($event)"
                />
                <v-card
                  v-if="customTable.headerConfigList"
                  elevation="0"
                  color="white"
                >
                </v-card>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" width="500px">
              <v-card width="100%" class="pt-5 pb-5">
                <v-card-title class="text-h5">
                  <v-spacer />
                  <v-icon large color="warning"> mdi-alert-circle </v-icon>
                  <v-spacer />
                </v-card-title>
                <div class="text-center" style="height: 80px">
                  <span class="text-h6 gray300--text" style="text-align-center">
                    Eliminará el filtro:
                  </span>
                  <span class="text-h6 text-center accent--text">
                    {{ editedFilter.name }}
                  </span>
                </div>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" outlined @click="closeDelete">
                    Cancelar
                  </v-btn>
                  <v-btn color="primary" @click="deleteItemConfirm">
                    Eliminar
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            v-if="item.name !== 'Lista Completa'"
            small
            color="primary"
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-if="item.name !== 'Lista Completa'"
            small
            color="primary"
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-card-text>
            <v-col>
              <span class="text-h7 gray300--text">
                No existen filtros para la base de datos seleccionada.
              </span>
              <span class="text-h7 gray300--text">
                Pinche el botón de "CREAR FILTRO" para añadir uno nuevo.
              </span>
            </v-col>
          </v-card-text>
        </template>
      </v-data-table>
    </v-col>
    <delete-dialog
      v-model="deleteDialogBoolean"
      :element-to-delete="customFiltersItemEdit.name"
      @btn-active-action="deleteFilter()"
    />
  </v-row>
</template>

<script>
import generalMixin from '@/mixins/util/generalMixin'
import validationMixin from '@/mixins/validation/validationMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import customTableFilterBffMixin from '@/mixins/services/database/customTableFilterBffMixin'
import EditCustomFilter from '@/components/modules/database/database/EditCustomFilter.vue'
import DeleteDialog from '@/components/util/DeleteDialog.vue'

export default {
  name: 'DatabaseFilterForm',
  components: { EditCustomFilter, DeleteDialog },
  mixins: [
    adminBffMixin,
    generalMixin,
    validationMixin,
    customTableFilterBffMixin,
  ],

  props: {
    customTable: {
      type: Object,
      default: () => ({}),
    },
    filterList: {
      type: Array,
      default: () => [],
    },
    campaign: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isFormValid: false,
      deleteDialogBoolean: false,
      filterToSend: {
        customTableId: 0,
        id: null,
        name: '',
        totalCriterial: 0,
        criterialList: [
          {
            id: null,
            field: '',
            condition: '',
            value: '',
          },
        ],
      },
      customFiltersItemEdit: {
        criterialList: [
          {
            condition: '',
            field: '',
            id: null,
            value: '',
          },
        ],
        customTableId: this.campaign.database.id,
        id: null,
        name: '',
        totalCriterial: 1,
      },
      conditions: [
        'Es igual a',
        'Contiene',
        'Empieza con',
        'Termina con',
        'Mayor a',
        'Menor a',
      ],
      editedIndex: -1,
      dialog: false,
      dialogDelete: false,
      activeFilterList: true,
      editedFilter: {
        id: null,
        name: '',
        field: '',
        condition: '',
        value: '',
      },
      defaultFilter: {
        id: null,
        name: '',
        field: '',
        condition: '',
        value: '',
      },
      singleSelect: false,
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: '', value: 'actions', sortable: false, align: 'end' },
      ],
    }
  },
  computed: {
    headersSearch() {
      if (
        this.campaign.database.headerConfigList &&
        this.campaign.database.headerConfigList.length > 0
      ) {
        return this.campaign.database.headerConfigList.map((header) => ({
          text: header.text,
          value: header.value,
        }))
      }
      return []
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Crear filtro' : 'Editar filtro'
    },
    subTitle() {
      return this.editedIndex === -1
        ? 'Ingresa un nombre y completa campos para crear un nuevo filtro'
        : 'Modifica los valores registrados'
    },
    nameRules() {
      return [(v) => this.isRequired(v, 'Nombre'), (v) => this.minLength(v, 3)]
    },
    fieldRules() {
      return [(v) => this.isRequired(v, 'Campo')]
    },
    conditionRules() {
      return [(v) => this.isRequired(v, 'Condición')]
    },
    valueRules() {
      return [(v) => this.isRequired(v, 'Valor'), (v) => this.minLength(v, 1)]
    },
  },
  watch: {
    dialog: {
      handler(val) {
        if (!val) {
          this.close()
          this.createCustomFilterNew()
        }
      },
    },
    deleteDialogBoolean: {
      handler(val) {
        if (!val) {
          this.createCustomFilterNew()
        }
      },
    },
    dialogDelete(val) {
      if (!val) this.closeDelete()
    },
    'campaign.database.id': {
      handler() {
        this.campaign.filter = []
      },
    },
  },
  methods: {
    submitFilterForm() {
      if (
        this.editedFilter.name !== null &&
        this.editedFilter.name !== undefined &&
        this.editedFilter.name !== '' &&
        this.editedFilter.field !== null &&
        this.editedFilter.field !== undefined &&
        this.editedFilter.field !== '' &&
        this.editedFilter.condition !== null &&
        this.editedFilter.condition !== undefined &&
        this.editedFilter.condition !== '' &&
        this.editedFilter.value !== null &&
        this.editedFilter.value !== undefined &&
        this.editedFilter.value !== ''
      ) {
        const customTableFilter = this.editedFilter
        console.log(customTableFilter)
        // TODO: when adminBff refactor is finished send customTableFilter to adminBff to add a filter to selected database
      }
    },
    editItem(item) {
      this.customFiltersItemEdit = item
      this.dialog = true
    },

    deleteItem(item) {
      this.customFiltersItemEdit = structuredClone(item)
      this.deleteDialogBoolean = true
    },

    async deleteItemConfirm() {
      await this.deleteCustomFilter(this.customTable, this.editedFilter.id)
      this.filterList.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      // TODO: check nextTick use
      this.$nextTick(() => {
        this.editedFilter = { ...this.defaultFilter }
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      // TODO: check nextTick use
      this.$nextTick(() => {
        this.editedFilter = { ...this.defaultFilter }
        this.editedIndex = -1
      })
    },

    async save() {
      if (this.editedIndex > -1) {
        this.filterList[this.editedIndex].id = this.editedFilter.id
        this.filterList[this.editedIndex].name = this.editedFilter.name
        this.filterList[this.editedIndex].field = this.editedFilter.field
        this.filterList[this.editedIndex].condition =
          this.editedFilter.condition
        this.filterList[this.editedIndex].value = this.editedFilter.value
      }
      const customFiltersItemEdit = {
        id: this.editedFilter.id,
        customTableId: this.customTable.id,
        name: this.editedFilter.name,
        totalCriterial: 1,
        criterialList: [
          {
            id: 0,
            field: this.editedFilter.field,
            condition: this.editedFilter.condition,
            value: this.editedFilter.value,
          },
        ],
      }
      await this.createCustomFilter(customFiltersItemEdit)
      // TODO: después de cargar, actualizar la lista principal
      this.filterList.push(this.editedFilter)
      this.close()
    },
    createCustomFilterNew() {
      const customFiltersItemTMP = {
        id: null,
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
      // this.editTitle = 'Crear filtro personalizado'
      // this.editSubTitle = 'Ingresa los datos para crear nuevo filtro.'
      // this.labelButton = 'CREAR'
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
    async registerCustomFilters(customFilterAux) {
      customFilterAux.customTableId = this.campaign.database.id
      await this.createCustomFilter(customFilterAux)
      this.dialog = false
      this.$emit('update-data')
    },
    clearFilterObject() {
      this.filterToSend = {
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
    },
    updateObjectByAnotherObject(target, src) {
      const res = {}
      Object.keys(target).forEach((k) => {
        res[k] = src[k] ?? target[k]
      })
      return res
    },
    async deleteFilter() {
      // eslint-disable-next-line no-unused-vars
      const validated = await this.deleteCustomFilter(
        this.customFiltersItemEdit.customTable.id,
        this.customFiltersItemEdit.id
      )
      this.deleteDialogBoolean = false
      this.$emit('update-data')
    },
  },
}
</script>
<style scoped>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.06) !important;
}
tbody tr:hover:nth-of-type(odd) {
  background-color: var(--v-gray-base) !important;
}
</style>
