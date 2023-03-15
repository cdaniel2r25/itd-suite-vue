<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div v-if="ListProcessesActivated">
        <v-row no-gutters>
          <v-col cols="5">
            <h1>Listado de procesos</h1>
            <P class="my-2">
              Aquí podrás ver listado de procesos con sus automatizaciones y
              crear nuevos.
            </P>
          </v-col>
          <v-col cols="7">
            <div class="d-flex justify-end">
              <v-btn color="primary" @click="selectedCreateProcess = true">
                <v-icon class="mr-2"> mdi-plus-circle-outline </v-icon>
                crear proceso
              </v-btn>
              <!-- <v-btn
                color="primary"
                @click="$router.push({ name: 'CreateAutomation' })"
              >
                <v-icon> mdi-plus </v-icon>crear automatización
              </v-btn> -->
            </div>
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col cols="12" md="2">
            <v-text-field
              v-model="searchProcessName"
              label="Nombre proceso"
              hide-details
              placeholder="Ingresar nombre proceso"
              required
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="searchAutomationName"
              hide-details
              label="Nombre automatización"
              placeholder="Ingresar nombre automatización"
              required
            />
          </v-col>
          <v-col cols="12" md="5">
            <date-picker-calendar v-model="searchDate" class="mt-5" />
          </v-col>
          <v-col cols="12" md="2" class="pt-7">
            <v-btn outlined color="primary" @click="searchAction()"
              >BUSCAR</v-btn
            >
          </v-col>
        </v-row>
        <v-skeleton-loader v-if="loading" type="table" />
        <div v-else>
          <automation-list
            v-model="selectedItem"
            :process-list="processList"
            :client-id="clientId"
            @selection-see-tracking-action="seeTrackingActions()"
          />
        </div>
      </div>
      <div v-else>
        <execution-tracking
          :selected-item="selectedItem"
          :client-id="clientId"
          @btn-cancel-action="returnListProcesses()"
        />
      </div>
    </v-col>
    <create-process-dialog
      v-model="selectedCreateProcess"
      :new-process-name="newProcessNameTMP"
      :saving="saving"
      @btn-new-name-process-action="newProcessAction"
    />
  </v-container>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import DatePickerCalendar from '@/components/util/DatePickerCalendar.vue'
import automationBffMixin from '@/mixins/services/automationBffMixin'
import AutomationList from '@/components/modules/automation/AutomationList.vue'
import CreateProcessDialog from '@/components/modules/automation/CreateProcessDialog.vue'
import ExecutionTracking from '@/views/modules/automation/ExecutionTracking.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Automation',
  components: {
    DatePickerCalendar,
    AutomationList,
    ExecutionTracking,
    CreateProcessDialog,
  },
  mixins: [validationMixin, automationBffMixin],
  data() {
    return {
      loading: false,
      ListProcessesActivated: true,
      searchProcessName: '',
      searchAutomationName: '',
      searchDate: null,
      processList: [],
      selectedItem: {},
      headers: [
        {
          text: 'Nombre automatización',
          align: 'start',
          value: 'automationName',
        },
        { text: 'Estado', value: 'state' },
        { text: 'Última ejecución', value: 'lastRun' },
        { text: 'Siguiente ejecución', value: 'nextRun' },
        { text: 'Acciones', align: 'center', value: 'menu', sortable: false },
      ],
      menuItems: [{ text: 'Ver tracking', icon: 'mdi-eye-arrow-right' }],
      selectedCreateProcess: false,
      newProcessNameTMP: {},
      saving: false,
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  mounted() {
    this.loading = true
    this.getList()
    this.loading = false
  },
  methods: {
    async getList() {
      this.processList = await this.getAutomationsProcessesListByClientId(
        this.clientId
      )
    },
    async searchAction() {
      let dateFrom = ''
      let dateTo = ''
      if (this.searchDate !== null) {
        dateFrom = this.searchDate[0].toString()
        // eslint-disable-next-line prefer-destructuring
        dateTo = this.searchDate[1].toString()
      }
      const query = {
        clientId: this.clientId,
        processName: this.searchProcessName,
        automationName: this.searchAutomationName,
        dateFromCampaign: dateFrom,
        dateToCampaign: dateTo,
      }
      await this.getSearchAutomationsProcessesListByQuery(query)
    },
    seeTrackingActions() {
      this.ListProcessesActivated = false
    },
    returnListProcesses() {
      this.ListProcessesActivated = true
    },
    async newProcessAction(item) {
      this.saving = true
      const newItem = {
        clientId: this.clientId,
        processName: item,
      }
      const iAgree =
        await this.createAutomationProcessByClienteIdAndNameProcess(newItem)
      this.saving = false
      this.selectedCreateProcess = false
      if (iAgree) {
        this.getList()
      }
    },
  },
}
</script>
