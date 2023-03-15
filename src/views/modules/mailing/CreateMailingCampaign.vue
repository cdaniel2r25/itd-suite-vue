<template>
  <v-container fluid>
    <h1>Vista de creación de campaña</h1>
    <v-stepper elevation="0" non-linear vertical>
      <v-stepper-step editable step="1">
        Configuracion destinatarios
      </v-stepper-step>
      <v-stepper-content step="1">
        <database-table-uploader
          v-model="mailCampaign.database"
          :campaign="mailCampaign"
          :base-path="basePath"
        />
      </v-stepper-content>
      <v-stepper-step editable step="2">Datos generales</v-stepper-step>
      <v-stepper-content step="2">
        <create-campaign-form :mail-campaign="mailCampaign" />
      </v-stepper-content>
      <v-stepper-step editable step="3">Diseño</v-stepper-step>
      <v-stepper-content step="3">
        <design-tabs v-model="mailCampaign.database.headerConfig.fields" />
      </v-stepper-content>
      <v-stepper-step editable step="4">Validación y envío</v-stepper-step>
      <v-stepper-content step="4">
        <validate-campaign />
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>
<script>
import adminBffMixin from '@/mixins/services/adminBffMixin'
import CreateCampaignForm from '@/components/modules/mailing/CreateCampaignForm.vue'
import DatabaseTableUploader from '@/components/util/DatabaseTableUploader.vue'
import DesignTabs from '@/components/modules/mailing/campaign/DesignTabs.vue'
import ValidateCampaign from '@/components/modules/mailing/campaign/ValidateCampaign.vue'

export default {
  name: 'CreateMailingCampaign',
  components: {
    CreateCampaignForm,
    DatabaseTableUploader,
    DesignTabs,
    ValidateCampaign,
  },
  mixins: [adminBffMixin],
  data() {
    return {
      basePath: '/mailing-bff',
      currentStep: 1,
      mailCampaign: {
        database: {
          id: '',
          name: '',
          headerConfig: { fields: [] },
          singleUse: false,
          clientId: '',
          numberRows: 0,
          numberEmailTypeRow: 0,
          numberPhoneTypeRow: 0,
          typeId: 'string',
          verified: false,
          disabled: false,
          deleted: false,
        },
        generalData: {
          name: '',
          subject: '',
          body: '',
          sender: '',
          replyTo: '',
          duplicated: false,
          autoresend: false,
          interval: '',
          retrys: '',
          staticFileInput: [],
          dinamicUrl: '',
          dinamicFtp: {
            id: '',
            name: '',
            pathId: '',
            pathName: '',
          },
        },
      },
    }
  },
}
</script>
