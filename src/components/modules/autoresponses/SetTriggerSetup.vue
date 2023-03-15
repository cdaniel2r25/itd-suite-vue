<template>
  <div>
    <div class="d-flex mt-4">
      <v-icon color="primary" class="icon-left mr-2">
        mdi-lightning-bolt-circle
      </v-icon>
      Entrada
    </div>
    <div class="mt-4 text-h6">Configura Disparador</div>
    <div class="mt-4">
      Crea gatillante o condición que va a disparar la autorrespuesta.
    </div>
    <v-select
      v-model="autoresponderItem.triggerSetting.triggerId"
      :items="conditionList"
      label="Condición"
      placeholder="Selecciona condición"
      dense
      outlined
      item-text="name"
      item-value="triggerId"
      class="mt-6"
    />
    <div v-if="autoresponderItem.triggerSetting.triggerId > 1">
      <v-textarea
        v-model="autoresponderItem.triggerSetting.conditionText"
        outlined
        dense
        rows="3"
        placeholder="Ingresa aquí tus palabras"
        hide-details
      />
      <div class="gray300--text caption ml-1">
        Ej. Hola, Tengo una consulta, Consulta...
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import customTableBffMixin from '@/mixins/services/autoresponses/autoresponsesBffMixin'

export default {
  name: 'SetTriggerSetup',
  mixins: [customTableBffMixin],
  props: {
    autoresponderItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      conditionList: null,
      activeConditionText: false,
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  watch: {
    'autoresponderItem.triggerSetting.conditionText': {
      handler() {
        this.$emit('change-element')
      },
    },
    'autoresponderItem.triggerSetting.triggerId': {
      handler() {
        this.$emit('change-element')
      },
    },
  },
  async mounted() {
    this.conditionList = await this.getListOfTriggerConditionsByClientId(
      this.clientId
    )
  },
  methods: {},
}
</script>
