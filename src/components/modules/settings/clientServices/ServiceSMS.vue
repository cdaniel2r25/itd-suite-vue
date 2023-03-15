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
        <div v-if="input.type === 'check'" class="d-flex flex-row">
          <v-checkbox
            v-model="serviceObject[input.model]"
            :label="input.label"
            color="primary"
            class="mt-0 mx-2"
          />
          <v-tooltip right color="primary">
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
          v-model="serviceObject[input.model]"
          :label="input.label"
          outlined
          color="primary"
          class="mt-0 mx-2"
        />
        <v-select
          v-if="input.type === 'select'"
          v-model="serviceObject[input.model]"
          :items="input.items"
          :label="input.label"
          outlined
          class="mt-0 mx-2"
        />
        <v-select
          v-if="input.type === 'chipSelect'"
          v-model="serviceObject[input.model]"
          :items="senders"
          item-text="name"
          :label="input.label"
          outlined
          multiple
          chips
          height="55.99"
          class="mt-0 mx-2"
        />
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
              {{ serviceObject[input.model] }}
            </v-col>
          </v-col>
          <v-col class="pl-1">
            <v-slider
              v-model="serviceObject[input.model]"
              :step="0.1"
              :min="0"
              :max="10"
              dense
              thumb-label
            />
          </v-col>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12"> Palabras para lista negra </v-col>
      <v-col sm="12" md="4" lg="5">
        <v-text-field
          v-model="blacklistWord"
          placeholder="Añade palabras que deseas bloquear"
          dense
          outlined
        />
      </v-col>
      <v-col sm="12" md="2" lg="5" class="d-flex align-start">
        <v-btn
          color="primary"
          outlined
          :disabled="blacklistWord === ''"
          @click="addBlacklistWords()"
        >
          GUARDAR
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters class="flex-wrap overflow-y-auto chipsDiv mt-5 mb-10">
      <v-chip
        v-for="chip in serviceObject.blacklistWords"
        :key="chip.id"
        close
        class="mr-1 mb-2"
        @click:close="deleteBlacklistWords(chip)"
      >
        {{ chip.value }}
      </v-chip>
    </v-row>
    <v-row>
      <v-col cols="12"> Números para Recepción de SMS </v-col>
      <v-col cols="2">
        <v-select
          v-model="prefix"
          :items="countries"
          label="Código de área"
          item-value="prefix"
          dense
          height="40px"
          placeholder="Seleccionar código de área"
          outlined
        >
          <template v-slot:item="slotProps">
            <i :class="['mr-2', 'em', slotProps.item.flag]"></i>
            {{ slotProps.item.name }} (+{{ slotProps.item.prefix }})
          </template>
          <template v-slot:selection="{ item }">
            <!-- {{ item.flag }} -->
            <v-icon class="mr-2">{{ item.flag }}</v-icon> +{{ item.prefix }}
          </template>
        </v-select>
      </v-col>
      <v-col sm="12" md="4" lg="5">
        <v-text-field
          v-model="receiverNumber"
          type="number"
          placeholder="Añade números de recepción"
          dense
          outlined
        />
      </v-col>
      <v-col sm="12" md="2" lg="5" class="d-flex align-start">
        <v-btn
          color="primary"
          outlined
          :disabled="prefix === ''"
          @click="addReceiverNumber()"
        >
          GUARDAR
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters class="flex-wrap overflow-y-auto chipsDiv mt-5 mb-10">
      <v-chip
        v-for="chip in serviceObject.receiverNumbers"
        :key="chip.id"
        close
        class="mr-1 mb-2"
        @click:close="deleteReceiverNumber(chip)"
      >
        {{ chip.value }}
      </v-chip>
    </v-row>
  </div>
</template>

<script>
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'

export default {
  name: 'ServiceSMS',
  mixins: [whatsappBffMixin],
  props: {
    serviceObject: {
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
          type: 'check',
          model: 'allowLargeSms',
          label: 'Permitir SMS largos',
          tooltip: 'Lorem Ipsum1',
        },
        {
          type: 'check',
          model: 'failover',
          label: 'Usar Failover',
          tooltip: 'Lorem Ipsum',
        },
        {
          type: 'check',
          model: 'alphanumericSender',
          label: 'Remitente Alfanumérico',
          tooltip: 'Lorem Ipsum',
        },
        {
          type: 'check',
          model: 'blockDuplicates',
          label: 'Bloquear SMS Duplicados',
          tooltip: 'Lorem Ipsum',
        },
        {
          type: 'check',
          model: 'limited',
          label: 'SMS ilimitado',
          tooltip: 'Lorem Ipsum',
        },
        {
          type: 'check',
          model: 'retrySend',
          label: 'Reintentar envío de SMS',
          tooltip: 'Lorem Ipsum',
        },
        {
          type: 'space',
          class: 'my-10',
        },
        {
          type: 'chipSelect',
          model: 'senders',
          label: 'Remitente SMS',
        },
        {
          type: 'select',
          model: 'plan',
          label: 'Plan*',
          items: ['Ilimitado', 'Fijo', 'Demo'],
        },
        {
          type: 'text',
          model: 'smppValidationPeriod',
          label: 'Periodo validación SMPP ',
        },
        {
          type: 'text',
          model: 'smsPerSecond',
          label: 'SMS por segundo',
        },
        {
          type: 'slider',
          model: 'priority',
          label: 'Prioridad',
          items: ['Ilimitado', 'Fijo', 'Demo'],
        },
      ],
      blacklistWords: [],
      receiverNumber: '',
      receiverNumberIndex: 0,
      receiverNumbers: [],
      countries: [],
      blacklistWord: '',
      blacklistWordsIndex: 0,
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
    addBlacklistWords() {
      this.blacklistWordsIndex += 1
      this.serviceObject.blacklistWords.push({
        id: this.blacklistWordsIndex,
        value: `${this.blacklistWord}`,
      })
      this.blacklistWord = ''
    },
    deleteBlacklistWords(item) {
      this.serviceObject.blacklistWords =
        this.serviceObject.blacklistWords.filter((e) => e.id !== item.id)
    },
    addReceiverNumber() {
      this.receiverNumberIndex += 1
      this.serviceObject.receiverNumbers.push({
        id: this.receiverNumberIndex,
        value: `+${this.prefix} ${this.receiverNumber}`,
      })
      this.receiverNumber = ''
      this.prefix = ''
    },
    deleteReceiverNumber(item) {
      this.serviceObject.receiverNumbers =
        this.serviceObject.receiverNumbers.filter((e) => e.id !== item.id)
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
