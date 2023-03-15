<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div>
        <databases-table />
      </div>
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import DatabasesTable from '@/components/modules/autoresponses/DatabasesTable.vue'

export default {
  name: 'Autoresponses',
  components: { DatabasesTable },
  computed: {
    ...mapGetters(['clientId']),
  },
  methods: {},
}
</script>
