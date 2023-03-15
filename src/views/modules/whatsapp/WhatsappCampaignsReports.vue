<template>
  <v-container class="pa-10" fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="8">
          <span class="text-h4">Campañas</span>
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
      <v-row no-gutters class="flex-column mb-5">
        <v-col cols="4" class="mb-5">
          Debe seleccionar una campaña para poder ver su reporte.
        </v-col>
        <v-col cols="4">
          <v-card outlined>
            <v-list two-line>
              <v-list-item-group
                v-model="selectedCampaign"
                active-class="primary--text"
              >
                <template v-for="(item, index) in campaigns">
                  <v-list-item :key="item.id">
                    <template v-slot:default="{ active }">
                      <v-list-item-content>
                        <v-list-item-title class="mb-3" v-text="item.name" />
                        <v-list-item-subtitle> Creación: </v-list-item-subtitle>
                        <v-list-item-subtitle v-text="item.createdAt" />
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-icon :color="!active ? 'accent' : 'primary'">
                          {{
                            !active
                              ? 'mdi-checkbox-blank-circle-outline'
                              : 'mdi-checkbox-blank-circle'
                          }}
                        </v-icon>
                      </v-list-item-action>
                    </template>
                  </v-list-item>

                  <v-divider v-if="index < campaigns.length - 1" :key="index" />
                </template>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
        <v-col v-if="campaign">
          <v-btn
            class="mt-5"
            color="primary"
            @click="
              $router.push({
                name: 'WhatsappSelectedCampaignMessagesReports',
                params: { campaign: campaign },
              })
            "
          >
            IR A VISTA
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '@/mixins/permissionsMixin'
import generalMixin from '@/mixins/util/generalMixin'
import dateMixin from '@/mixins/util/dateMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'

export default {
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
      campaign: null,
      campaigns: null,
      selectedCampaign: null,
    }
  },
  computed: {
    ...mapGetters(['userDefaultClient']),
  },
  watch: {
    selectedCampaign: {
      handler(value) {
        if (
          this.selectedCampaign !== null &&
          this.selectedCampaign !== undefined
        ) {
          this.campaign = this.campaigns[value].id
        } else {
          this.campaign = null
        }
      },
    },
  },
  beforeMount() {
    this.getCampaigns()
  },
  methods: {
    async getCampaigns() {
      this.campaigns = await this.getCampaignsByClientId(this.userDefaultClient)
    },
  },
}
</script>
<style scoped>
.scroll-list {
  height: 200px;
  overflow-y: auto;
}
</style>
