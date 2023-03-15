<template>
  <v-container class="pa-10" fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="8">
          <span class="text-h4">Listas de contactos</span>
        </v-col>
        <v-spacer />
        <v-col cols="4" class="pr-10" style="text-align: right">
          <v-btn
            color="primary"
            elevation="0"
            @click="createContactDialog = true"
          >
            <v-icon class="mr-2" dark> mdi-plus </v-icon>Crear Lista
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mt-5" no-gutters>
        <v-col cols="12" class="mb-5">
          <span class="subtitle-1">
            Aquí podrás ver campañas realizadas y crear una nueva!.
          </span>
        </v-col>
        <v-col>
          <v-tabs
            v-model="selectedTab"
            color="primary"
            show-arrows
            grow
            style="width: 90%"
          >
            <v-tab
              v-for="item in tabsHeaders"
              :key="item"
              class="justify-start"
            >
              {{ item }}
            </v-tab>
          </v-tabs>
          <v-container fluid>
            <v-row class="mt-5">
              <v-col class="mr-2" sm="6" md="2" lg="2" xl="2">
                <v-text-field
                  v-model="searchName"
                  label="Nombre"
                  placeholder="Ingresar nombre"
                  persistent-placeholder
                  dense
                />
              </v-col>
              <v-col sm="6" md="8" lg="8" xl="6" class="mt-0">
                <date-picker-calendar v-model="selectedDate" />
              </v-col>
              <v-col class="ml-5" cols="2">
                <v-btn outlined color="primary" @click="getContactsLists()">
                  Buscar
                </v-btn>
              </v-col>
            </v-row>
            <div>
              <v-data-table
                class="striped-table"
                :loading="loading"
                :headers="datableHeaders"
                :items="contactslists"
                :total-elements="totalElements"
                :page.sync="actualPage"
                :items-per-page.sync="itemsPerPage"
                :server-items-length="totalElements"
                :footer-props="{
                  'show-current-page': true,
                  'show-first-last-page': true,
                  'items-per-page-text': 'Elementos por página',
                  'items-per-page-options': [5, 10, 15, 20, 25],
                }"
                @update:options="updateTable"
              >
                <template v-slot:no-data>
                  <v-card-text>
                    <v-col>
                      <span class="text-h7 gray300--text">
                        No se han creado listas de contactos.
                      </span>
                    </v-col>
                  </v-card-text>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn dark icon v-bind="attrs" v-on="on">
                        <v-icon small color="primary" class="mr-2">
                          mdi-dots-vertical
                        </v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item
                        v-for="(mitem, i) in getMenuActionsList()"
                        :key="i"
                        @click="menuAction(item, mitem.title)"
                      >
                        <v-list-item-title>
                          {{ mitem.title }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </div>
          </v-container>
        </v-col>
      </v-row>
    </v-col>
    <delete-dialog
      v-model="deleteDialog"
      :element-to-delete="contactslistAux.name"
      @btn-active-action="deleteContactsLists()"
    />
    <div class="text-center">
      <v-dialog v-model="createContactDialog" width="600">
        <v-card class="pa-15">
          <v-card-title
            class="text-h5 justify-center mb-10 accent--text"
            style="font-weight: 400"
          >
            Crear Lista
          </v-card-title>

          <v-card-text>
            <v-col cols="12">
              <v-text-field
                label="Nombre"
                placeholder="Ingresar nombre"
                persistent-placeholder
                outlined
              />
            </v-col>
          </v-card-text>

          <v-card-actions class="mt-5">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="mr-5 pa-5"
              outlined
              elevation="0"
              @click="createContactDialog = false"
            >
              cancelar
            </v-btn>
            <v-btn
              color="primary"
              class="pa-5"
              elevation="0"
              @click="createContactDialog = false"
            >
              crear
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '@/mixins/permissionsMixin'
import DeleteDialog from '@/components/util/DeleteDialog.vue'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import DatePickerCalendar from '@/components/util/DatePickerCalendar.vue'
import dateMixin from '@/mixins/util/dateMixin'

const CONTACTSLISTS_MENU_STATUS_ARRAYS = {
  0: [{ title: 'Editar' }, { title: 'Eliminar' }],
}
export default {
  name: 'ContactsLists',
  components: { DatePickerCalendar, DeleteDialog },
  mixins: [permissionsMixin, adminBffMixin, dateMixin],
  data() {
    return {
      selectedTab: null,
      editContactlistItem: {},
      loading: false,
      contactslists: [],
      searchName: '',
      search: null,
      datefilter: null,
      deleteDialog: false,
      selectedDate: null,
      scheduledFilter: false,
      contactslistAux: {},
      dates: [],
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      totalElements: 0,
      itemsPerPage: 5,
      actualPage: 1,
      menu: false,
      tabsHeaders: ['LISTAS'],
      datableHeaders: [
        { text: 'Nombre', value: 'name' },
        { text: 'N° de contactos', value: 'rowsCount' },
        { text: 'Fecha de creación', value: 'createdAt' },
        { text: 'Acciones', value: 'actions', sortable: false, align: 'end' },
      ],
      createContactDialog: false,
      createContactAssign: false,
      selectedContactsList: [],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  methods: {
    async getContactsLists() {
      let name = '-1'
      let sortBy = '-1'
      let sortDesc = '-1'
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      if (this.searchName !== '') {
        name = this.searchName
      }
      if (this.selectedDate)
        this.selectedDate = this.sortDateRangeToArray(
          this.selectedDate[0],
          this.selectedDate[1]
        )
      const params = {
        clientId: this.clientId,
        name,
        date: this.selectedDate,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }
      const contactslistsTMP = await this.getContactsListsByClient(params)
      this.contactslists = contactslistsTMP.dataList
      this.totalElements = contactslistsTMP.totalElements
    },
    menuAction(item, action) {
      this.contactslistAux = item
      if (action === 'Eliminar') {
        this.deleteDialog = true
      } else if (action === 'Editar') {
        this.editContactlistItem = structuredClone(item)
      }
    },
    async deleteContactsLists() {
      await this.getContactsLists()
    },
    async updateTable(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      await this.getContactsLists()
    },
    getMenuActionsList() {
      return CONTACTSLISTS_MENU_STATUS_ARRAYS[0]
    },
    cleanPagination() {
      this.totalElements = 0
      this.itemsPerPage = 5
      this.actualPage = 1
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
