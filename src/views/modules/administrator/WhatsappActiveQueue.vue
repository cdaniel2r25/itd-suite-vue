<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="12">
          <h1>Whatsapp</h1>
        </v-col>
      </v-row>
      <div>
        <v-tabs v-model="tab">
          <v-tabs-slider />
          <v-tab> RESUMEN COLA </v-tab>
          <v-tab> EN PROCESO </v-tab>
          <v-tab>
            ÚLTIMOS ENVÍOS
            <v-tooltip right color="accent">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="pl-2" color="primary" v-bind="attrs" v-on="on">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <div>
                <div class="pb-2 white--text font-weight-bold help-text">
                  {{ helpText }}
                </div>
              </div>
            </v-tooltip>
          </v-tab>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <div class="my-2">
                <database-summary />
              </div>
            </v-tab-item>
            <v-tab-item>
              <database-process @total-records="totalRecords" />
            </v-tab-item>
            <v-tab-item>
              <div class="my-2">
                <database-latest-shipments />
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-col>
  </v-container>
</template>

<script>
import DatabaseSummary from '@/components/modules/administrator/DatabaseSummary.vue'
import DatabaseProcess from '@/components/modules/administrator/DatabaseProcess.vue'
import DatabaseLatestShipments from '@/components/modules/administrator/DatabaseLatestShipments.vue'

export default {
  name: 'WhatsappActiveQueue',
  components: { DatabaseSummary, DatabaseProcess, DatabaseLatestShipments },
  data() {
    return {
      tab: 0,
      helpText: '',
    }
  },
  methods: {
    totalRecords(total) {
      this.helpText = `${total} elementos encontrados. Mostrando todos los elementos.`
    },
  },
}
</script>
<style scoped>
.help-text {
  width: 200px;
  max-width: 200px;
}
</style>
