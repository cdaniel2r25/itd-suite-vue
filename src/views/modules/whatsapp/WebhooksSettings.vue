<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div>
        <v-row no-gutters>
          <v-col cols="7">
            <h1>Webhooks</h1>
          </v-col>
          <v-col cols="5">
            <div class="d-flex justify-end">
              <v-btn color="primary" @click="createItem()">
                <v-icon> mdi-plus </v-icon>CREAR WEBHOOK
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <P class="my-2 mt-6">
              Aquí podrás agregar tus rutas para recibir notificaciones sobre
              tus envíos. También podrás crear nuevos webhooks.
            </P>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <v-skeleton-loader v-if="loading" type="table" />
            <webhooks-table
              v-else
              :webhooks-list="webhooksList"
              :headers="headers"
              @update-table="getWebhooks()"
              @edit-webhook="editWebhook"
              @delete-webhook="activeDeleteWebhook"
            />
          </v-col>
        </v-row>
      </div>
    </v-col>
    <add-webhooks-dialog
      v-model="addWebhookDialog"
      :new-webhook-item="newWebhookItem"
      @btn-add-action="registerNewWebhook()"
    />
    <delete-dialog
      v-model="deleteDialog"
      :element-to-delete="newWebhookItem.url"
      @btn-active-action="deleteWebhookById()"
    />
  </v-container>
</template>

<script>
import WebhooksTable from '@/components/modules/whatsapp/settings/WebhooksTable.vue'
import AddWebhooksDialog from '@/components/modules/whatsapp/settings/AddWebhooksDialog.vue'
import WhatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import DeleteDialog from '@/components/util/DeleteDialog.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'WebhooksSettings',
  components: { WebhooksTable, AddWebhooksDialog, DeleteDialog },
  mixins: [WhatsappBffMixin],
  data() {
    return {
      loading: false,
      addWebhookDialog: false,
      deleteDialog: false,
      addId: 1,
      headers: [
        { text: 'Estado', align: 'start', value: 'activated' },
        { text: 'Tipo evento', value: 'eventType' },
        { text: 'Webhook', value: 'url' },
        {
          text: 'Validado',
          align: 'center',
          value: 'validation',
          sortable: false,
        },
        { text: ' ', align: 'center', value: 'verifying' },
        { text: 'Acciones', align: 'center', value: 'menu', sortable: false },
      ],
      webhooksList: [],
      newWebhookItem: {},
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  async mounted() {
    this.getWebhooks()
  },
  methods: {
    async getWebhooks() {
      this.loading = true
      this.webhooksList = await this.getWebhooksByClient()
      this.loading = false
    },
    createItem() {
      const newItem = {
        id: null,
        activated: false,
        eventType: '',
        url: '',
        validation: false,
      }
      this.newWebhookItem = newItem
      this.addWebhookDialog = true
    },
    async registerNewWebhook() {
      this.loading = true
      this.addWebhookDialog = false
      await this.saveWebhook(this.newWebhookItem)
      this.loading = false
      this.getWebhooks()
    },
    editWebhook(event) {
      this.newWebhookItem = JSON.parse(JSON.stringify(event))
      this.addWebhookDialog = true
    },
    activeDeleteWebhook(event) {
      this.deleteDialog = true
      this.newWebhookItem = JSON.parse(JSON.stringify(event))
    },
    async deleteWebhookById() {
      this.loading = true
      this.deleteDialog = false
      await this.deleteWebhook(this.newWebhookItem.id)
      this.getWebhooks()
      this.loading = false
    },
  },
}
</script>
