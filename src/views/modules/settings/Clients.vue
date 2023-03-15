<template>
  <v-container fluid>
    <v-col cols="12">
      <h1 style="font-weight: 500; font-size: 2rem">Clientes</h1>
      <v-btn
        v-if="can('CREATE_CLIENTS', 'settings')"
        depressed
        style="float: right"
        color="primary"
        @click="
          $router.push({
            name: 'CreateClient',
          })
        "
      >
        <v-icon left> mdi-plus </v-icon>
        CREAR CLIENTE
      </v-btn>
      <div class="align-center pt-8">
        <p>
          Aquí podrás encontrar el listado de clientes y crear nuevos clientes
        </p>
        <v-row class="mt-4">
          <v-col cols="3">
            <v-text-field
              v-model="searchName"
              label="Nombre"
              placeholder="Ingresar nombre"
              hide-details
            />
          </v-col>
          <v-col cols="3">
            <v-btn class="mt-3" color="primary" outlined @click="getClients()">
              buscar
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
        :items="clientsList"
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
        <template v-slot:[`item.disabled`]="{ item }">
          <v-icon v-if="!item.disabled" color="success"> mdi-check </v-icon>
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
      :element-to-delete="clientAux.name"
      @btn-active-action="deleteClient()"
    />
  </v-container>
</template>

<script>
import adminBffMixin from '@/mixins/services/adminBffMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import DeleteDialog from '@/components/util/DeleteDialog.vue'

export default {
  name: 'Clients',
  components: { DeleteDialog },
  mixins: [adminBffMixin, permissionsMixin],
  data() {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'legalName',
        },
        { text: 'Correo', value: 'email' },
        { text: 'Reseller', value: 'reseller.name' },
        { text: 'Estado', value: 'disabled' },
        { text: 'Acciones', value: 'actions' },
      ],
      loading: false,
      skeletonLoader: false,
      clientsList: [],
      searchName: '',
      menuItems: [{ title: 'Editar' }, { title: 'Eliminar' }],
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      totalElements: 0,
      itemsPerPage: 5,
      actualPage: 1,
      clientAux: {},
      deleteDialog: false,
    }
  },
  computed: {
    filteredClientsList() {
      return this.clientsList.filter((client) => {
        if (!this.searchName) return true
        return client.legalName
          .toLowerCase()
          .includes(this.searchName.toLowerCase())
      })
    },
  },
  async mounted() {
    this.skeletonLoader = true
    this.getClients()
    this.skeletonLoader = false
  },
  methods: {
    async getClients() {
      this.loading = true
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
      const params = {
        name,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }
      const clientResponse = await this.getClientList(params)
      this.clientsList = clientResponse.dataList
      this.totalElements = clientResponse.totalElements
      this.loading = false
    },
    menuAction(item, action) {
      console.log(item)
      if (action === 'Editar') {
        this.$router.push({
          name: 'EditClient',
          params: { id: item.id },
        })
      } else if (action === 'Eliminar') {
        this.clientAux = item
        this.deleteDialog = true
      }
    },
    async updateTable(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      await this.getClients()
    },
    async deleteClient() {
      await this.deleteClientById(this.clientAux.id)
      this.deleteDialog = false
      this.getClients()
    },
  },
}
</script>
