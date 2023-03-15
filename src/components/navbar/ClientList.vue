<template>
  <v-autocomplete
    v-model="selectedClient"
    :items="clients"
    item-text="name"
    item-value="id"
    fluid
    dense
    return-object
    hide-details
    @change="selectionChanged(selectedClient)"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import adminBffMixin from '@/mixins/services/adminBffMixin'

export default {
  mixins: [adminBffMixin],
  data() {
    return {
      selectedClient: null,
      clients: [],
    }
  },
  computed: {
    ...mapGetters(['userClientsList', 'clientId']),
  },
  created() {
    this.getClientList()
  },
  methods: {
    selectionChanged(client) {
      this.$store.commit('setClient', client)
    },
    getClientList() {
      this.clients = this.userClientsList
      this.selectedClient = this.clientId
    },
  },
}
</script>
