<template>
  <v-container fluid fill-height>
    <v-row no-gutters>
      <v-col cols="12">
        <div class="scrollsettings">
          <v-data-table
            :headers="headers"
            :items="webhooksList"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:[`item.activated`]="{ item }">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <v-switch
                      v-model="item.activated"
                      color="greencheck"
                      :disabled="!item.validation"
                      @change="activateOption(item)"
                    />
                  </div>
                </template>
                <span> {{ item.activated ? 'Activado' : 'Desactivado' }}</span>
              </v-tooltip>
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
                    v-for="menuItem in menuItems"
                    :key="menuItem.action"
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
            <template v-slot:[`item.validation`]="{ item }">
              <v-icon :color="item.validation ? 'greencheck' : 'error'">
                {{ item.validation ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
            </template>
            <template v-slot:[`item.verifying`]="{ item }">
              <v-btn
                class="ma-2"
                outlined
                color="primary"
                @click="btnVerify(item)"
              >
                VERIFICAR
              </v-btn>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <check-webhooks-dialog
      v-model="activateCheckWebhooks"
      :verified-checking="verifiedChecking"
      :verified-status-false="verifiedStatusFalse"
      :verified-status-true="verifiedStatusTrue"
    />
  </v-container>
</template>

<script>
import CheckWebhooksDialog from '@/components/modules/whatsapp/settings/CheckWebhooksDialog.vue'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'

export default {
  name: 'WebhooksTable',
  components: { CheckWebhooksDialog },
  mixins: [whatsappBffMixin],
  props: {
    webhooksList: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activateCheckWebhooks: false,
      verifiedChecking: false,
      verifiedStatusTrue: false,
      verifiedStatusFalse: false,
      menuItems: [
        { text: 'Editar', icon: 'mdi-pencil' },
        { text: 'Eliminar', icon: 'mdi-delete' },
      ],
    }
  },
  methods: {
    async activateOption(item) {
      console.log(item)
      let statusWebhook = { id: item.id, status: item.activated }
      statusWebhook = await this.changeWebhookStatus(statusWebhook)
      item.activated = statusWebhook.status
      this.$emit('update-table')
    },
    menuActions(item, action) {
      if (action === 'Editar') {
        this.$emit('edit-webhook', item)
      } else if (action === 'Eliminar') {
        this.$emit('delete-webhook', item)
      }
    },
    async btnVerify(item) {
      this.verifiedChecking = false
      this.verifiedStatusFalse = false
      this.verifiedStatusTrue = false
      this.activateCheckWebhooks = true
      this.verifiedChecking = true
      const validation = await this.getWebhookStatus(item.id)
      if (validation) {
        setTimeout(() => {
          this.verifiedChecking = false
          this.verifiedStatusTrue = true
        }, 1000)
        item.validation = true
      } else {
        setTimeout(() => {
          this.verifiedChecking = false
          this.verifiedStatusFalse = true
        }, 1000)
        item.validation = false
        item.activated = false
      }
    },
  },
}
</script>
