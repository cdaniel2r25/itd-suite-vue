<template>
  <div class="template-div">
    <v-radio-group
      v-model="selectedItem.configuration.privacySurvey"
      class="mt-10"
      @change="$emit('apply-saving')"
    >
      <template v-slot:label>
        <div class="mb-4"><h3>Privacidad de resultados de encuesta</h3></div>
      </template>
      <v-radio value="anonymous">
        <template v-slot:label>
          <div>Encuesta anónima</div>
          <tooltip
            message="Aqui mensaje"
            :right="tooltipTrue"
            :left="tooltipFalse"
          />
        </template>
      </v-radio>
      <v-radio value="database" class="align-start">
        <template v-slot:label>
          <div class="d-flex flex-column">
            <div class="d-inline-flex">
              <div>Encuesta con base de datos</div>
              <tooltip
                message="Aqui mensaje"
                :right="tooltipTrue"
                :left="tooltipFalse"
              />
            </div>
            <div v-if="selectedItem.configuration.privacySurvey === 'database'">
              <v-switch
                v-model="selectedItem.configuration.allowOnlyOneAnswer"
                label="Permitir solo una respuesta"
                hide-details
                dense
                @change="$emit('apply-saving')"
              />
            </div>
          </div>
        </template>
      </v-radio>
    </v-radio-group>
    <v-divider class="my-2"> </v-divider>
    <v-radio-group
      v-model="selectedItem.configuration.surveyDuration"
      class="mt-6"
      @change="$emit('apply-saving')"
    >
      <template v-slot:label>
        <div class="mb-4"><h3>Duración de encuesta</h3></div>
      </template>
      <v-radio value="limited" @change="$emit('apply-saving')">
        <template v-slot:label>
          <div>Ilimitada</div>
          <tooltip
            message="Aqui mensaje"
            :right="tooltipTrue"
            :left="tooltipFalse"
          />
        </template>
      </v-radio>
      <v-radio value="timeDuration">
        <template v-slot:label>
          <div>Asignar tiempo duración</div>
          <tooltip
            message="Aqui mensaje"
            :right="tooltipTrue"
            :left="tooltipFalse"
          />
        </template>
      </v-radio>
    </v-radio-group>
    <v-divider class="my-2"> </v-divider>
    <div class="my-6 font-weight-bold" style="color: rgba(0, 0, 0, 0.6)">
      Mensaje agradecimiento
    </div>
    <v-textarea
      v-model="selectedItem.configuration.thankYouMessage"
      no-resize
      rows="3"
      hide-details
      outlined
      placeholder="Ingresa tu mensaje de agradecimiento por responder..."
      @change="$emit('apply-saving')"
    />
  </div>
</template>

<script>
import Tooltip from '@/components/util/Tooltip.vue'

export default {
  name: 'ConfigurationSetting',
  components: { Tooltip },
  props: {
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tooltipTrue: true,
      tooltipFalse: false,
    }
  },
}
</script>
<style scoped>
.template-div {
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>
