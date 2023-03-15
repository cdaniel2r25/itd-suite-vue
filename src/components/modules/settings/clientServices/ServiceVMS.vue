<template>
  <div class="pa-5">
    <v-row class="mb-8 text-subtitle1" style="font-size: 1.25rem">
      <v-col cols="12"> Ajustes Servicio SMS </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col
        v-for="input in settingsInputs"
        :key="input.model"
        :cols="input.type !== 'space' ? 6 : 12"
      >
        <div v-if="input.type === 'slider'" class="mt-5">
          <v-col cols="12" class="d-flex">
            <div class="pl-0 d-flex justify-start align-center">
              {{ input.label + ': ' }}
            </div>
            <v-col
              cols="6"
              class="ml-5 primary--text d-flex justify-start"
              style="font-weight: 500"
            >
              {{ vmsObject[input.model] }}
            </v-col>
          </v-col>
          <v-col class="pl-1">
            <v-slider
              v-model="vmsObject[input.model]"
              :step="0.1"
              :min="0"
              :max="10"
              dense
              thumb-label
            />
          </v-col>
        </div>
        <v-checkbox
          v-if="input.type === 'radio'"
          v-model="vmsObject[input.model]"
          :label="input.label"
          color="primary"
          class="mt-0 mx-2"
        />
        <div v-if="input.type === 'space'" class="my-10" />
        <v-text-field
          v-if="input.type === 'text'"
          v-model="vmsObject[input.model]"
          :label="input.label"
          :type="input.varType"
          :hint="input.hint"
          :persistent-hint="input.persistentHint"
          outlined
          color="primary"
          class="mt-0 mx-2"
        />
        <v-select
          v-if="input.type === 'select'"
          v-model="vmsObject[input.model]"
          :items="input.items"
          :label="input.label"
          outlined
          class="mt-0 mx-2"
        />
        <v-select
          v-if="input.type === 'chipSelect'"
          v-model="vmsObject[input.model]"
          :items="senders"
          item-text="name"
          :label="input.label"
          outlined
          multiple
          chips
          height="55.99"
          class="mt-0 mx-2"
        />
      </v-col>
      <v-col cols="12" class="pl-2 accent--text"> * Campo obligatorio </v-col>
    </v-row>
  </div>
</template>

<script>
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'

export default {
  name: 'ServiceVMS',
  mixins: [whatsappBffMixin],
  props: {
    vmsObject: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      senders: [],
      prefix: '',
      settingsInputs: [
        {
          type: 'select',
          model: 'plan',
          label: 'Plan *',
          items: ['Ilimitado', 'Fijo', 'Demo'],
        },
        {
          type: 'text',
          model: 'defaultContext',
          label: 'Contexto por defecto',
          varType: 'text',
        },
        {
          type: 'text',
          model: 'creditsDuration',
          label: 'Duración créditos VMS',
          varType: 'number',
          hint: 'Relación de segundos de VMS por créditos',
          persistentHint: true,
        },
        {
          type: 'text',
          model: 'hangupTime',
          label: 'Tiempo antes de cortar llamada (ms)',
          varType: 'number',
          hint: 'En milisegundos',
          persistentHint: true,
        },
        {
          type: 'slider',
          model: 'vmsPriority',
          label: 'Prioridad VMS',
          items: ['Ilimitado', 'Fijo', 'Demo'],
        },
      ],
      countries: [],
    }
  },

  async mounted() {
    this.getConnectors()
    this.countries = await this.getAllFlagsPrefix()
  },

  methods: {
    async getConnectors() {
      const filterService = {
        statusList: [1, 2],
        page: -1,
      }

      const senderObject = await this.getSendersByClient(filterService)
      this.senders = await senderObject.dataList
    },
  },
}
</script>
