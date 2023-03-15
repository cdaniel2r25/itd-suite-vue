<template>
  <v-container class="pa-10" fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="8">
          <span class="text-h4">Sesiones</span>
        </v-col>
        <v-spacer />
      </v-row>
      <v-row class="mt-5 mb-8" no-gutters>
        <v-col cols="12">
          <span class="subtitle-1"> Resumen de aperturas </span>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-tabs color="primary">
            <v-tab v-for="mainHeader in mainTabsHeaders" :key="mainHeader">
              {{ mainHeader }}
            </v-tab>
            <v-row class="d-flex justify-end" dense no-gutters>
              <v-col class="d-flex justify-end pr-5 pt-1" cols="2">
                <!-- TODO: Crear método para hacer print en reportes o en toda la plataforma -->
                <v-btn disabled outlined color="primary">
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="4">
                <date-picker-calendar v-model="selectedDate" class="mt-0" />
              </v-col>
              <v-col class="d-flex justify-end mr-3 pt-1" cols="1">
                <v-btn color="primary" @click="filterDataRequest()">
                  BUSCAR
                </v-btn>
              </v-col>
              <v-col class="d-flex justify-end mr-3 pt-1" cols="1">
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

                  <v-card class="d-flex flex-column pa-1">
                    <v-card-text class="d-flex justify-space-around px-2">
                      <v-row>
                        <v-col
                          v-for="input in filterMenuInputs"
                          :key="input.id"
                          cols="4"
                        >
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
                          <v-select
                            v-if="input.type === 'select'"
                            v-model="filterData.inputs[input.model]"
                            :items="_self[input.items]"
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
                      </v-row>
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
              </v-col>
            </v-row>
            <v-tab-item class="mt-10">
              <whatsapp-sessions-messages-reports-dashboard
                v-if="messagesStatusCount"
                :messages-status-count="messagesStatusCount"
              />
            </v-tab-item>
            <v-tab-item class="mt-10">
              <v-container fluid>
                <v-tabs
                  v-model="actualDetailTab"
                  color="primary"
                  show-arrows
                  @change="changeMessagesStatus($event)"
                >
                  <v-row>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-tab
                        v-for="itemDetail in reportsDetailTabHeaders"
                        :key="itemDetail.text"
                      >
                        {{ itemDetail.text }}
                      </v-tab>
                    </v-col>
                    <v-col cols="4" class="d-flex justify-end">
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
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
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
            Tipo apertura:
            <span :class="getSpanColor(contenidoDialog.status)">
              {{ getSpanLabel(contenidoDialog.status) }}
            </span>
          </div>
          <span>Fecha encolamiento: {{ contenidoDialog.queueDate }}</span>
          <span>Fecha de estado: {{ contenidoDialog.statusDate }}</span>
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
import WhatsappSessionsMessagesReportsDashboard from '@/components/modules/whatsapp/reports/WhatsappSessionsMessagesReportsDashboard.vue'

const MESSAGES_STATUS = {
  0: '-1',
  1: 'EMPRESAS',
  2: 'USUARIOS',
}
export default {
  components: {
    DatePickerCalendar,
    SelectTableColumns,
    SimpleDatatable,
    WhatsappSessionsMessagesReportsDashboard,
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
      basePath: '/admin-bff',
      connectors: [],
      messagesStatusCount: null,
      selectedDate: null,
      actualDetailTab: null,
      spanLabels: {
        0: 'EMPRESA',
        1: 'USUARIO',
      },
      spanColors: {
        0: 'success--text',
        1: 'primary--text',
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
      },
      filterData: {
        inputs: {
          sender: '',
          receiver: '',
          template: '',
          campaign: '',
          from: '',
        },
        date: {
          startDate: '',
          endDate: '',
        },
        status: '-1',
        totalElements: this.totalElements,
        actualPage: this.actualPage,
      },
      allMessages: [],
      enterprisesMessages: [],
      usersMessages: [],
      from: ['Autorespuesta', 'Campaña'],
      menuFilter: false,
      dialogSortTable: false,
      dialogMessages: false,
      pageNumber: 0,
      pageLimit: 0,
      mainTabsHeaders: ['DASHBOARD', 'DETALLE'],
      reportsDetailTabHeaders: [
        { id: 0, text: 'TODAS', items: 'allMessages' },
        { id: 1, text: 'EMPRESAS', items: 'enterprisesMessages' },
        { id: 2, text: 'USUARIOS', items: 'usersMessages' },
      ],
      datableHeaders: [
        { id: 0, text: 'Remitente', value: 'sender' },
        { id: 1, text: 'Destinatarios', value: 'receiver' },
        { id: 2, text: 'Origen', value: 'from' },
        { id: 3, text: 'Tipo apertura', value: 'status' },
        { id: 4, text: 'Fecha de apertura', value: 'queueDate' },
        { id: 5, text: 'Fecha estado', value: 'statusDate' },
        { id: 6, text: 'Mensaje', value: 'content', sortable: false },
      ],
      filterMenuInputs: [
        {
          id: 0,
          type: 'selectPhone',
          model: 'sender',
          label: 'Remitente',
          placeholder: 'Seleccionar remitente',
          items: 'connectors',
        },
        {
          id: 1,
          type: 'textfield',
          model: 'receiver',
          label: 'Destinatario',
          placeholder: 'Seleccionar destinatario',
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
        {
          id: 3,
          type: 'textfield',
          model: 'campaign',
          label: 'Campañas',
          placeholder: 'Buscar por ID o nombre',
          items: [],
        },
        {
          id: 4,
          type: 'select',
          model: 'from',
          label: 'Origen',
          placeholder: 'Seleccionar origen',
          items: 'from',
        },
      ],
      datableHeadersAux: [],
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
  beforeMount() {
    this.getConnectors()
    this.getSessionsMessagesByParameters()
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
    async getSessionsMessagesByParameters() {
      let sender = '-1'
      let status = '-1'
      let campaign = '-1'
      let template = '-1'
      let receiver = '-1'
      let from = '-1'
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
        if (this.filterData.inputs.receiver !== '') {
          receiver = this.filterData.inputs.receiver
        }
        if (this.filterData.inputs.from !== '') {
          from = this.filterData.inputs.from
        }
        if (this.filterData.inputs.template !== '') {
          template = this.filterData.inputs.template
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
        receiver,
        from,
        startDate,
        endDate,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }
      const sessionsMessages = await this.getSessionsMessages(filterService)
      if (this.filterData.status === '-1') {
        this.allMessages = sessionsMessages.dataList
      } else if (this.filterData.status === 'EMPRESAS') {
        this.enterprisesMessages = sessionsMessages.dataList
      } else if (this.filterData.status === 'USUARIOS') {
        this.usersMessages = sessionsMessages.dataList
      }
      this.totalElements = sessionsMessages.totalElements
      this.loading = false
    },
    async fillCharts() {
      let sender = '-1'
      let campaign = '-1'
      let template = '-1'
      let receiver = '-1'
      let from = '-1'
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
        if (this.filterData.inputs.receiver !== '') {
          receiver = this.filterData.inputs.receiver
        }
        if (this.filterData.inputs.from !== '') {
          from = this.filterData.inputs.from
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
        receiver,
        from,
        startDate,
        endDate,
      }
      this.messagesStatusCount =
        await this.getSessionsMessagesStatusDataToCharts(filterService)
    },
    async filterDataRequest() {
      await this.fillCharts()
      await this.getSessionsMessagesByParameters()
      this.menuFilter = false
    },
    cleanFilters() {
      this.filterData = {
        inputs: {
          sender: '',
          receiver: '',
          template: '',
          campaign: '',
          from: '',
        },
        date: {
          startDate: '',
          endDate: '',
        },
        status: '-1',
        totalElements: this.totalElements,
        actualPage: this.actualPage,
      }
    },
    cleanPagination() {
      this.totalElements = 0
      this.itemsPerPage = 5
      this.actualPage = 1
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
    async updateTable(event) {
      this.actualPage = event.actualPage
      this.itemsPerPage = event.itemsPerPage
      if (event.sortBy === undefined) {
        this.sort.sortBy = '-1'
      } else {
        this.sort.sortBy = event.sortBy
      }
      this.sort.sortDesc = event.sortDesc
      await this.getSessionsMessagesByParameters()
    },
  },
}
</script>
