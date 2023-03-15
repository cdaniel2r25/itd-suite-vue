<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="12">
          <h1>Whatsapp masivos pendientes</h1>
        </v-col>
      </v-row>
      <div class="mt-6">
        <v-tabs v-model="tab">
          <v-tabs-slider />
          <v-row>
            <v-col cols="2">
              <v-tab> TODOS </v-tab>
            </v-col>
            <v-col cols="10">
              <activate-filters
                :filter-drawer="filterDrawer"
                label-name="Nombre"
                @activate-filter-drawer="filterDrawer = !filterDrawer"
                @activate-filter="activateFilter()"
                @change-name="changeName"
                @menu-actions="menuActions"
              />
            </v-col>
          </v-row>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card
                :height="filterDrawer ? 112 : 0"
                width="730"
                :style="filterDrawer ? '' : 'display: none'"
                class="mt-2 ml-auto mr-1"
              >
                <v-row class="px-4 my-2">
                  <v-col cols="6">
                    <v-select
                      v-model="filter.status"
                      dense
                      :items="statusList"
                      label="Estado"
                      hide-details
                      placeholder="Selecciona estado"
                      outlined
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="filter.clienteName"
                      dense
                      outlined
                      hide-details
                      label="Cliente"
                      placeholder="Ingresar nombre del cliente"
                    />
                  </v-col>
                </v-row>
                <v-btn text color="primary" @click="cleanFilters()">
                  limpiar filtros
                </v-btn>
              </v-card>
              <div class="my-4">
                <v-skeleton-loader v-if="loading" type="table" />
                <database-whatsapp-pending
                  v-else
                  :databases-list="databasesList"
                />
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-col>
  </v-container>
</template>

<script>
import administratorBffMixin from '@/mixins/services/administratorBffMixin'
import ActivateFilters from '@/components/modules/administrator/ActivateFilters.vue'
import DatabaseWhatsappPending from '@/components/modules/administrator/DatabaseWhatsappPending.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'WhatsappPending',
  components: { ActivateFilters, DatabaseWhatsappPending },
  mixins: [administratorBffMixin],
  data() {
    return {
      tab: 0,
      loading: false,
      databasesList: [],
      filterDrawer: false,
      filter: [{ name: '' }, { clienteName: '' }, { status: '' }],
      statusList: ['EN COLA', 'BORRADOR', 'EN ESPERA'],
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
      this.databasesList = await this.getListInMassiveWhatsappPendingByClientId(
        this.clientId
      )
      this.loading = false
    },
    async activateFilter() {
      this.loading = true
      const filterList = {
        clientId: this.clientId,
        filter: {
          clienteName: this.filter.clienteName,
          name: this.filter.name,
          status: this.filter.status,
        },
      }
      this.databasesList = await this.getListInBulkWhatsAppPendingByFilter(
        filterList
      )
      this.loading = false
      this.filterDrawer = false
    },
    changeName(filterName) {
      this.filter.name = filterName
    },
    menuActions(menuItem) {
      console.log(menuItem)
    },
    cleanFilters() {
      this.filter.name = ''
      this.filter.clienteName = ''
      this.filter.status = ''
    },
  },
}
</script>
