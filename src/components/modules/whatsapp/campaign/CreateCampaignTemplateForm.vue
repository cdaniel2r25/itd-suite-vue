<template>
  <div>
    <div>
      <v-row class="d-none">
        <v-col cols="12">
          Selecciona qué tipo de envío whatsapp quieres realizar.
        </v-col>
      </v-row>
      <v-row class="d-none">
        <v-radio-group v-model="radioGroup" row class="ml-4">
          <div
            v-for="input in sendTypeInputs"
            :key="input.id"
            class="d-flex mr-10"
          >
            <v-radio class="mr-2" :label="input.label" :value="input.value" />
            <v-icon color="primary"> mdi-help-circle-outline </v-icon>
          </div>
        </v-radio-group>
      </v-row>
    </div>
    <v-row>
      <v-col cols="12"> Selecciona una plantilla para tu campaña. </v-col>
    </v-row>
    <v-row class="d-flex mt-10">
      <v-col cols="12">
        <saved-message-templates
          v-if="savedTemplates.length > 0"
          :campaign="campaign"
          :saved-templates="savedTemplates"
          :selected-template="selectedTemplate"
          :validation="validation"
          @template-to-edit="templateToEdit"
          @clean-template-to-edit="cleanTemplateToEdit"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import validationMixin from '@/mixins/validation/validationMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import templateBffMixin from '@/mixins/services/whatsapp/templateBffMixin'
import SavedMessageTemplates from '@/components/modules/whatsapp/campaign/SavedMessageTemplates.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    SavedMessageTemplates,
  },
  mixins: [validationMixin, whatsappBffMixin, adminBffMixin, templateBffMixin],
  props: {
    campaign: {
      type: Object,
      default: () => ({}),
    },
    isTemplateNameRepeated: {
      type: Boolean,
      default: false,
    },
    selectedTemplate: {
      type: Object,
      default: () => ({}),
    },
    validation: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    radioGroup: 1,
    sendTypeInputs: [
      {
        id: 1,
        input: 'normalSendRadio',
        label: 'Envío normal',
        value: 1,
        type: 'radio',
      },
      {
        id: 2,
        input: 'randomSendRadio',
        label: 'Envío aleatorio',
        value: 2,
        type: 'radio',
      },
    ],
    savedTemplates: [],
  }),
  computed: {
    ...mapGetters(['clientId']),
  },
  created() {
    this.populateTemplates()
  },
  methods: {
    templateToEdit(selectedTemplate) {
      this.$emit('edit-template-selected', selectedTemplate)
    },
    cleanTemplateToEdit() {
      this.$emit('clean-edit-template-selected')
    },
    async populateTemplates() {
      const filterService = {
        clientId: this.clientId,
        page: -1,
        statusList: [1],
      }

      const templatesListTMP = await this.getTemplates(filterService)

      this.savedTemplates = templatesListTMP.dataList
    },
  },
}
</script>
