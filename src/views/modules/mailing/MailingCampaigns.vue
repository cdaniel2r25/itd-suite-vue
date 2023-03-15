<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="8">
          <h1>Vista de listado de campañas</h1>
        </v-col>
        <v-col cols="4">
          <v-btn
            v-if="can('CREATE_MAILING_CAMPAIGN', 'mailing')"
            color="primary"
            @click="$router.push({ name: 'MailingCreateCampaign' })"
          >
            <v-icon dark> mdi-plus </v-icon>Crear Campaña
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <v-card class="pa-2" tile flat> Filtros </v-card>
          <v-card class="pa-2" tile flat> Listado </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>
<script>
import permissionsMixin from '@/mixins/permissionsMixin'

export default {
  name: 'MailingCampaigns',
  mixins: [permissionsMixin],
}
</script>
