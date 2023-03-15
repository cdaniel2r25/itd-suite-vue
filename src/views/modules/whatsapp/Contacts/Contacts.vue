<template>
  <v-container class="pa-10" fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters class="justify-space-between">
        <div>
          <span class="text-h4">Contactos</span>
        </div>
        <v-spacer />
        <div class="pr-10" style="text-align: right">
          <v-btn
            color="primary"
            class="mr-5"
            elevation="0"
            text
            @click="$router.push({ name: 'ImportContacts' })"
          >
            <v-icon class="mr-2" dark> mdi-plus-circle-outline </v-icon>
            Importar Contactos
          </v-btn>
          <v-btn
            color="primary"
            elevation="0"
            @click="createContactDialog = true"
          >
            <v-icon class="mr-2" dark> mdi-plus </v-icon>Crear Contacto
          </v-btn>
        </div>
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
          <v-row class="mt-8">
            <v-col cols="12" class="d-flex flex-row">
              <div class="mr-5">
                <v-text-field
                  v-model="searchPhone"
                  label="Teléfono"
                  placeholder="Ingresar teléfono"
                  persistent-placeholder
                  dense
                />
              </div>
              <div class="mr-2" sm="6" md="2" lg="2" xl="2">
                <v-text-field
                  v-model="searchName"
                  label="Nombre"
                  placeholder="Ingresar nombre"
                  persistent-placeholder
                  dense
                />
              </div>
              <div class="ml-5">
                <v-btn outlined color="primary" @click="getContacts()">
                  Buscar
                </v-btn>
              </div>
            </v-col>
            <v-col cols="12">
              <v-data-table
                class="striped-table"
                :loading="loading"
                :headers="datableHeaders"
                :items="contacts"
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
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <delete-dialog
      v-model="deleteDialog"
      :element-to-delete="contactAux.name"
      @btn-active-action="deleteContact()"
    />
    <div class="text-center">
      <v-dialog v-model="createContactDialog" width="600">
        <v-card class="pa-15">
          <v-card-title class="text-h5 justify-center mb-10">
            Crear contacto
          </v-card-title>

          <v-card-text>
            <v-col cols="12">
              <v-text-field
                v-model="newContact.phone"
                label="Teléfono"
                placeholder="+56988889999"
                persistent-placeholder
                outlined
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newContact.name"
                label="Nombre"
                placeholder="Ingresar nombre"
                persistent-placeholder
                outlined
              />
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="createContactAssign"
                label="Asignar contactos a una o más listas existentes."
              />
            </v-col>
            <v-expand-transition>
              <v-col v-if="createContactAssign">
                <v-select
                  v-model="newContact.selectedContactsList"
                  :items="contactsLists"
                  return-object
                  item-value="id"
                  item-text="name"
                  label="Lista de contactos"
                  placeholder="Seleccionar lista(s)"
                  persistent-placeholder
                  multiple
                >
                  <template v-slot:selection="{ item }">
                    <div
                      v-if="newContact.selectedContactsList.indexOf(item) < 1"
                      class="accent--text"
                    >
                      Seleccionar lista(s)
                    </div>
                  </template>
                </v-select>
              </v-col>
            </v-expand-transition>
            <v-expand-transition>
              <v-col
                v-if="newContact.selectedContactsList.length"
                class="overflow-y-auto"
                style="max-height: 100px"
              >
                <v-chip
                  v-for="contactList in newContact.selectedContactsList"
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
              @click="createContact()"
            >
              crear
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="text-center">
      <v-dialog v-model="editContactDialog" width="600">
        <v-card v-if="editContactItem !== null" class="pa-15">
          <v-card-title class="text-h5 justify-center mb-10">
            Editar contacto
          </v-card-title>

          <v-card-text>
            <v-col cols="12">
              <v-text-field
                v-model="editContactItem.phone"
                label="Teléfono"
                placeholder="+56988889999"
                persistent-placeholder
                outlined
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editContactItem.name"
                label="Nombre"
                placeholder="Ingresar nombre"
                persistent-placeholder
                outlined
              />
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="editContactAssign"
                label="Asignar contactos a una o más listas existentes."
              />
            </v-col>
            <v-expand-transition>
              <v-col v-if="editContactAssign">
                <v-select
                  v-model="editContactItem.selectedContactsList"
                  :items="contactsLists"
                  return-object
                  item-value="id"
                  item-text="name"
                  label="Lista de contactos"
                  placeholder="Seleccionar lista(s)"
                  persistent-placeholder
                  multiple
                >
                  <template v-slot:selection="{ item }">
                    <div
                      v-if="
                        editContactItem.selectedContactsList.indexOf(item) < 1
                      "
                      class="accent--text"
                    >
                      Seleccionar lista(s)
                    </div>
                  </template>
                </v-select>
              </v-col>
            </v-expand-transition>
            <v-expand-transition>
              <v-col
                v-if="
                  editContactItem.selectedContactsList !== undefined &&
                  editContactItem.selectedContactsList.length
                "
                class="overflow-y-auto"
                style="max-height: 100px"
              >
                <v-chip
                  v-for="contactList in editContactItem.selectedContactsList"
                  :key="contactList.id"
                  color="success"
                  class="ma-2"
                  close
                  @click:close="removeEditingContactList(contactList)"
                >
                  <v-icon class="mr-2">mdi-check</v-icon>
                  {{ contactList.name }}
                </v-chip>
              </v-col>
            </v-expand-transition>
          </v-card-text>

          <v-card-actions class="mt-5">
            <v-spacer />
            <v-btn
              color="primary"
              class="mr-5 pa-5"
              outlined
              elevation="0"
              @click="editContactDialog = false"
            >
              cancelar
            </v-btn>
            <v-btn
              color="primary"
              class="pa-5"
              elevation="0"
              @click="editContact()"
            >
              guardar
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '@/mixins/permissionsMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import DeleteDialog from '@/components/util/DeleteDialog.vue'
import dateMixin from '@/mixins/util/dateMixin'

const CONTACT_MENU_STATUS_ARRAYS = {
  0: [{ title: 'Editar' }, { title: 'Eliminar' }],
}
export default {
  name: 'Contacts',
  components: { DeleteDialog },
  mixins: [permissionsMixin, dateMixin, adminBffMixin],
  data() {
    return {
      selectedTab: null,
      editContactAssign: false,
      editContactDialog: false,
      editContactItem: null,
      loading: false,
      contacts: [],
      searchName: '',
      searchPhone: '',
      deleteDialog: false,
      contactAux: {},
      newContact: {
        name: '',
        phone: '',
        selectedContactsList: [],
      },
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      totalElements: 0,
      itemsPerPage: 5,
      actualPage: 1,
      menu: false,
      tabsHeaders: ['TABLA DE CONTACTOS'],
      datableHeaders: [
        { text: 'Teléfono', value: 'phone' },
        { text: 'Nombre', value: 'name' },
        { text: 'Fecha de creacion', value: 'createdAt' },
        { text: 'Acciones', value: 'actions', sortable: false, align: 'end' },
      ],
      createContactDialog: false,
      createContactAssign: false,
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
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  methods: {
    async getContacts() {
      this.loading = true
      let name = '-1'
      let phone = '-1'
      let sortBy = '-1'
      let sortDesc = '-1'
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      if (this.searchName !== '') {
        name = this.searchName
      }
      if (this.searchPhone !== '') {
        phone = this.searchPhone
      }
      const params = {
        clientId: this.clientId,
        name,
        phone,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }
      const contactsTMP = await this.getContactsByClient(params)
      this.contacts = contactsTMP.dataList
      this.totalElements = contactsTMP.totalElements
      this.loading = false
    },
    menuAction(item, action) {
      this.contactAux = item
      if (action === 'Eliminar') {
        this.deleteDialog = true
      } else if (action === 'Editar') {
        this.editContactItem = structuredClone(item)
        this.editContactDialog = true
      }
    },
    async editContact() {
      await this.editSingleContact(this.editContactItem)
      this.editContactDialog = false
      this.editContactItem = null
      await this.getContacts()
    },
    async deleteContact() {
      await this.deleteContactById(this.contactAux.id)
      this.deleteDialog = false
      this.getContacts()
    },
    async updateTable(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      await this.getContacts()
    },
    getMenuActionsList() {
      return CONTACT_MENU_STATUS_ARRAYS[0]
    },
    cleanPagination() {
      this.totalElements = 0
      this.itemsPerPage = 5
      this.actualPage = 1
    },
    cleanDialog() {
      this.newContact = {
        name: '',
        phone: '',
        selectedContactsList: [],
      }
    },
    removeContactList(contactList) {
      const index = this.newContact.selectedContactsList.indexOf(contactList)
      if (index > -1) {
        this.newContact.selectedContactsList.splice(index, 1)
      }
    },
    removeEditingContactList(contactList) {
      const index =
        this.editContactItem.selectedContactsList.indexOf(contactList)
      if (index > -1) {
        this.editContactItem.selectedContactsList.splice(index, 1)
      }
    },
    async createContact() {
      await this.createSingleContact(this.newContact)
      this.cleanDialog()
      await this.getContacts()
      this.createContactDialog = false
    },
  },
}
</script>
