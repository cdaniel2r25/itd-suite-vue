<template>
  <div>
    <activate-filters
      v-if="clientList.length > 0"
      :filter-drawer="filterDrawer"
      :client-list="clientList"
      @activate-filter-drawer="filterDrawer = !filterDrawer"
      @activate-filter="activateFilter()"
      @change-client="changeClient"
      @menu-actions="menuActions"
    />
    <div class="pa-2">
      <v-card
        :height="filterDrawer ? 112 : 0"
        width="730"
        :style="filterDrawer ? '' : 'display: none'"
        class="mt-2 ml-auto"
      >
        <div class="d-flex pa-4">
          <div class="mr-2">
            <v-text-field
              v-model="addresseeFilter"
              dense
              outlined
              hide-details
              label="Destinatario"
              placeholder="Ingresar destinatario"
            />
          </div>
          <div class="mr-2">
            <v-select
              v-model="priorityFilter"
              dense
              :items="priorityList"
              label="Prioridad"
              hide-details
              placeholder="Selecciona prioridad"
              outlined
            />
          </div>
          <div>
            <v-select
              v-model="firstListFilter"
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
    </div>
    <v-skeleton-loader v-if="loading" type="table" />
    <div v-else>
      <v-row>
        <v-col cols="6">
          <div v-if="activateBtn" class="d-flex">
            <v-btn text color="primary" @click="resendRow()">
              <v-icon left>mdi-arrow-u-right-top</v-icon>
              reenviar
            </v-btn>
            <v-btn
              text
              color="primary"
              class="ml-2"
              @click="activeDeleteDialog = true"
            >
              <v-icon left>mdi-delete</v-icon>
              eliminar
            </v-btn>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="d-flex justify-end">
            <v-btn text color="primary" @click="reorderDataTable()">
              <v-icon left>mdi-pencil</v-icon>
              reordenar columnas
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="databasesList"
        show-select
        class="striped-table"
        :footer-props="{
          'show-current-page': true,
          'show-first-last-page': true,
          'items-per-page-text': 'Elementos por página',
          'items-per-page-options': [5, 10, 15, 20, 25],
        }"
      />
    </div>
    <reorder-columns-dialog
      v-model="activeReorder"
      :item-database="headersClone"
      @primary-btn-action="reorderDataTableList"
      @primary-btn-cancel="activeReorder = false"
      @move-down="moveDown"
      @move-up="moveUp"
    />
    <delete-dialog
      v-model="activeDeleteDialog"
      :connector-to-delete="connectorToDelete"
      @change-model="activeDeleteDialog = false"
      @btn-active-action="deleteActivity()"
    />
  </div>
</template>

<script>
import administratorBffMixin from '@/mixins/services/administratorBffMixin'
import ActivateFilters from '@/components/modules/administrator/ActivateFilters.vue'
import { mapGetters } from 'vuex'
import ReorderColumnsDialog from '@/components/modules/administrator/ReorderColumnsDialog.vue'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import DeleteDialog from '@/components/util/DeleteDialog.vue'

export default {
  name: 'DatabaseProcess',
  components: { ReorderColumnsDialog, DeleteDialog, ActivateFilters },
  mixins: [administratorBffMixin, adminBffMixin],
  data() {
    return {
      databasesList: [],
      totalRecords: 0,
      loading: false,
      selected: [],
      clientList: [],
      filterClientId: '',
      addresseeFilter: '',
      priorityFilter: '',
      firstListFilter: '',
      activateBtn: false,
      activeDeleteDialog: false,
      connectorToDelete: '',
      priorityList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      firstList: ['15', '40', '100', '200'],
      headers: [
        { text: 'Fecha creación', value: 'createAt', align: '' },
        { text: 'Próximo envío', value: 'nextSendAt', align: '' },
        { text: 'Tipo', value: 'type', align: '' },
        { text: 'Cliente', value: 'client.name', align: 'start' },
        { text: 'Remitente', value: 'message.sender.phone', align: '' },
        { text: 'Destinatario', value: 'message.destinationPhone', align: '' },
        { text: 'Prioridad', value: 'priority', align: '' },
        { text: 'Procesado', value: 'processing', align: ' d-none' },
        { text: 'Intento Nº', value: 'retries', align: ' d-none' },
        { text: 'Contenido', value: 'message.content', align: ' d-none' },
        { text: 'Comentarios', value: 'comments', align: ' d-none' },
      ],
      filterDrawer: false,
      headersClone: [],
      activeReorder: false,
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  watch: {
    selected(newSeleted) {
      if (newSeleted.length !== 0) {
        this.activateBtn = true
      } else {
        this.activateBtn = false
      }
    },
  },
  mounted() {
    this.getClients()
    this.activateFilter()
  },
  methods: {
    menuActions(menuItem) {
      console.log('menu: ', menuItem)
    },
    async getClients() {
      const clientsTMP = await this.getUsersInit()
      this.clientList = clientsTMP.clientList
    },
    cleanFilters() {
      this.addresseeFilter = ''
      this.priorityFilter = ''
      this.firstListFilter = ''
      this.filterClientId = ''
    },
    async activateFilter() {
      this.loading = true
      let address = '-1'
      let priority = '-1'
      let firstList = '-1'
      let selectedClientId = '-1'

      if (this.addresseeFilter !== '') address = this.addresseeFilter
      if (this.priorityFilter !== '') priority = this.priorityFilter
      if (this.firstListFilter !== '') firstList = this.firstListFilter
      if (this.filterClientId !== '') selectedClientId = this.filterClientId
      const filter = {
        clientId: this.clientId,
        selectedClient: selectedClientId,
        addressee: address,
        priority,
        firstList,
        page: -1,
        type: -1,
      }
      const processListObj = await this.getListInProgress(filter)
      this.databasesList = await processListObj.dataList
      this.totalRecords = await processListObj.totalElements
      this.$emit('total-records', this.totalRecords)
      this.filterDrawer = false
      this.loading = false
    },
    changeClient(clientId) {
      this.filterClientId = clientId
    },
    reorderDataTable() {
      this.activeReorder = true
      this.headersClone = JSON.parse(JSON.stringify(this.headers))
      this.headersClone.forEach((item) => {
        if (item.align === ' d-none') {
          item.check = false
        } else {
          item.check = true
        }
      })
    },
    moveUp(item) {
      const index = this.headersClone.indexOf(item)
      if (index > 0) {
        const newList = []
        this.headersClone.forEach((itemI, indexI) => {
          if (indexI !== index) {
            if (indexI === index - 1) {
              newList.push(item)
            }
            newList.push(itemI)
          }
        })
        this.headersClone = newList
      }
    },
    moveDown(item) {
      const index = this.headersClone.indexOf(item)
      if (index + 1 <= this.headersClone.length - 1) {
        const newList = []
        this.headersClone.forEach((itemI, indexI) => {
          if (indexI !== index) {
            newList.push(itemI)
            if (indexI === index + 1) {
              newList.push(item)
            }
          }
        })
        this.headersClone = newList
      }
    },
    reorderDataTableList(listHeaders) {
      const newHearders = []
      listHeaders.forEach((item) => {
        let ver = ' d-none'
        if (item.check === true) {
          ver = ''
        }
        const newItem = {
          text: item.text,
          value: item.value,
          align: ver,
        }
        newHearders.push(newItem)
      })
      this.headers = newHearders
      this.activeReorder = false
    },
    async deleteActivity() {
      this.activeDeleteDialog = false
      this.activateBtn = false
      const recordsDelete = {
        whatsappQueueSelected: this.selected,
      }
      await this.deleteProcessesList(recordsDelete)

      this.activateFilter()
    },
    async resendRow() {
      this.activateBtn = false
      const recordsResend = {
        whatsappQueueSelected: this.selected,
      }
      await this.resubmitQueueWhatsapp(recordsResend)

      this.activateFilter()
    },
  },
}
</script>
