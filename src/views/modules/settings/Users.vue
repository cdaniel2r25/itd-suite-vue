<template>
  <v-container fluid>
    <v-col cols="12">
      <h1 style="font-weight: 500; font-size: 2rem">Usuarios</h1>
      <v-btn
        v-if="can('CREATE_USERS', 'settings')"
        depressed
        style="float: right"
        color="primary"
        @click="
          $router.push({
            name: 'CreateUser',
          })
        "
      >
        <v-icon left> mdi-plus </v-icon>
        CREAR USUARIO
      </v-btn>
      <div class="align-center pt-8">
        <p>Buscar un usuario por filtros</p>
        <v-row class="mt-4">
          <v-col md="2" sm="12">
            <v-text-field
              v-model="searchName"
              label="Nombre"
              placeholder="Ingresar nombre"
              hide-details
            />
          </v-col>
          <v-col md="2" sm="12" xs="12">
            <v-combobox
              v-model="searchClient"
              :items="clients"
              clearable
              item-text="name"
              label="Cliente"
              placeholder="Puedes escribir el cliente que buscas"
            />
          </v-col>
          <v-col>
            <v-btn
              class="ml-5 mt-3"
              color="primary"
              outlined
              @click="getUsers()"
            >
              Buscar
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <div class="mt-2">
      <v-skeleton-loader v-if="skeletonLoader" type="table" />
      <v-data-table
        v-else
        class="striped-table"
        :loading="loading"
        :headers="headers"
        :items="usersList"
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
        <template v-slot:[`item.metadata.app_metadata.isEnabled`]="{ item }">
          <v-icon v-if="item.metadata.app_metadata.isEnabled" color="success">
            mdi-check
          </v-icon>
          <v-icon v-else color="error"> mdi-close </v-icon>
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
                v-for="(mitem, i) in menuItems"
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
    <delete-dialog
      v-model="deleteDialog"
      :element-to-delete="userAux.name"
      @btn-active-action="deleteUser()"
    />
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import DeleteDialog from '@/components/util/DeleteDialog.vue'

export default {
  name: 'Users',
  components: { DeleteDialog },
  mixins: [adminBffMixin, permissionsMixin],
  data() {
    return {
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Correo', value: 'email' },
        { text: 'Cliente', value: 'client.name' },
        { text: 'Habilitado', value: 'metadata.app_metadata.isEnabled' },
        { text: 'Acciones', value: 'actions' },
      ],
      menuItems: [{ title: 'Editar' }, { title: 'Eliminar' }],
      skeletonLoader: false,
      clients: [],
      deleteDialog: false,
      userAux: {},
      loading: false,
      usersList: [],
      searchName: '',
      searchClient: '',
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      totalElements: 0,
      itemsPerPage: 5,
      actualPage: 1,
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  async mounted() {
    this.skeletonLoader = true
    this.getInitInfo()
    this.getUsers()
    this.skeletonLoader = false
  },
  methods: {
    goToModuleView(route) {
      this.$router.push(route)
    },
    async getInitInfo() {
      const initResponse = await this.getUsersInit()
      this.clients = initResponse.clientList
    },
    async getUsers() {
      this.loading = true
      let name = '-1'
      let client = '-1'
      let sortBy = '-1'
      let sortDesc = '-1'
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      if (this.searchName !== '') {
        name = this.searchName
      }
      if (this.searchClient) {
        client = this.searchClient.id
      }
      const params = {
        clientId: client,
        name,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }
      const usersResponse = await this.getUsersFiltered(params)
      this.usersList = usersResponse.dataList
      this.totalElements = usersResponse.totalElements
      this.loading = false
    },
    menuAction(item, action) {
      if (action === 'Editar') {
        this.$router.push({
          name: 'EditUser',
          params: { id: item.metadata.user_id },
        })
      } else if (action === 'Eliminar') {
        this.userAux = item
        this.deleteDialog = true
      }
    },
    async deleteUser() {
      await this.deleteUserById(this.userAux.id)
      this.cleanPagination()
      this.deleteDialog = false
      this.getUsers()
    },
    cleanPagination() {
      this.sort = {
        sortBy: '',
        sortDesc: false,
      }
      this.totalElements = 0
      this.itemsPerPage = 5
      this.actualPage = 1
    },
    cleanFilters() {
      if (this.searchName !== '' || this.searchClient !== null) {
        this.searchName = ''
        this.searchClient = null
        this.cleanPagination()
        this.getInitInfo()
        this.getUsers()
      }
    },
    async updateTable(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      await this.getUsers()
    },
  },
}
</script>
