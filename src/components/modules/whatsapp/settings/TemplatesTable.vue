<template>
  <v-container fluid fill-height>
    <v-row no-gutters>
      <v-col cols="12">
        <div class="scrollsettings">
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="templatesList"
            :page.sync="actualPage"
            :items-per-page.sync="itemsPerPage"
            :server-items-length="totalElements"
            :footer-props="{
              'show-current-page': true,
              'show-first-last-page': true,
              'items-per-page-text': 'Elementos por página',
              'items-per-page-options': [5, 10, 15, 20, 25],
            }"
            @update:options="printEvent"
          >
            <template v-slot:top>
              <v-row class="my-3 pl-4 align-center" no-gutters dense>
                <v-col cols="2">
                  <v-text-field
                    v-model="filters.name"
                    label="Nombre"
                    placeholder="Ingresar nombre..."
                    dense
                    hide-details
                  />
                </v-col>
                <v-col class="ml-5" cols="2">
                  <v-text-field
                    v-model="filters.sender"
                    label="Remitente"
                    placeholder="Ingresar remitente..."
                    dense
                    hide-details
                  />
                </v-col>
                <v-col class="ml-5">
                  <v-btn
                    color="error"
                    outlined
                    @click="
                      cleanFilters()
                      $emit('clean-inputs', filters)
                    "
                  >
                    limpiar filtros
                  </v-btn>
                  <v-btn
                    class="ml-5"
                    color="primary"
                    outlined
                    @click="$emit('filter-inputs', filters)"
                  >
                    buscar
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <span v-if="item.status === 0" class="error--text">
                RECHAZADO
              </span>
              <span v-if="item.status === 1" class="success--text">
                VALIDADO
              </span>
              <span v-if="item.status === 2" class="warning--text">
                EN REVISIÓN
              </span>
              <span v-if="item.status === 3" class="gray300--text">
                BORRADOR
              </span>
            </template>
            <template v-slot:[`item.watch`]="{ item }">
              <span class="success--text">
                <v-btn icon color="primary" @click="activateDialog(item)">
                  <v-icon> mdi-eye </v-icon>
                </v-btn>
              </span>
            </template>
            <template v-slot:[`item.menu`]="{ item }">
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon color="primary" v-bind="attrs" v-on="on">
                    <v-icon> mdi-dots-vertical </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="menuItem in menuItemsFiltered(item.status)"
                    :key="menuItem.action"
                    @click="menuActions(item, menuItem.text)"
                  >
                    <div class="d-flex">
                      <v-list-item-icon>
                        <v-icon>{{ menuItem.icon }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
                    </div>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="800">
      <v-card>
        <div>
          <preview-official-template v-if="dialog" :template="itemDialog" />
        </div>
        <v-card-actions class="d-flex justify-center py-6">
          <v-btn class="px-6" color="primary" @click="dialog = !dialog">
            CERRAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <delete-dialog
      v-model="deleteDialog"
      :element-to-delete="itemDialog.id"
      @btn-active-action="deleteTemplateById()"
    />
  </v-container>
</template>

<script>
import PreviewOfficialTemplate from '@/components/modules/whatsapp/campaign/PreviewOfficialTemplate.vue'
import templateBffMixin from '@/mixins/services/whatsapp/templateBffMixin'
import DeleteDialog from '@/components/util/DeleteDialog.vue'

const MENU_ITEMS = [
  { text: 'Duplicar', icon: 'mdi-image-filter-none', statesIncluded: [1, 2] },
  { text: 'Editar', icon: 'mdi-pencil', statesIncluded: [0, 2, 3] },
  { text: 'Eliminar', icon: 'mdi-delete', statesIncluded: [0, 1, 2, 3] },
]
export default {
  name: 'TemplatesTable',
  components: { PreviewOfficialTemplate, DeleteDialog },
  mixins: [templateBffMixin],
  props: {
    templatesList: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    totalElements: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      itemDialog: [],
      deleteDialog: false,
      actualPage: 1,
      itemsPerPage: 5,
      updateListAux: null,
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      filters: { name: null, sender: null },
    }
  },
  methods: {
    menuActions(item, action) {
      if (action === 'Editar') {
        this.$router.push({
          name: 'EditTemplate',
          params: { id: item.id },
        })
      } else if (action === 'Eliminar') {
        this.itemDialog = item
        this.deleteDialog = true
      } else if (action === 'Duplicar') {
        this.duplicateSelectedTemplate(item)
      }
    },
    activateDialog(item) {
      this.dialog = true
      this.itemDialog = item
    },
    menuItemsFiltered(valor) {
      return MENU_ITEMS.filter((item) => item.statesIncluded.includes(valor))
    },
    cleanFilters() {
      this.filters = { name: '', sender: '' }
    },
    async deleteTemplateById() {
      await this.deleteTemplate(this.itemDialog.id)
      this.deleteDialog = false
      await this.$emit('update-list', this.updateListAux)
    },
    async printEvent(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      const updateObject = {
        actualPage: this.actualPage,
        itemsPerPage: this.itemsPerPage,
        sortBy: this.sort.sortBy,
        sortDesc: this.sort.sortDesc,
      }
      this.updateListAux = updateObject
      await this.$emit('update-list', updateObject)
    },
    async duplicateSelectedTemplate(template) {
      await this.duplicateTemplate(template.id)
      await this.$emit('update-list', this.updateListAux)
    },
  },
}
</script>
