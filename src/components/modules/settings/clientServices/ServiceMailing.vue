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
              {{ mailingObject[input.model] }}
            </v-col>
          </v-col>
          <v-col class="pl-1">
            <v-slider
              v-model="mailingObject[input.model]"
              :step="0.1"
              :min="0"
              :max="10"
              dense
              thumb-label
            />
          </v-col>
        </div>
        <div v-if="input.type === 'check'" class="d-flex">
          <v-checkbox
            v-model="mailingObject[input.model]"
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
          v-model="mailingObject[input.model]"
          :label="input.label"
          outlined
          color="primary"
          class="mt-0 mx-2"
        />
        <v-select
          v-if="input.type === 'select'"
          v-model="mailingObject[input.model]"
          :items="input.items"
          :label="input.label"
          outlined
          :class="`mt-0 mx-2 ${input.class}`"
          :style="input.style"
        />
        <v-select
          v-if="input.type === 'chipSelect'"
          v-model="mailingObject[input.model]"
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
  name: 'ServiceMailing',
  mixins: [whatsappBffMixin],
  props: {
    mailingObject: {
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
          label: 'Adjuntos Servicio Mailing',
          class: 'mb-8 text-subtitle1',
          style: 'font-size: 1.25rem',
        },
        {
          type: 'select',
          model: 'plan',
          label: 'Plan *',
          items: ['Ilimitado', 'Fijo', 'Demo'],
          style: 'max-width: 500px',
        },
        {
          type: 'slider',
          model: 'vmsPriority',
          label: 'Prioridad VMS',
          items: ['Ilimitado', 'Fijo', 'Demo'],
        },
        //
        {
          type: 'title',
          label: 'Adjuntos',
          class: 'mb-8 text-subtitle1',
          style: 'font-size: 1.25rem',
        },
        //
        {
          type: 'check',
          model: 'allowStaticAttachments',
          label: 'Permitir adjuntos estáticos',
          tooltip: 'Lorem Ipsum',
        },
        {
          type: 'check',
          model: 'allowDynamicAttachments',
          label: 'Permitir adjuntos dinámicos',
          tooltip: 'Lorem Ipsum',
        },
        {
          type: 'title',
          label: 'Conectores',
          class: 'mb-8 text-subtitle1',
          style: 'font-size: 1.25rem',
        },
        {
          type: 'check',
          model: 'googleAnalytics',
          label: 'Link Tracking Google Analytics',
          tooltip: 'Lorem Ipsum',
        },
        {
          type: 'check',
          model: 'smtpResolveLink',
          label: 'Link resolver para SMTP',
          tooltip: 'Lorem Ipsum',
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
    addBlacklistWords() {
      this.blacklistWordsIndex += 1
      this.mailingObject.blacklistWords.push({
        id: this.blacklistWordsIndex,
        value: `${this.blacklistWord}`,
      })
      this.blacklistWord = ''
    },
    deleteBlacklistWords(item) {
      this.mailingObject.blacklistWords =
        this.mailingObject.blacklistWords.filter((e) => e.id !== item.id)
    },
    addReceiverNumber() {
      this.receiverNumberIndex += 1
      this.mailingObject.receiverNumbers.push({
        id: this.receiverNumberIndex,
        value: `+${this.prefix} ${this.receiverNumber}`,
      })
      this.receiverNumber = ''
      this.prefix = ''
    },
    deleteReceiverNumber(item) {
      this.mailingObject.receiverNumbers =
        this.mailingObject.receiverNumbers.filter((e) => e.id !== item.id)
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
