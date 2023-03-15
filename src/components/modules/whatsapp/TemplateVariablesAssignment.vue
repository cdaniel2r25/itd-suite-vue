<template>
  <v-container class="ma-0">
    <v-row>
      <v-col cols="12">
        <v-card v-if="template" width="50%" flat outlined>
          <v-card-title class="d-flex align-center justify-end accent--text">
            <v-col cols="4"> Corresponde a: </v-col>
          </v-card-title>
          <v-card-text>
            <v-form v-model="formModel">
              <div v-for="(item, index) in varList" :key="item">
                <v-row>
                  <v-divider />
                </v-row>
                <v-row class="d-flex pb-2">
                  <v-col cols="4" class="d-flex align-center">
                    <v-icon v-if="!isBody" :color="colors[0]">
                      mdi-circle
                    </v-icon>
                    <v-icon v-else :color="colors[item]">mdi-circle</v-icon>
                    <span class="text-h6 ml-2 accent--text">
                      {{ '{{' + item + '}' + '}' }}
                    </span>
                  </v-col>
                  <v-col cols="3">
                    <v-card
                      class="d-flex justify-center align-center"
                      height="100%"
                      flat
                      color="gray100"
                    >
                      <span class="text-h7 mr-2 gray300--text">Tipo: </span>
                      <span class="text-h6 gray300--text">
                        {{ isBody ? 'Body' : 'Head' }}
                      </span>
                    </v-card>
                  </v-col>
                  <v-col cols="1" class="d-flex justify-center align-center">
                    <v-icon large>mdi-arrow-right</v-icon>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-if="isBody"
                      v-model="campaign.template.bodyVars[index].value"
                      :items="selectedDatabaseArray"
                      item-value="field"
                      item-text="field"
                      label="Nombre columna"
                      placeholder="Seleccionar"
                      :rules="dynamicInputsRules"
                      outlined
                      hide-details
                    />
                    <v-select
                      v-else
                      v-model="campaign.template.headVars[index].value"
                      :items="selectedDatabaseArray"
                      item-value="field"
                      item-text="field"
                      label="Nombre columna"
                      placeholder="Seleccionar"
                      :rules="dynamicInputsRules"
                      outlined
                      hide-details
                    />
                  </v-col>
                </v-row>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import validationMixin from '@/mixins/validation/validationMixin'
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'

export default {
  mixins: [validationMixin, whatsappBffMixin],
  props: {
    template: {
      type: Object,
      default: () => ({}),
    },
    isBody: {
      type: Boolean,
      default: false,
    },
    selectedDatabaseArray: {
      type: Array,
      default: () => [],
    },
    campaign: {
      type: Object,
      default: () => ({}),
    },
    formValidation: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    colors: [
      '#0093B1',
      '#35AA50',
      '#ED9C04',
      '#F75D50',
      '#2BCCD7',
      '#749BFF',
      '#FBA59E',
      '#EDC102',
    ],
  }),
  computed: {
    varList() {
      if (!this.isBody)
        return Object.keys(this.campaign.template.headVars).length
      if (this.isBody)
        return Object.keys(this.campaign.template.bodyVars).length
      return []
    },
    formModel: {
      get() {
        return this.isBody ? this.formValidation.body : this.formValidation.head
      },
      set(val) {
        if (this.isBody) this.formValidation.body = val
        this.formValidation.head = val
      },
    },
    dynamicInputsRules() {
      return [(v) => this.isRequired(v, 'Este')]
    },
  },
}
</script>
