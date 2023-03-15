<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="8">
          <h1>Listado de bases de datos</h1>
          <P class="my-2">
            Aquí podrás encontrar tus bases de datos e importar.
          </P>
        </v-col>
        <v-col cols="4">
          <v-btn
            v-if="can('CREATE_MAILING_CAMPAIGN', 'mailing')"
            color="primary"
            @click="$router.push({ name: 'ImportDatabase' })"
          >
            <v-icon> mdi-plus </v-icon>IMPORTAR BASE DE DATOS
          </v-btn>
        </v-col>
      </v-row>
      <div>
        <v-tabs v-model="tab">
          <v-tabs-slider />
          <v-tab> TODOS </v-tab>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <div class="my-2">
                <databases-table />
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-col>
  </v-container>
</template>
<script>
import permissionsMixin from '@/mixins/permissionsMixin'
import DatabasesTable from '@/components/modules/database/database/DatabasesTable.vue'

export default {
  name: 'Databases',
  components: { DatabasesTable },
  mixins: [permissionsMixin],
  data: () => ({
    tab: 0,
  }),
}
</script>
