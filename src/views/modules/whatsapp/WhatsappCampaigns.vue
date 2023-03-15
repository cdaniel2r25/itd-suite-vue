<template>
  <v-container class="pa-10" fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="8">
          <span class="text-h4">Listado de campañas</span>
        </v-col>
        <v-spacer />
        <v-col cols="4" class="pr-10" style="text-align: right">
          <v-btn
            v-if="can('CREATE_WHATSAPP_CAMPAIGN', 'whatsapp')"
            color="primary"
            @click="
              $router.push({
                name: 'WhatsappCreateCampaign',
                params: { id: 'create' },
              })
            "
          >
            <v-icon dark> mdi-plus </v-icon>Crear Campaña
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
            @change="changeStatusFilter($event)"
          >
            <v-tab v-for="item in tabsHeaders" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
          <v-container fluid>
            <v-row class="mt-5">
              <v-col class="mr-5" cols="4">
                <v-text-field
                  v-model="searchName"
                  label="Nombre de campaña"
                  dense
                  outlined
                />
              </v-col>
              <v-col class="mt-2">
                <date-picker-calendar v-model="selectedDate" />
              </v-col>
              <v-col class="ml-5" cols="2">
                <v-btn outlined color="primary" @click="getCampaigns()">
                  Buscar
                </v-btn>
              </v-col>
            </v-row>
            <div>
              <v-data-table
                :loading="loading"
                :headers="datableHeaders"
                :items="wspCampaigns"
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
                        No se han creado campañas de whatsapp.
                      </span>
                    </v-col>
                  </v-card-text>
                </template>
                <template v-slot:[`item.status`]="{ item }">
                  <span :class="getSpanColor(item.status)">
                    {{ getSpanLabel(item.status) }}
                    <v-icon
                      v-if="item.status === 0"
                      class="ml-2"
                      medium
                      color="primary"
                    >
                      mdi-spin mdi-loading
                    </v-icon>
                  </span>
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
                        v-for="(mitem, i) in getMenuActionsList(item.status)"
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
      :element-to-delete="campaignAux.name"
      @btn-active-action="deleteCampaign()"
    />
    <simple-dialog
      v-model="editCampaignDialog"
      :body-text="editCampaignText"
      @btn-active-action="editCampaign()"
    />
    <simple-dialog
      v-model="cancelCampaignDialog"
      :body-text="cancelCampaignText"
      @btn-active-action="cancelCampaign()"
    />
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '@/mixins/permissionsMixin'
import DeleteDialog from '@/components/util/DeleteDialog.vue'
import SimpleDialog from '@/components/util/SimpleDialog.vue'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import DatePickerCalendar from '@/components/util/DatePickerCalendar.vue'
import dateMixin from '@/mixins/util/dateMixin'

const CAMPAIGN_STATUS = {
  0: 'EN PROCESO',
  1: 'ENCOLADO',
  2: 'FINALIZADO',
  3: 'BORRADOR',
  4: 'CANCELADO',
}
const CAMPAIGN_STATUS_COLOR = {
  0: 'primary--text',
  1: 'warning--text',
  2: 'success--text',
  3: 'accent--text',
  4: 'error--text',
}
const CAMPAIGN_MENU_STATUS_ARRAYS = {
  0: [
    { title: 'Ir a reporte' },
    { title: 'Editar' },
    { title: 'Duplicar' },
    { title: 'Anular' },
  ],
  1: [{ title: 'Ir a reporte' }, { title: 'Duplicar' }, { title: 'Anular' }],
  2: [{ title: 'Ir a reporte' }, { title: 'Duplicar' }],
  3: [{ title: 'Editar' }, { title: 'Duplicar' }, { title: 'Eliminar' }],
  4: [{ title: 'Ir a reporte' }, { title: 'Duplicar' }],
}
export default {
  components: { DatePickerCalendar, DeleteDialog, SimpleDialog },
  mixins: [permissionsMixin, whatsappBffMixin, dateMixin],
  data() {
    return {
      selectedTab: null,
      editCampaignDialog: false,
      cancelCampaignDialog: false,
      editCampaignItem: {},
      editCampaignText:
        'Al editar la campaña se detendrá el envío y se cambiará a estado Borrador. ¿Desea continuar?. ',
      cancelCampaignText:
        'Si anula la campaña detendrá el proceso de envío de mensajes en cola, ¿Desea proceder?.',
      loading: false,
      wspCampaigns: [],
      searchName: '',
      search: null,
      datefilter: null,
      deleteDialog: false,
      selectedDate: null,
      results: null,
      statusFilter: '',
      scheduledFilter: false,
      campaignAux: {},
      dates: [],
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      totalElements: 0,
      itemsPerPage: 5,
      actualPage: 1,
      menu: false,
      tabsHeaders: [
        'TODOS',
        'FINALIZADOS',
        'BORRADORES',
        'PROGRAMADOS',
        'ANULADOS',
        'PROCESANDO',
        'EN COLA',
      ],
      datableHeaders: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nombre', value: 'name' },
        { text: 'Fecha de envío', value: 'sendDate' },
        { text: 'Estado', value: 'status' },
        { text: 'Entregados', value: 'delivered' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  methods: {
    async getCampaigns() {
      let status = '-1'
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
      if (this.statusFilter !== '-1') {
        status = this.statusFilter
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
        status,
        scheduled: this.scheduledFilter,
      }
      const wspCampaignsTMP = await this.getWhatsappCampaignsListByClientId(
        params
      )
      this.wspCampaigns = wspCampaignsTMP.dataList
      this.totalElements = wspCampaignsTMP.totalElements
    },
    menuAction(item, action) {
      this.campaignAux = item
      if (action === 'Ir a reporte') {
        this.$router.push({
          name: 'WhatsappSelectedCampaignMessagesReports',
          params: { campaign: item.id },
        })
      } else if (action === 'Eliminar') {
        this.deleteDialog = true
      } else if (action === 'Duplicar') {
        this.duplicateCampaign()
      } else if (action === 'Anular') {
        this.cancelCampaignDialog = true
      } else if (action === 'Editar') {
        this.editCampaignItem = structuredClone(item)
        if (item.status === 0) {
          this.editCampaignDialog = true
        } else {
          this.editCampaign()
        }
      }
    },
    editCampaign() {
      this.changeCampaignStatusToEraser(this.editCampaignItem.id)
      this.$router.push({
        name: 'WhatsappCreateCampaign',
        params: { id: this.editCampaignItem.id },
      })
    },
    async cancelCampaign() {
      await this.cancelCampaignById(this.campaignAux.id)
      this.cancelCampaignDialog = false
      await this.getCampaigns()
    },
    async changeCampaignStatusToEraser(campaignId) {
      await this.campaignToEraserStatus(campaignId)
    },
    async deleteCampaign() {
      await this.deleteCampaignById(this.campaignAux.id)
      this.deleteDialog = false
      await this.getCampaigns()
    },
    async duplicateCampaign() {
      this.campaignAux.id = await this.duplicateCampaignById(
        this.campaignAux.id
      )
      if (this.campaignAux.id !== null && this.campaignAux.id !== '') {
        this.$router.push({
          name: 'WhatsappCreateCampaign',
          params: { id: this.campaignAux.id },
        })
      } else {
        await this.getCampaigns()
      }
    },
    async updateTable(event) {
      const index = 0
      this.actualPage = event.page
      this.itemsPerPage = event.itemsPerPage
      this.sort.sortBy = event.sortBy[index]
      this.sort.sortDesc = event.sortDesc[index]
      await this.getCampaigns()
    },
    getMenuActionsList(status) {
      if (CAMPAIGN_MENU_STATUS_ARRAYS[status])
        return CAMPAIGN_MENU_STATUS_ARRAYS[status]
      return 'Desconocido'
    },
    getSpanLabel(status) {
      if (CAMPAIGN_STATUS[status]) return CAMPAIGN_STATUS[status]
      return 'Desconocido'
    },
    getSpanColor(status) {
      if (CAMPAIGN_STATUS_COLOR[status]) return CAMPAIGN_STATUS_COLOR[status]
      return 'accent--text'
    },
    changeStatusFilter(status) {
      const campaignHeaderStatus = {
        0: '-1', // TODOS
        1: '2', // FINALIZADOS
        2: '3', // BORRADOR
        3: '5', // PROGRAMADOS
        4: '4', // ANULADOS
        5: '0', // EN PROCESO
        6: '1', // EN COLA
      }
      if (status === 3) {
        // PROGRAMADOS
        this.scheduledFilter = true
        this.statusFilter = '-1'
      } else {
        this.statusFilter = campaignHeaderStatus[status]
        this.scheduledFilter = false
      }
      this.cleanPagination()
      this.getCampaigns()
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
