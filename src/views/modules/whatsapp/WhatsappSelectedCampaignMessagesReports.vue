<template>
  <v-container class="pa-10" fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters class="mb-8 mt-n5">
        <v-col cols="8">
          <v-btn
            text
            color="primary"
            @click="
              $router.push({
                name: 'WhatsappCampaignsReports',
              })
            "
          >
            <v-icon color="primary" class="ml-n4 pr-2"> mdi-arrow-left </v-icon>
            VOLVER A LISTADO
          </v-btn>
        </v-col>
        <v-spacer />
      </v-row>
      <v-row no-gutters>
        <v-col cols="8">
          <span class="text-h4">Reporte campaña</span>
        </v-col>
        <v-spacer />
      </v-row>
      <v-row class="mt-5 mb-8" no-gutters>
        <v-col cols="12">
          <span class="subtitle-1"> Resumen de indicadores de la campaña </span>
        </v-col>
      </v-row>
      <v-container>
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
                  <date-picker-calendar v-model="selectedDate" />
                </v-col>
                <v-col class="d-flex justify-end mx-3 pt-1" cols="1">
                  <v-btn color="primary"> BUSCAR </v-btn>
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
                        <v-col
                          v-for="input in filterMenuInputs"
                          :key="input.id"
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
                        <v-btn
                          plain
                          color="primary"
                          @click="filterDataRequest()"
                        >
                          Filtrar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-col>
              </v-row>
              <v-tab-item class="mt-10">
                <v-row class="d-flex justify-space-between mb-10">
                  <v-col cols="6">
                    <v-card flat>
                      <v-card-text
                        v-if="selectedCampaign"
                        class="d-flex flex-column accent--text text-subtitle-1"
                      >
                        <v-col class="align-end">
                          <span class="text-h6 mr-2">Fecha envío:</span>
                          <span> {{ selectedCampaign.createdAt }}</span>
                        </v-col>
                        <v-col class="align-end">
                          <span class="text-h6 mr-2">Fecha de creación:</span>
                          <span> {{ selectedCampaign.updatedAt }}</span>
                        </v-col>
                        <v-col class="align-end">
                          <span class="text-h6 mr-2">Lista de contactos:</span>
                          <span> {{ selectedCampaign.database.name }}</span>
                          <span>
                            {{
                              ' &lt;' +
                              selectedCampaign.database.rowsCount +
                              ' Registros>'
                            }}
                          </span>
                        </v-col>
                        <v-col class="align-end">
                          <span class="text-h6 mr-2">Remitente:</span>
                          <span> {{ selectedCampaign.sender.name }}</span>
                        </v-col>
                        <v-col class="align-end">
                          <span class="text-h6 mr-2">Plantilla:</span>
                          <span> {{ selectedCampaign.template.name }}</span>
                        </v-col>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6">
                    <preview-official-template
                      v-if="selectedCampaign"
                      :template="selectedCampaign.template"
                      only-template
                    />
                  </v-col>
                </v-row>
                <whatsapp-campaign-messages-reports-dashboard
                  v-if="messagesStatusCount"
                  :messages-status-count="messagesStatusCount"
                />
              </v-tab-item>
              <v-tab-item class="mt-10">
                <v-container fluid>
                  <v-tabs v-model="actualDetailTab" color="primary">
                    <v-row>
                      <v-col class="d-flex flex-row">
                        <v-tab
                          v-for="itemDetail in reportsDetailTabHeaders"
                          :key="itemDetail.id"
                        >
                          {{ itemDetail.text }}
                        </v-tab>
                      </v-col>
                      <v-col class="d-flex justify-end">
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
                            :span-colors-const="spanColors"
                            :span-labels-const="spanLabels"
                            @btn-action="showMessage"
                          />
                        </div>
                      </v-container>
                    </v-tab-item>
                  </v-tabs>
                </v-container>
              </v-tab-item>
              <v-tab-item class="mt-10">
                <whatsapp-campaign-buttons-reports-dashboard
                  v-if="buttonsArray && buttonsArray.length > 0"
                  :cards-list="buttonsArray"
                />
                <span v-else class="text-h6">
                  Esta campaña no posee botones añadidos
                </span>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
      </v-container>
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
          <span>ID: {{ contenidoDialog.id }}</span>
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
import WhatsappCampaignButtonsReportsDashboard from '@/components/modules/whatsapp/reports/WhatsappCampaignButtonsReportsDashboard.vue'
import WhatsappCampaignMessagesReportsDashboard from '@/components/modules/whatsapp/reports/WhatsappCampaignMessagesReportsDashboard.vue'
import PreviewOfficialTemplate from '@/components/modules/whatsapp/campaign/PreviewOfficialTemplate.vue'
import whatsappReportBffMixin from '@/mixins/services/whatsapp/reportBffMixin'

export default {
  components: {
    DatePickerCalendar,
    SelectTableColumns,
    SimpleDatatable,
    WhatsappCampaignMessagesReportsDashboard,
    WhatsappCampaignButtonsReportsDashboard,
    PreviewOfficialTemplate,
  },
  mixins: [
    permissionsMixin,
    adminBffMixin,
    generalMixin,
    whatsappBffMixin,
    dateMixin,
    whatsappReportBffMixin,
  ],
  data() {
    return {
      basePath: '/admin-bff',
      connectors: [],
      messagesStatusCount: null,
      campaign: null,
      selectedDate: null,
      selectedCampaign: null,
      menuFilter: false,
      actualDetailTab: null,
      buttonsArray: null,
      spanLabels: {
        0: 'NO ENVIADO',
        1: 'ENVIADO',
        2: 'ENTREGADO',
        3: 'LEÍDO',
        4: 'ENCOLADO',
      },
      spanColors: {
        0: 'error--text',
        1: 'accent--text',
        2: 'success--text',
        3: 'primary--text',
        4: 'warning--text',
      },
      templateColors: {
        0: 'error--text',
        1: 'accent--text',
        2: 'success--text',
        3: 'primary--text',
        4: 'warning--text',
      },
      templateLabels: {
        0: 'NO ENVIADO',
        1: 'ENVIADO',
        2: 'ENTREGADO',
        3: 'LEÍDO',
        4: 'ENCOLADO',
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
      dialogMessages: false,
      allMessages: [],
      sentMessages: [],
      notSentMessages: [],
      deliveredMessages: [],
      seenMessages: [],
      queuedMessages: [],
      menu: false,
      mainTabsHeaders: ['DASHBOARD', 'DETALLE', 'RESPUESTAS'],
      reportsDetailTabHeaders: [
        { id: 0, text: 'TODOS', items: 'allMessages' },
        { id: 1, text: 'ENVIADOS', items: 'sentMessages' },
        { id: 2, text: 'ENTREGADOS', items: 'deliveredMessages' },
        { id: 3, text: 'LEÍDOS', items: 'seenMessages' },
        { id: 4, text: 'ENCOLADOS', items: 'queuedMessages' },
        { id: 5, text: 'NO ENVIADOS', items: 'notSentMessages' },
      ],
      filterData: { inputs: { sender: '', receiver: '' } },
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
          model: 'receiver',
          label: 'Destinatario',
          placeholder: 'Seleccionar destinatario',
          items: [],
        },
      ],
      datableHeaders: [
        { id: 0, text: 'Remitente', value: 'sender' },
        { id: 1, text: 'Destinatarios', value: 'receiver' },
        { id: 2, text: 'Plantilla', value: 'template.name' },
        { id: 3, text: 'Estado', value: 'status' },
        { id: 4, text: 'Fecha de cola', value: 'queueDate' },
        { id: 5, text: 'Fecha estado', value: 'statusDate' },
      ],
      datableHeadersAux: [],
    }
  },
  computed: {
    ...mapGetters(['userDefaultClient']),
  },
  mounted() {
    this.fillCharts()
  },
  created() {
    this.campaign = this.$route.params.campaign
    this.getSelectedCampaign()
    this.getCampaignMessagesByParameters(
      this.userDefaultClient,
      this.campaign,
      '-1',
      '-1',
      '0',
      '10'
    )
  },
  beforeMount() {
    this.getConnectors()
    this.getButtons()
    this.datableHeadersAux = this.datableHeaders
  },
  methods: {
    async getConnectors() {
      this.connectors = await this.getWhatsappConnectorsByClientId(
        this.basePath,
        this.userDefaultClient
      )
    },
    async getSelectedCampaign() {
      this.selectedCampaign = await this.getSelectedCampaignByCampaignId(
        this.campaign
      )
    },
    async getCampaignMessagesByParameters(
      clientId,
      campaignId,
      senderId,
      receiver,
      pageNumber,
      limit
    ) {
      const messages = await this.getCampaignMessagesByCampaignId(
        clientId,
        campaignId,
        senderId,
        receiver,
        pageNumber,
        limit
      )
      this.allMessages = messages.data
      this.notSentMessages = messages.data.filter(
        (record) => record.status === 0
      )
      this.sentMessages = messages.data.filter((record) => record.status === 1)
      this.deliveredMessages = messages.data.filter(
        (record) => record.status === 2
      )
      this.seenMessages = messages.data.filter((record) => record.status === 3)
      this.queuedMessages = messages.data.filter(
        (record) => record.status === 4
      )
    },
    async fillCharts() {
      this.messagesStatusCount = await this.getMessagesStatusDataToCharts(
        this.userDefaultClient,
        '-1',
        '-1',
        '-1'
      )
    },
    async filterDataRequest() {
      this.messagesStatusCount = await this.getMessagesStatusDataToCharts(
        this.userDefaultClient,
        this.filterData.inputs.sender,
        this.filterData.inputs.receiver
      )
      await this.getCampaignMessagesByParameters(
        this.userDefaultClient,
        this.filterData.inputs.sender,
        this.filterData.inputs.receiver,
        '-1',
        '0',
        '10'
      )
      this.menuFilter = false
    },
    async getButtons() {
      this.buttonsArray = await this.getCampaignButtonsDataToCharts(
        this.userDefaultClient,
        '-1'
      )
    },
    cleanFilters() {
      this.filterData = {
        inputs: { sender: '-1', receiver: '-1' },
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
    getTemplateStatusColor(status) {
      if (this.templateColors[status]) return this.templateColors[status]
      return 'primary--text'
    },
    getTemplateStatusLabel(status) {
      if (this.templateLabels[status]) return this.templateLabels[status]
      return 'Desconocido'
    },
    showMessage(item) {
      this.contenidoDialog = item
      this.dialogMessages = true
    },
  },
}
</script>
