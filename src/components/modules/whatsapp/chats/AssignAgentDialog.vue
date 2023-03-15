<template>
  <v-dialog v-model="show" persistent width="500">
    <v-card class="pb-6">
      <header-dialog
        header-title="Asignar agente"
        @btn-close-action="cancelDialog()"
      />
      <v-card-subtitle class="mt-6 text-center">
        Selecciona agentes disponibles para asignar.
      </v-card-subtitle>
      <v-card-text class="my-4">
        <v-combobox
          v-model="selectAgent"
          :items="listAgent"
          item-value="id"
          item-text="name"
          label="Agentes disponibles"
          placeholder="Buscar..."
          outlined
          hide-details
          dense
          class="mx-10"
        />
      </v-card-text>
      <footer-dialog
        :valid="selectAgent && selectAgent.length !== 0"
        @btn-close-action="cancelDialog()"
        @btn-active-action="activeAgents()"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import HeaderDialog from '@/components/util/HeaderDialog.vue'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import FooterDialog from '@/components/util/FooterDialog.vue'
import { mapGetters } from 'vuex'

export default {
  components: { HeaderDialog, FooterDialog },
  mixins: [whatsappBffMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    listAgent: null,
    selectAgent: null,
    valid: false,
  }),
  computed: {
    ...mapGetters(['clientId']),
  },
  async mounted() {
    const filter = {
      page: -1,
    }
    const agents = await this.getFilterAgent(filter)
    this.listAgent = await agents.dataList
  },
  methods: {
    cancelDialog() {
      this.$emit('change-model', false)
    },
    activeAgents() {
      this.$emit('assign-agents', this.selectAgent)
      this.cancelDialog()
    },
  },
}
</script>
