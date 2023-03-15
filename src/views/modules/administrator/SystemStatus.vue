<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="12">
          <h1>Estado del sistema</h1>
        </v-col>
      </v-row>
      <div v-if="systemStatus" class="mt-6">
        <v-row no-gutters>
          <v-col cols="12" sm="9">
            <v-card elevation="0" color="gray100" class="mr-2">
              <v-card-subtitle class="pb-0">
                <span class="font-weight-bold">Hora de Sistema: </span>
                {{ systemStatus.systemTime }}
              </v-card-subtitle>
              <v-card-subtitle class="pt-0">
                <span class="font-weight-bold">
                  Ultima actualización de portabilidad numérica:
                </span>
                {{ systemStatus.lastPortabilityUpdateTime }}
              </v-card-subtitle>
            </v-card>
            <div class="mt-4 mr-2">
              <v-skeleton-loader v-if="loading" type="date-picker" />
              <internal-processes
                v-else
                :connection-list="systemProcess.systemProcess"
                @change-connection-item="changeConnectionItem"
              />
            </div>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card elevation="0" color="lightcyan" class="ml-1">
              <v-card-subtitle class="pb-1 font-weight-bold text-center">
                APIEXECUTORSERVICE
              </v-card-subtitle>
              <v-card-text>
                <v-row no-gutters>
                  <v-col cols="9" class="caption">Active Count</v-col>
                  <v-col cols="3" class="caption text-right">
                    {{ systemStatus.apiExecutorService.activeCount }}
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="9" class="caption">Completed Task Count</v-col>
                  <v-col cols="3" class="caption text-right">
                    {{ systemStatus.apiExecutorService.completeTaskCount }}
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="9" class="caption">Task Count</v-col>
                  <v-col cols="3" class="caption text-right">
                    {{ systemStatus.apiExecutorService.taskCount }}
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="9" class="caption">Pool Size</v-col>
                  <v-col cols="3" class="caption text-right">
                    {{ systemStatus.apiExecutorService.poolSize }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-container>
</template>

<script>
import InternalProcesses from '@/components/modules/administrator/InternalProcesses.vue'
import administratorBffMixin from '@/mixins/services/administratorBffMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'SystemStatus',
  components: { InternalProcesses },
  mixins: [administratorBffMixin],
  data() {
    return {
      loading: false,
      systemStatus: null,
      systemProcess: [],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  mounted() {
    this.getDatabaseList()
  },
  methods: {
    async getDatabaseList() {
      this.loading = true
      this.systemStatus = await this.getListInSystemState()
      this.systemProcess = await this.getSystemProcesses()
      this.loading = false
    },
    async changeConnectionItem(changeItem) {
      changeItem.processReference = 'process'
      const item = {
        processId: changeItem.processId,
        initiated: changeItem.initiated,
      }
      const itemResult = await this.changeInInitiatedByProcessId(item)
      changeItem = Object.assign(changeItem, itemResult)
    },
  },
}
</script>
