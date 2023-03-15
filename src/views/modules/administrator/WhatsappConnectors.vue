<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="8">
          <h1>Conectores Whatsapp</h1>
        </v-col>
        <v-col cols="4 d-flex justify-end">
          <v-btn
            color="primary"
            @click="
              $router.push({ name: 'CreateConnector', params: { id: -1 } })
            "
          >
            <v-icon class="mr-2"> mdi-plus </v-icon>Crear Conexión
          </v-btn>
        </v-col>
      </v-row>
      <div class="mt-6">
        <v-tabs v-model="tab">
          <v-col v-if="false" cols="8">
            <activate-filters
              :filter-drawer="filterDrawer"
              @activate-filter-drawer="filterDrawer = !filterDrawer"
              @activate-filter="activateFilter()"
              @change-name="changeName"
              @menu-actions="menuActions"
            />
          </v-col>
          <v-tab> CONECTORES </v-tab>
          <v-tab> REMITENTES NO ASIGNADOS </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card
              :height="filterDrawer ? 112 : 0"
              width="730"
              :style="filterDrawer ? '' : 'display: none'"
              class="mt-2 ml-auto mr-1"
            >
              <div class="d-flex pa-4">
                <div class="mr-2">
                  <v-select
                    v-model="filter.type"
                    dense
                    :items="typeList"
                    label="Tipo"
                    hide-details
                    placeholder="Selecciona tipo"
                    outlined
                  />
                </div>
                <div class="mr-2">
                  <v-select
                    v-model="filter.condition"
                    dense
                    :items="conditionList"
                    label="Estado"
                    hide-details
                    placeholder="Selecciona estado"
                    outlined
                  />
                </div>
                <div>
                  <v-select
                    v-model="filter.firstList"
                    dense
                    :items="firstList"
                    label="Primeros en la lista"
                    hide-details
                    placeholder="Selecciona"
                    outlined
                  />
                </div>
              </div>
              <v-btn text color="primary" @click="cleanFilters()">
                limpiar filtros
              </v-btn>
            </v-card>
            <v-skeleton-loader v-if="loading" type="table" />
            <div v-else class="my-2">
              <database-connectors
                :databases-list="connectionsList"
                :hide-footer="true"
                :loading="loadingConnections"
                @change-status="changeStatus"
                @change-condition="changeCondition"
                @delete-connector="deleteConnector"
                @filter-connections="filterConnections($event)"
              />
            </div>
          </v-tab-item>
          <v-tab-item>
            <senders-table
              :loading="loading"
              :senders-list="sendersList"
              :headers="expandedTableHeaders"
              :total-elements="totalElements"
              :menu-assign="true"
              @edit-dialog-activator="editSender($event)"
              @filter-inputs="senderFilterInputs"
              @clean-inputs="cleanSenderFilters($event)"
              @assign-sender="assignSender($event)"
              @update-list="updateTable"
            />
          </v-tab-item>
        </v-tabs-items>
        <delete-dialog
          v-if="removeItem"
          v-model="activeDeleteDialog"
          :element-to-delete="`Conector ${removeItem.name}`"
          @change-model="activeDeleteDialog = false"
          @btn-active-action="removeConnector()"
        />
      </div>
    </v-col>
  </v-container>
</template>

<script>
import administratorBffMixin from '@/mixins/services/administratorBffMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import SendersTable from '@/components/modules/whatsapp/settings/SendersTable.vue'
import DatabaseConnectors from '@/components/modules/administrator/DatabaseConnectors.vue'
import ActivateFilters from '@/components/modules/administrator/ActivateFilters.vue'
import DeleteDialog from '@/components/util/DeleteDialog.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'WhatsappConnectors',
  components: {
    DatabaseConnectors,
    DeleteDialog,
    ActivateFilters,
    SendersTable,
  },
  mixins: [administratorBffMixin, whatsappBffMixin, adminBffMixin],
  data() {
    return {
      tab: 0,
      loading: false,
      totalElementsConnections: 0,
      itemsPerPageConnections: 5,
      actualPageConnections: 1,
      sortConnections: {
        sortBy: '',
        sortDesc: false,
      },
      totalElements: 0,
      itemsPerPage: 5,
      actualPage: 1,
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      filters: { name: '', phone: '' },
      expandedTableHeaders: [
        { text: 'Nombre', align: 'start', value: 'name' },
        { text: 'Teléfono', value: 'phone' },
        { text: 'Estado', value: 'state' },
        {
          text: '',
          align: 'center',
          value: 'menu',
          sortable: false,
          width: 1,
        },
      ],
      connectionsList: [],
      filter: { clientName: '', type: '', condition: '', firstList: '' },
      typeList: ['Todos', 'DUMMY', 'WABOXAPP', 'GROUP'],
      conditionList: ['Todos', 'Habilitada', 'Inhabilitada'],
      firstList: ['Todos', '25', '50', '100', '200', '300'],
      filterDrawer: false,
      activeDeleteDialog: false,
      removeItem: null,
      assignRadioId: null,
      sendersList: [],
      clientIdAux: '',
      senderAux: null,
      loadingConnections: false,
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  async mounted() {
    await this.getConnectionsList()
  },
  methods: {
    async getConnectionsList() {
      this.loadingConnections = true
      //
      let id = '-1'
      let sortBy = '-1'
      let sortDesc = '-1'
      if (this.sortConnections !== undefined) {
        sortBy = this.sortConnections.sortBy
        sortDesc = this.sortConnections.sortDesc
      }
      if (this.clientIdAux !== '') id = this.clientIdAux
      const filterService = {
        clientId: id,
        page: this.actualPageConnections - 1,
        limit: this.itemsPerPageConnections,
        sortBy,
        sortDesc,
      }
      const connectionsObjectQuery = await this.getWhatsappConnections(
        filterService
      )
      this.connectionsList = await connectionsObjectQuery.dataList
      this.totalElements = await connectionsObjectQuery.totalElements

      this.loadingConnections = false
    },
    menuActions(menuItem) {
      console.log(menuItem)
    },
    async activateFilter() {
      this.loading = true
      const filter = {
        clientId: this.clientId,
        filter: this.filter,
      }
      console.log('-------activateFilter----------')
      console.log(filter)
      let result = await this.getListInConnectorsByFilter(filter)
      if (result === '') {
        result = []
      }
      this.filterDrawer = false
      this.connectionsList = result
      this.loading = false
    },
    changeName(filterName) {
      this.filter.clientName = filterName
    },
    async senderFilterInputs(filters) {
      this.senderFilters = filters
      this.getSenderList()
    },
    cleanFilters() {
      this.filter.clientName = ''
      this.filter.type = ''
      this.filter.condition = ''
      this.filter.firstList = ''
    },
    async changeStatus(item) {
      const changeItem = {
        clientId: this.clientId,
        changeItem: item,
      }
      const result = await this.getConnectorItemByStatusChange(changeItem)
      item = Object.assign(item, result)
    },
    async changeCondition(value, selected) {
      const changeItem = {
        clientId: this.clientId,
        condition: value,
        changeItems: selected,
      }
      const result = await this.getConnectorItemsByConditionChange(changeItem)
      if (result) {
        selected.forEach((item) => {
          item.condition = value
        })
      }
    },
    deleteConnector(removeItem) {
      this.removeItem = removeItem
      this.activeDeleteDialog = true
    },
    async removeConnector() {
      this.activeDeleteDialog = false
      await this.deleteConnectorById(this.removeItem.id)
      this.getConnectionsList()
    },
    filterConnections(clientId) {
      this.clientIdAux = clientId
      this.getConnectionsList()
    },
    async getSenderList() {
      this.loading = true
      let name = '-1'
      let phone = '-1'
      let sortBy = '-1'
      let sortDesc = '-1'
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      if (this.senderFilters !== undefined) {
        if (this.senderFilters.name !== '') {
          name = this.senderFilters.name
        }
        if (this.senderFilters.phone !== '') {
          phone = this.senderFilters.phone
        }
      }
      const filterService = {
        clientId: this.clientId,
        name,
        phone,
        statusList: [0],
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }
      const senderObjectQuery = await this.getSendersByClient(filterService)
      this.sendersList = await senderObjectQuery.dataList
      this.totalElements = await senderObjectQuery.totalElements

      this.loading = false
    },
    async updateTable(event) {
      this.actualPage = event.actualPage
      this.itemsPerPage = event.itemsPerPage
      if (event.sortBy === undefined) {
        this.sort.sortBy = '-1'
      } else {
        this.sort.sortBy = event.sortBy
      }
      this.sort.sortDesc = event.sortDesc
      this.getSenderList()
    },
    async cleanSenderFilters(event) {
      this.senderFilters = event
      this.senderFilters = { name: '', phone: '' }
      this.getSenderList()
    },
    assignSender(item) {
      this.$router.push({ name: 'SenderForm', params: { id: item.id } })
    },
  },
}
</script>

<style></style>
