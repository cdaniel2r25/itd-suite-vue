<template>
  <div class="pa-5">
    <v-row no-gutters>
      <v-col v-for="input in settingsInputs" :key="input.model" :cols="12">
        <!-- :cols="input.type === 'space' || input.type === 'title' ? 12 : 6"
      > -->
        <v-col
          v-if="input.type === 'title'"
          cols="12"
          :class="input.class"
          :style="input.style"
        >
          {{ input.label }}
        </v-col>
        <div
          v-if="input.type === 'slider'"
          class="mt-5"
          style="max-width: 500px"
        >
          <v-col cols="12" class="d-flex">
            <div class="pl-0 d-flex justify-start align-center">
              {{ input.label + ': ' }}
            </div>
            <v-col
              cols="6"
              class="ml-5 primary--text d-flex justify-start"
              style="font-weight: 500"
            >
              {{ whatsappObject[input.model] }}
            </v-col>
          </v-col>
          <v-col class="pl-1">
            <v-slider
              v-model="whatsappObject[input.model]"
              :step="0.1"
              :min="0"
              :max="10"
              dense
              thumb-label
            />
          </v-col>
        </div>
        <div v-if="input.type === 'check'" class="d-flex flex-row">
          <v-checkbox
            v-model="whatsappObject[input.model]"
            :label="input.label"
            color="primary"
            class="mt-0 mx-2"
          />
          <v-tooltip right max-width="200" color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                class="pl-2 pb-5"
                color="primary"
                v-bind="attrs"
                v-on="on"
              >
                mdi-help-circle-outline
              </v-icon>
            </template>
            <div>
              <div class="pb-2 white--text font-weight-bold">
                {{ input.tooltip }}
              </div>
            </div>
          </v-tooltip>
        </div>
        <div v-if="input.type === 'space'" class="my-10" />
        <v-text-field
          v-if="input.type === 'text'"
          v-model="whatsappObject[input.model]"
          :label="input.label"
          :placeholder="input.placeholder"
          :type="input.varType"
          outlined
          color="primary"
          class="mt-0 mx-2"
          :style="input.style"
        />
        <v-select
          v-if="input.type === 'select'"
          v-model="whatsappObject[input.model]"
          :items="senders"
          item-value="id"
          item-text="name"
          :label="input.label"
          outlined
          multiple
          :class="`mt-0 mx-2 ${input.class}`"
          :style="input.style"
        />
        <v-select
          v-if="input.type === 'chipSelect'"
          v-model="whatsappObject[input.model]"
          :items="senders"
          item-value="id"
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
  name: 'ServiceWhatsapp',
  mixins: [whatsappBffMixin],
  props: {
    whatsappObject: {
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
          type: 'title',
          label: 'Ajustes Servicio Whatsapp',
          class: 'mb-8 text-subtitle1',
          style: 'font-size: 1.25rem',
        },
        {
          type: 'select',
          model: 'senders',
          label: 'Conector',
          style: 'max-width: 500px',
        },
        {
          type: 'slider',
          model: 'priority',
          label: 'Prioridad',
          items: ['Ilimitado', 'Fijo', 'Demo'],
        },
        {
          type: 'check',
          model: 'forceAutoanswerApi',
          label: 'Forzar Autorrespuesta (API) Activo',
          tooltip:
            'Permite que por medio de API se envíe un mensaje como autorespuesta',
        },
        //
        {
          type: 'title',
          label: 'Desactivación automática de sesión',
          class: 'mt-5 text-subtitle1',
          style: 'font-size: 1.25rem',
        },
        //
        //
        {
          type: 'title',
          label:
            'Configura en cuantos minutos se desactivará la sesión del agente, cuando no haya actividad.',
          class: 'mb-8 text-subtitle1',
          style: 'font-size: 1.25rem; font-weight: 300',
        },
        //
        {
          type: 'text',
          model: 'sessionLogoutMinutes',
          label: 'Minutos de espera',
          placeholder: 'Ingresar minutos',
          varType: 'number',
          style: 'max-width: 500px',
        },
      ],
    }
  },

  async mounted() {
    this.getConnectors()
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

<style scoped>
.chipsDiv {
  width: 700px;
  max-height: 100px;
}
</style>
