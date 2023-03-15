<template>
  <div>
    <v-skeleton-loader v-if="loading" type="table" />
    <v-data-table
      v-else
      :headers="headers"
      :items="databasesList"
      hide-default-footer
    >
      <template v-slot:[`item.priority`]="{ item }">
        <v-text-field
          v-model="item.priority"
          dense
          placeholder="Ingresar"
          @change="changePriority(item)"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import administratorBffMixin from '@/mixins/services/administratorBffMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'DatabaseSummary',
  mixins: [administratorBffMixin, adminBffMixin],
  data() {
    return {
      databasesList: [],
      loading: false,
      headers: [
        { text: 'Id', value: 'clientId', width: 200 },
        { text: 'Cantidad', value: 'value', width: 200 },
        { text: 'Prioridad', value: 'priority', width: 200 },
        { text: 'Cliente', align: 'start', value: 'name' },
      ],
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
      this.databasesList = await this.getQueuedSummaryList()
      this.loading = false
    },
    async changePriority(item) {
      item.priority = await this.changeWhatsappQueuePriority(item).priority
    },
  },
}
</script>
