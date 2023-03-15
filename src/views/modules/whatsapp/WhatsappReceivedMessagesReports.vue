<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="8">
          <span class="text-h4">Recibidos</span>
        </v-col>
        <v-spacer />
      </v-row>
      <v-row class="mt-5 mb-8" no-gutters>
        <v-col cols="12">
          <span class="subtitle-1">
            Resumen de indicadores para mensajes recibidos
          </span>
        </v-col>
      </v-row>
      <v-tabs color="primary">
        <v-tab v-for="item in mainTabsHeaders" :key="item">
          {{ item }}
        </v-tab>
        <v-row class="justify-end" dense no-gutters>
          <div class="d-flex justify-end pr-5">
            <!-- TODO: Crear método para hacer print en reportes o en toda la plataforma -->
            <v-btn disabled outlined color="primary">
              <v-icon>mdi-printer</v-icon>
            </v-btn>
          </div>
          <div class="picker-width">
            <date-picker-calendar v-model="selectedDate" class="mt-0" />
          </div>
          <div class="d-flex justify-end mx-3">
            <v-btn color="primary" @click="filterDataRequest()"> BUSCAR </v-btn>
          </div>
          <div class="d-flex justify-end mr-3">
            <v-menu
              v-model="menuFilter"
              :close-on-content-click="false"
              offset-x
              nudge-width="1000"
              bottom
              left
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :dark="menuFilter"
                  :outlined="!menuFilter"
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="menuFilter = !menuFilter"
                >
                  <v-icon :dark="menuFilter"> mdi-filter </v-icon>
                </v-btn>
              </template>

              <v-card>
                <v-card-text class="d-flex justify-space-around px-2">
                  <v-col v-for="input in filterMenuInputs" :key="input.id">
                    <v-select
                      v-if="input.type === 'selectPhone'"
                      v-model="filterData.inputs[input.model]"
                      :items="_self[input.items]"
                      :item-text="
                        (item) => item.name + ' <' + item.phone + '> '
                      "
                      item-value="id"
                      :label="input.label"
                      :placeholder="input.placeholder"
                      outlined
                    />
                    <v-text-field
                      v-if="input.type === 'textfield'"
                      v-model="filterData.inputs[input.model]"
                      :label="input.label"
                      :placeholder="input.placeholder"
                      outlined
                    />
                  </v-col>
                </v-card-text>
                <v-card-actions class="d-flex justify-start">
                  <v-btn
                    class="ml-2"
                    plain
                    color="error"
                    @click="cleanFilters()"
                  >
                    Limpiar filtros
                  </v-btn>
                  <v-btn plain color="primary" @click="filterDataRequest()">
                    Filtrar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </div>
        </v-row>

        <v-tab-item class="mt-10">
          <whatsapp-received-messages-reports-dashboard
            v-if="messagesStatusCount"
            :messages-status-count="messagesStatusCount"
          />
        </v-tab-item>
        <v-tab-item class="mt-10">
          <v-tabs
            v-model="actualDetailTab"
            color="primary"
            grow
            show-arrows
            @change="changeMessagesStatus($event)"
          >
            <v-row no-gutters>
              <v-col md="9" sm="1" class="d-flex justify-md-start d-sm-flex">
                <v-tab
                  v-for="itemDetail in reportsDetailTabHeaders"
                  :key="itemDetail.text"
                >
                  {{ itemDetail.text }}
                </v-tab>
              </v-col>
              <v-col
                md="3"
                sm="11"
                class="d-flex justify-md-end d-sm-flex justify-sm-end"
              >
                <select-table-columns
                  v-model="datableHeadersAux"
                  :dialog-sort-table="dialogSortTable"
                  :tabs-headers="datableHeaders"
                />
              </v-col>
            </v-row>
            <v-tab-item
              v-for="itemDetail in reportsDetailTabHeaders"
              :key="itemDetail.items"
              class="mt-10"
            >
              <v-container fluid>
                <div>
                  <simple-datatable
                    :headers="datableHeadersAux"
                    :items="_self[itemDetail.items]"
                    :loading="loading"
                    :total-elements="totalElements"
                    :span-colors-const="spanColors"
                    :span-labels-const="spanLabels"
                    @btn-action="showMessage"
                    @update-list="updateTable"
                  />
                </div>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-tab-item>
      </v-tabs>
      <v-overlay absolute :value="menuFilter" opacity=".7" color="white" />
    </v-col>
    <v-dialog v-model="dialogMessages" max-width="40%">
      <v-card elevation="2" class="pa-5">
        <v-app-bar flat dense color="transparent">
          <v-spacer />
          <span class="accent--text text-h5">Ver mensaje</span>
          <v-spacer />
          <v-btn x-large color="white" icon @click="dialogMessages = false">
            <v-icon color="accent">mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text
          v-if="contenidoDialog"
          class="d-flex flex-column accent--text text-subtitle-1 mt-10"
        >
          <span>Remitente: {{ contenidoDialog.sender }}</span>
          <span>Destinatario: {{ contenidoDialog.receiver }}</span>
          <span>Origen: {{ contenidoDialog.from }}</span>
          <div>
            Estado:
            <span :class="getSpanColor(contenidoDialog.status)">
              {{ getSpanLabel(contenidoDialog.status) }}
            </span>
          </div>
          <span>Fecha encolamiento: {{ contenidoDialog.queueDate }}</span>
          <span>Fecha de estado: {{ contenidoDialog.statusDate }}</span>
          <span>Agente: {{ contenidoDialog.agent.name }}</span>
        </v-card-text>
        <v-card-actions class="mb-5">
          <v-spacer />
          <v-btn color="primary" outlined @click="dialogMessages = false">
            Cerrar
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '@/mixins/permissionsMixin'
import generalMixin from '@/mixins/util/generalMixin'
import dateMixin from '@/mixins/util/dateMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import DatePickerCalendar from '@/components/util/DatePickerCalendar.vue'
import SelectTableColumns from '@/components/util/SelectTableColumns.vue'
import SimpleDatatable from '@/components/util/SimpleDatatable.vue'
import WhatsappReceivedMessagesReportsDashboard from '@/components/modules/whatsapp/reports/WhatsappReceivedMessagesReportsDashboard.vue'

const MESSAGES_STATUS = {
  0: '-1',
  1: 'ATENDIDOS',
  2: 'NO ATENDIDOS',
  3: 'NO ENVIADO',
  4: 'DUPLICADO',
  5: 'ENTREGADO',
  6: 'INVALIDO',
  7: 'EN COLA',
}

export default {
  components: {
    WhatsappReceivedMessagesReportsDashboard,
    DatePickerCalendar,
    SelectTableColumns,
    SimpleDatatable,
  },
  mixins: [
    permissionsMixin,
    adminBffMixin,
    generalMixin,
    whatsappBffMixin,
    dateMixin,
  ],
  data() {
    return {
      connectors: [],
      messagesStatusCount: null,
      selectedDate: null,
      actualDetailTab: null,
      spanLabels: {
        0: 'NO ATENDIDO',
        1: 'ATENDIDO',
        2: 'NO ENVIADO',
        3: 'DUPLICADO',
        4: 'ENTREGADO',
        5: 'INVALIDO',
        6: 'EN COLA',
      },
      spanColors: {
        0: 'warning--text',
        1: 'primary--text',
        2: 'success--text',
        3: 'accent--text',
        4: 'greencheck--text',
        5: 'error--text',
        6: 'blue200--text',
      },
      contenidoDialog: {
        id: '',
        clientId: '',
        sender: '',
        receiver: '',
        from: '',
        status: 0,
        queueDate: '',
        statusDate: '',
        templateId: '',
        agent: {},
      },
      dialogSortTable: false,
      loading: false,
      dialogMessages: false,
      menuFilter: false,
      mainTabsHeaders: ['DASHBOARD', 'DETALLE'],
      allMessages: [],
      attendedMessages: [],
      notAttendedMessages: [],
      notSentMessages: [],
      duplicatedMessages: [],
      deliveredMessages: [],
      invalidMessages: [],
      queuedMessages: [],
      reportsDetailTabHeaders: [
        { id: 0, text: 'TODOS', items: 'allMessages' },
        { id: 1, text: 'ATENDIDOS', items: 'attendedMessages' },
        { id: 2, text: 'NO ATENDIDOS', items: 'notAttendedMessages' },
        { id: 2, text: 'NO ENVIADO', items: 'notSentMessages' },
        { id: 2, text: 'DUPLICADO', items: 'duplicatedMessages' },
        { id: 2, text: 'ENTREGADO', items: 'deliveredMessages' },
        { id: 2, text: 'INVALIDO', items: 'invalidMessages' },
        { id: 2, text: 'EN COLA', items: 'queuedMessages' },
      ],
      datableHeaders: [
        { id: 0, text: 'Remitente', value: 'sender' },
        { id: 1, text: 'Destinatarios', value: 'receiver' },
        { id: 2, text: 'Origen', value: 'from' },
        { id: 3, text: 'Estado', value: 'status' },
        { id: 4, text: 'Fecha de cola', value: 'queueDate' },
        { id: 5, text: 'Fecha estado', value: 'statusDate' },
        { id: 6, text: 'Agente', value: 'agent.name' },
        { id: 7, text: 'Mensaje', value: 'content', sortable: false },
      ],
      filterData: {
        inputs: { sender: '', campaign: '', template: '' },
        date: {
          startDate: '',
          endDate: '',
        },
        status: '-1',
        totalElements: this.totalElements,
        actualPage: this.actualPage,
      },
      filterMenuInputs: [
        {
          id: 0,
          type: 'selectPhone',
          model: 'sender',
          label: 'Remitente',
          placeholder: 'Seleccionar Remitente',
          items: 'connectors',
        },
        {
          id: 1,
          type: 'textfield',
          model: 'campaign',
          label: 'Campañas',
          placeholder: 'Buscar por ID o nombre',
          items: [],
        },
        {
          id: 2,
          type: 'textfield',
          model: 'template',
          label: 'Plantillas',
          placeholder: 'Buscar por ID o nombre',
          items: [],
        },
      ],
      datableHeadersAux: [],
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      totalElements: 0,
      itemsPerPage: 10,
      actualPage: 1,
    }
  },
  computed: {
    ...mapGetters(['userDefaultClient']),
  },
  watch: {
    selectedDate: {
      handler(value) {
        if (value && value.length > 1) {
          const [startAux, endAux] = value
          this.filterData.date.startDate = startAux
          this.filterData.date.endDate = endAux
        }
      },
    },
  },
  mounted() {
    this.fillCharts()
  },
  created() {
    this.getReceivedMessagesByParameters()
  },
  beforeMount() {
    this.getConnectors()
    this.datableHeadersAux = this.datableHeaders
  },
  methods: {
    getMessagesStatus(status) {
      return MESSAGES_STATUS[status]
    },
    changeMessagesStatus(event) {
      this.filterData.status = this.getMessagesStatus(event)
      this.cleanPagination()
    },
    async getConnectors() {
      const name = '-1'
      const phone = '-1'
      const sortBy = '-1'
      const sortDesc = false
      const filterService = {
        clientId: this.userDefaultClient,
        name,
        phone,
        page: 0,
        limit: 20,
        sortBy,
        sortDesc,
      }
      const senderObjectQuery = await this.getSendersByClient(filterService)
      this.connectors = senderObjectQuery.dataList
      // TODO: Si sólo se quiere filtrar por números validados usar el siguiente codigo:
      // this.connectors = senderObjectQuery.dataList.filter(
      //   (sender) => sender.state === 'VALIDADO'
      // )
    },
    async getReceivedMessagesByParameters() {
      let sender = '-1'
      let status = '-1'
      let campaign = '-1'
      let template = '-1'
      let startDate = '-1'
      let endDate = '-1'
      let sortBy = '-1'
      let sortDesc = '-1'
      this.loading = true
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      if (this.filterData !== undefined) {
        if (this.filterData.inputs.sender !== '') {
          sender = this.filterData.inputs.sender
        }
        if (this.filterData.inputs.campaign !== '') {
          campaign = this.filterData.inputs.campaign
        }
        if (this.filterData.inputs.template !== '') {
          template = this.filterData.inputs.template
        }
        if (this.selectedDate !== null) {
          if (this.filterData.date.startDate !== '') {
            startDate = this.filterData.date.startDate
          }
          if (this.filterData.date.endDate !== '') {
            endDate = this.filterData.date.endDate
          }
        }
        status = this.filterData.status
      }
      const filterService = {
        status,
        sender,
        campaign,
        template,
        startDate,
        endDate,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }
      const receivedMessages = await this.getReceivedMessages(filterService)
      if (this.filterData.status === '-1') {
        this.allMessages = receivedMessages.dataList
      } else if (this.filterData.status === 'ATENDIDOS') {
        this.attendedMessages = receivedMessages.dataList
      } else if (this.filterData.status === 'NO ATENDIDOS') {
        this.notAttendedMessages = receivedMessages.dataList
      } else if (this.filterData.status === 'NO ENVIADO') {
        this.notSentMessages = receivedMessages.dataList
      } else if (this.filterData.status === 'DUPLICADO') {
        this.duplicatedMessages = receivedMessages.dataList
      } else if (this.filterData.status === 'ENTREGADO') {
        this.deliveredMessages = receivedMessages.dataList
      } else if (this.filterData.status === 'INVALIDO') {
        this.invalidMessages = receivedMessages.dataList
      } else if (this.filterData.status === 'EN COLA') {
        this.queuedMessages = receivedMessages.dataList
      }
      this.totalElements = receivedMessages.totalElements
      this.loading = false
    },
    async fillCharts() {
      let sender = '-1'
      let campaign = '-1'
      let template = '-1'
      let startDate = '-1'
      let endDate = '-1'
      this.loading = true
      if (this.filterData !== undefined) {
        if (this.filterData.inputs.sender !== '') {
          sender = this.filterData.inputs.sender
        }
        if (this.filterData.inputs.campaign !== '') {
          campaign = this.filterData.inputs.campaign
        }
        if (this.filterData.inputs.template !== '') {
          template = this.filterData.inputs.template
        }
        if (this.selectedDate !== null) {
          if (this.filterData.date.startDate !== '') {
            startDate = this.filterData.date.startDate
          }
          if (this.filterData.date.endDate !== '') {
            endDate = this.filterData.date.endDate
          }
        }
      }
      const filterService = {
        sender,
        campaign,
        template,
        startDate,
        endDate,
      }
      this.messagesStatusCount =
        await this.getReceivedMessagesStatusDataToCharts(filterService)
    },
    async filterDataRequest() {
      await this.fillCharts()
      await this.getReceivedMessagesByParameters()
      this.menuFilter = false
    },
    cleanFilters() {
      this.filterData = {
        inputs: { sender: '', campaign: '', template: '' },
        date: {
          startDate: '',
          endDate: '',
        },
        status: '-1',
        totalElements: this.totalElements,
        actualPage: this.actualPage,
      }
    },
    getSpanColor(status) {
      if (this.spanColors[status]) return this.spanColors[status]
      return 'accent--text'
    },
    getSpanLabel(status) {
      if (this.spanLabels[status]) return this.spanLabels[status]
      return 'Desconocido'
    },
    showMessage(item) {
      this.contenidoDialog = item
      this.dialogMessages = true
    },
    cleanPagination() {
      this.totalElements = 0
      this.itemsPerPage = 5
      this.actualPage = 1
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
      await this.getReceivedMessagesByParameters()
    },
  },
}
</script>
<style scoped>
.picker-width {
  max-width: 499px;
}
</style>
