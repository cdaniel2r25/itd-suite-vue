<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12">
        <v-btn
          text
          color="primary"
          class="px-0"
          @click="$emit('btn-cancel-action')"
        >
          <v-icon color="primary"> mdi-arrow-left </v-icon>
          VOLVER A PROCESOS
        </v-btn>
        <h1>Tracking de ejecuciones</h1>
        <P class="my-6">
          Aquí podrás ver el seguimiento de todas las ejecuciones de una
          automatización.
        </P>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card outlined>
          <v-card-text>
            <b>Automatización:</b> {{ selectedItem.automationName }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-tabs v-model="tab" show-arrows color="primary" class="mt-4">
      <v-tab v-for="item in mainTabsHeaders" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <div class="mt-4">
      <v-skeleton-loader v-if="loading" type="table" />
      <div v-else>
        <v-data-table
          v-if="processList"
          dense
          :headers="headers"
          :items="processList"
          class="striped-table"
        >
          <template v-slot:[`item.state`]="{ item }">
            <span v-if="isStateProgress(item.state)" class="warning--text">
              {{ DATABASE_STATE_TEXT[item.state] }}
              <v-icon small class="warning--text rotate"> mdi-sync </v-icon>
            </span>
            <span v-if="isStateFinished(item.state)" class="greencheck--text">
              {{ DATABASE_STATE_TEXT[item.state] }}
            </span>
            <span v-if="isStateStopped(item.state)" class="gray300--text">
              {{ DATABASE_STATE_TEXT[item.state] }}
            </span>
            <span v-if="isStateWait(item.state)" class="warning--text">
              {{ DATABASE_STATE_TEXT[item.state] }}
            </span>
            <span v-if="isStateError(item.state)" class="error--text">
              {{ DATABASE_STATE_TEXT[item.state] }}
            </span>
          </template>
          <template v-slot:[`item.menu`]="{ item }">
            <v-menu bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="primary" v-bind="attrs" v-on="on">
                  <v-icon> mdi-dots-vertical </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(menuItem, index) in menuItems"
                  :key="index"
                  @click="menuActions(item, menuItem.text)"
                >
                  <v-list-item-icon>
                    <v-icon>{{ menuItem.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </div>
    </div>
    <see-detail-dialog
      v-model="activateSeeDetail"
      :selected-automation="selectedAutomation"
      @btn-close-action="activateSeeDetail = false"
    />
  </div>
</template>

<script>
import automationBffMixin from '@/mixins/services/automationBffMixin'
import SeeDetailDialog from '@/components/modules/automation/SeeDetailDialog.vue'

export default {
  name: 'ExecutionTracking',
  components: { SeeDetailDialog },
  mixins: [automationBffMixin],
  props: {
    selectedItem: {
      type: Object,
      default: () => [],
    },
    clientId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      tab: null,
      filter: 'all',
      mainTabsHeaders: [
        'TODAS',
        'EN CURSO',
        'EN ESPERA',
        'ERROR',
        'DETENIDO',
        'FINALIZADO',
      ],
      processList: null,
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
        },
        { text: 'Inicio', value: 'startDate' },
        { text: 'Fin', value: 'endDate' },
        { text: 'Estado', value: 'state' },
        { text: 'Acciones', align: 'center', value: 'menu', sortable: false },
      ],
      menuItems: [{ text: 'Ver detalle', icon: 'mdi-eye-arrow-right' }],
      activateSeeDetail: false,
      selectedAutomation: {
        name: '',
        item: '',
        state: '',
        color: '',
      },
    }
  },
  watch: {
    tab: {
      handler(value) {
        if (value === 0) {
          this.filter = 'all'
        } else if (value === 1) {
          this.filter = 'progress'
        } else if (value === 2) {
          this.filter = 'wait'
        } else if (value === 3) {
          this.filter = 'error'
        } else if (value === 4) {
          this.filter = 'stopped'
        } else if (value === 5) {
          this.filter = 'finished'
        }
        this.listTrackingProcess()
      },
    },
  },
  created() {
    this.DATABASE_STATE_TEXT = {
      progress: 'EN CURSO',
      finished: 'FINALIZADO',
      stopped: 'DETENIDO',
      wait: 'EN ESPERA',
      error: 'ERROR',
    }
  },
  mounted() {
    this.listTrackingProcess()
  },
  methods: {
    async listTrackingProcess() {
      this.loading = true
      this.processList =
        await this.getTrackingListAutomationProcessesByClientIdAndSelectedIdAndFilter(
          this.clientId,
          this.selectedItem.id,
          this.filter
        )
      this.loading = false
    },
    isStateProgress(state) {
      if (state === 'progress') {
        return true
      }
      return false
    },
    isStateFinished(state) {
      if (state === 'finished') {
        return true
      }
      return false
    },
    isStateStopped(state) {
      if (state === 'stopped') {
        return true
      }
      return false
    },
    isStateWait(state) {
      if (state === 'wait') {
        return true
      }
      return false
    },
    isStateError(state) {
      if (state === 'error') {
        return true
      }
      return false
    },
    menuActions(item, action) {
      if (action === 'Ver detalle') {
        this.activateSeeDetail = true
        this.selectedAutomation.item = item
        this.selectedAutomation.name = this.selectedItem.automationName
        if (item.state === 'progress') {
          this.selectedAutomation.state = this.DATABASE_STATE_TEXT.progress
          this.selectedAutomation.color = 'warning--text'
        }
        if (item.state === 'wait') {
          this.selectedAutomation.state = this.DATABASE_STATE_TEXT.wait
          this.selectedAutomation.color = 'warning--text'
        }
        if (item.state === 'error') {
          this.selectedAutomation.state = this.DATABASE_STATE_TEXT.error
          this.selectedAutomation.color = 'error--text'
        }
        if (item.state === 'stopped') {
          this.selectedAutomation.state = this.DATABASE_STATE_TEXT.stopped
          this.selectedAutomation.color = 'gray300--text'
        }
        if (item.state === 'finished') {
          this.selectedAutomation.state = this.DATABASE_STATE_TEXT.finished
          this.selectedAutomation.color = 'greencheck--text'
        }
      }
    },
  },
}
</script>
