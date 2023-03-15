<template>
  <v-container class="pa-10" fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="8">
          <span class="text-h4">Enviados</span>
        </v-col>
        <v-spacer />
      </v-row>
      <v-row class="mt-5 mb-8" no-gutters>
        <v-col cols="12">
          <span class="subtitle-1">
            Resumen de indicadores para envíos de mensajes
          </span>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-tabs color="primary">
            <v-tab v-for="item in mainTabsHeaders" :key="item">
              {{ item }}
            </v-tab>
            <v-row class="d-flex justify-end" dense no-gutters>
              <v-col class="d-flex justify-end pr-5 pt-1">
                <!-- TODO: Crear método para hacer print en reportes o en toda la plataforma -->
                <v-btn disabled outlined color="primary">
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="4">
                <date-picker-calendar v-model="selectedDate" class="mt-0" />
              </v-col>
              <v-col class="d-flex justify-end mx-3 pt-1" cols="1">
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
                        <v-select
                          v-if="input.type === 'selectTemplate'"
                          v-model="filterData.inputs[input.model]"
                          :items="_self[input.items]"
                          :item-text="
                            (item) => item.name + ' (' + item.lang + ') '
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
                          :item-text="(item) => item.name"
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
              </v-col>
            </v-row>
            <v-tab-item class="mt-10">
              <whatsapp-outgoing-messages-reports-dashboard
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
                    <v-col
                      md="9"
                      sm="1"
                      class="d-flex justify-md-start d-sm-flex"
                    >
                      <v-tab
                        v-for="itemDetail in reportsDetailTabHeaders"
                        :key="itemDetail.id"
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
                </v-tabs>
                <simple-datatable
                  :headers="datableHeadersAux"
                  :items="messageList"
                  :loading="loading"
                  :total-elements="totalElements"
                  :span-colors-const="spanColors"
                  :span-labels-const="spanLabels"
                  @btn-action="showMessage"
                  @update-list="updateTable"
                />
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
          <span class="accent--text text-h4">Ver mensaje</span>
          <v-spacer />
          <v-btn x-large color="white" icon @click="dialogMessages = false">
            <v-icon color="accent">mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text
          v-if="contenidoDialog"
          class="d-flex flex-column accent--text text-subtitle-1 mt-10"
        >
          <div>
            <preview-official-template
              v-if="contenidoDialog.messageType === 'template'"
              :template="contenidoDialog.otherInfo.template"
            />
          </div>
          <span>Identificador: {{ contenidoDialog.id }}</span>
          <span>key: {{ contenidoDialog.responseKey }}</span>
          <span>Remitente: {{ contenidoDialog.sender.phone }}</span>
          <span>Destinatario: {{ contenidoDialog.destinationPhone }}</span>
          <span>Origen: {{ contenidoDialog.source }}</span>
          <span>Origen: {{ contenidoDialog.content }}</span>
          <div>
            Estado:
            <span :class="getSpanColor(contenidoDialog.status)">
              {{ getSpanLabel(contenidoDialog.status) }}
            </span>
          </div>
          <!-- TODO revision no lo reconoce  -->
          <!-- <v-col v-if="contenidoDialog.otherInfo.message !== ''" cols="12">
            <span>Mensaje: {{ contenidoDialog.otherInfo.message }}</span>
          </v-col> -->
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
import dateMixin from '@/mixins/util/dateMixin'
import DatePickerCalendar from '@/components/util/DatePickerCalendar.vue'
import SelectTableColumns from '@/components/util/SelectTableColumns.vue'
import SimpleDatatable from '@/components/util/SimpleDatatable.vue'
import WhatsappOutgoingMessagesReportsDashboard from '@/components/modules/whatsapp/reports/WhatsappOutgoingMessagesReportsDashboard.vue'
import whatsappReportBffMixin from '@/mixins/services/whatsapp/reportBffMixin'
import PreviewOfficialTemplate from '@/components/modules/whatsapp/campaign/PreviewOfficialTemplate.vue'

const MESSAGES_STATUS = {
  0: '-1',
  1: 'ENVIADOS',
  2: 'ENTREGADOS',
  3: 'LEÍDOS',
  4: 'ENCOLADOS',
  5: 'NO ENVIADOS',
}
export default {
  components: {
    DatePickerCalendar,
    SelectTableColumns,
    SimpleDatatable,
    WhatsappOutgoingMessagesReportsDashboard,
    PreviewOfficialTemplate,
  },
  mixins: [permissionsMixin, whatsappReportBffMixin, dateMixin],
  data() {
    return {
      basePath: '/admin-bff',
      connectors: [],
      templates: [],
      campaigns: [],
      messagesStatusCount: null,
      selectedDate: null,
      menuFilter: false,
      actualDetailTab: null,
      spanLabels: {
        ERROR: 'NO ENVIADO',
        UNDELIVERED: 'NO ENVIADO',
        DUPLICATED: 'DUPLICADO',
        SENT: 'ENVIADO',
        DELIVERED: 'ENTREGADO',
        READ: 'LEÍDO',
        QUEUED: 'ENCOLADO',
      },
      spanColors: {
        ERROR: 'error--text',
        UNDELIVERED: 'error--text',
        DUPLICATED: 'error--text',
        SENT: 'accent--text',
        DELIVERED: 'success--text',
        READ: 'primary--text',
        QUEUED: 'warning--text',
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
      dialogSortTable: false,
      loading: false,
      dialogMessages: false,
      messageList: [],
      menu: false,
      mainTabsHeaders: ['DASHBOARD', 'DETALLE'],
      reportsDetailTabHeaders: [
        { id: 0, text: 'TODOS', items: 'messageList' },
        { id: 1, text: 'ENVIADOS', items: 'messageList' },
        { id: 2, text: 'ENTREGADOS', items: 'messageList' },
        { id: 3, text: 'LEÍDOS', items: 'messageList' },
        { id: 4, text: 'ENCOLADOS', items: 'messageList' },
        { id: 5, text: 'NO ENVIADOS', items: 'messageList' },
      ],
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      totalElements: 0,
      itemsPerPage: 10,
      actualPage: 1,
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
          type: 'select',
          model: 'campaign',
          label: 'Campañas',
          placeholder: 'Seleccionar Campaña',
          items: 'campaigns',
        },
        {
          id: 2,
          type: 'selectTemplate',
          model: 'template',
          label: 'Plantillas',
          placeholder: 'Seleccionar Plantilla',
          items: 'templates',
        },
        {
          id: 3,
          type: 'textfield',
          model: 'key',
          label: 'Key',
          placeholder: 'Buscar por Key o Identificador',
          items: [],
        },
      ],
      datableHeaders: [
        { id: 0, text: 'Origen', value: 'source' },
        { id: 0, text: 'Identificador', value: 'id' },
        { id: 0, text: 'Key', value: 'responseKey' },
        { id: 1, text: 'Remitente', value: 'sender.phone' },
        { id: 2, text: 'Destinatarios', value: 'destinationPhone' },
        { id: 3, text: 'Tipo', value: 'messageType' },
        { id: 4, text: 'Estado', value: 'status' },
        // { id: 5, text: 'Fecha de cola', value: 'queuedAt' },
        // { id: 6, text: 'Fecha de envio', value: 'sendAt' },
        // { id: 7, text: 'Fecha de recepcion', value: 'deliveredAt' },
        // { id: 8, text: 'Fecha de lectura', value: 'readAt' },
        { id: 9, text: 'Mensaje', value: 'content', sortable: false },
      ],
      datableHeadersAux: [],
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
  created() {},
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
      this.getMessagesByParameters()
      this.cleanPagination()
    },
    async getConnectors() {
      const objInit = await this.getFilterInit()
      this.connectors = objInit.senderList
      this.templates = await objInit.templateList
      this.campaigns = objInit.campaignsList
    },
    async validateParamFilter() {
      let sender = '-1'
      let status = '-1'
      let campaign = '-1'
      let template = '-1'
      let startDate = '-1'
      let endDate = '-1'
      let sortBy = '-1'
      let sortDesc = '-1'
      let key = '-1'

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
        if (this.filterData.inputs.key !== '') {
          key = this.filterData.inputs.key
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
      const filter = {
        sender,
        status,
        campaign,
        template,
        startDate,
        endDate,
        sortBy,
        sortDesc,
        key,
      }

      return filter
    },
    async getMessagesByParameters() {
      this.loading = true
      const filter = await this.validateParamFilter()
      const filterService = {
        key: filter.key,
        status: filter.status,
        senderId: filter.sender,
        campaignId: filter.campaign,
        templateId: filter.template,
        startDate: filter.startDate,
        endDate: filter.endDate,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy: filter.sortBy,
        sortDesc: filter.sortDesc,
      }
      const messages = await this.getMessagesDetail(filterService)
      this.messageList = messages.dataList

      this.totalElements = messages.totalElements
      this.loading = false
    },
    async fillCharts() {
      const filter = await this.validateParamFilter()
      const filterService = {
        key: filter.key,
        senderId: filter.sender,
        campaignId: filter.campaign,
        templateId: filter.template,
        startDate: filter.startDate,
        endDate: filter.endDate,
        direction: 'O',
        group: true,
      }

      this.messagesStatusCount = await this.getMessagesStatusTotals(
        filterService
      )
      this.loading = false
    },
    async filterDataRequest() {
      await this.fillCharts()
      this.getMessagesByParameters()
      this.menuFilter = false
    },
    cleanFilters() {
      this.filterData = {
        inputs: { sender: '', campaign: '', template: '', key: '' },
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
      await this.getMessagesByParameters()
    },
  },
}
</script>
