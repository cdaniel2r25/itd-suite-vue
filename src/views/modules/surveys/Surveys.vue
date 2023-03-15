<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div>
        <div class="d-flex justify-space-between">
          <div>
            <h1>Listado de encuestas</h1>
            <P class="my-2"> Aquí podrás ver encuestas y crear nuevas. </P>
          </div>
          <div>
            <v-btn
              color="primary"
              class="mt-2"
              @click="$router.push({ name: 'NewSurveys' })"
            >
              <v-icon> mdi-plus </v-icon>crear encuesta
            </v-btn>
          </div>
        </div>
        <div class="mt-6">
          <database-records
            v-if="activeTab"
            @change-tab-list="activeTab = false"
          />
          <database-list
            v-if="!activeTab"
            @change-tab-list="activeTab = true"
          />
        </div>
      </div>
    </v-col>
  </v-container>
</template>

<script>
import DatabaseRecords from '@/components/modules/surveys/DatabaseRecords.vue'
import DatabaseList from '@/components/modules/surveys/DatabaseList.vue'

export default {
  name: 'Surveys',
  components: { DatabaseRecords, DatabaseList },
  data() {
    return {
      activeTab: true,
    }
  },
}
</script>
