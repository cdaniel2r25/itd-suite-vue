<template>
  <div class="mt-6 mx-2">
    <div class="d-flex mt-4">
      <v-icon color="secondary" left>mdi-lightbulb-outline</v-icon>
      Manejo de excepciones
    </div>
    <div class="mt-8">Configuración de excepciónes</div>
    <div class="mt-4 caption" style="line-height: 1rem">
      Para cuando no se cumpla con ninguna de las condiciones u opciones en la
      Autorespuesta.
    </div>
    <div class="mt-8">
      <v-radio-group
        v-model="
          autoresponderItem.autoresponsesSetting.exceptionHandlingStting
            .actionType
        "
        row
        hide-details
      >
        <v-radio
          value="back previous"
          class="align-start mb-2"
          @change="$emit('change-element')"
        >
          <template v-slot:label>
            <div class="d-flex flex-column">
              <div class="radio-style">Volver al menu anterior</div>
              <div
                v-if="
                  autoresponderItem.autoresponsesSetting.exceptionHandlingStting
                    .actionType === 'back previous'
                "
              >
                <v-textarea
                  v-model="
                    autoresponderItem.autoresponsesSetting
                      .exceptionHandlingStting.exceptionText
                  "
                  outlined
                  dense
                  rows="3"
                  hide-details
                  class="caption"
                  @change="$emit('change-element')"
                />
                <div class="gray300--text caption ml-1">
                  Ej. "Selecciona nuevamente una opción".
                </div>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio
          value="return initial"
          class="align-start mb-2"
          @change="$emit('change-element')"
        >
          <template v-slot:label>
            <div class="d-flex flex-column">
              <div class="radio-style">Volver al menu inicial</div>
              <div
                v-if="
                  autoresponderItem.autoresponsesSetting.exceptionHandlingStting
                    .actionType === 'return initial'
                "
              >
                <v-textarea
                  v-model="
                    autoresponderItem.autoresponsesSetting
                      .exceptionHandlingStting.exceptionText
                  "
                  outlined
                  dense
                  rows="3"
                  hide-details
                  class="caption"
                  @change="$emit('change-element')"
                />
                <div class="gray300--text caption ml-1">
                  Ej. "Selecciona nuevamente una opción".
                </div>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio
          value="Assign agent"
          class="align-start"
          @change="$emit('change-element')"
        >
          <template v-slot:label>
            <div class="d-flex flex-column">
              <div class="radio-style">Asignar un agente</div>
              <div
                v-if="
                  autoresponderItem.autoresponsesSetting.exceptionHandlingStting
                    .actionType === 'Assign agent'
                "
              >
                <v-textarea
                  v-model="
                    autoresponderItem.autoresponsesSetting
                      .exceptionHandlingStting.exceptionText
                  "
                  outlined
                  dense
                  rows="3"
                  hide-details
                  class="caption"
                  @change="$emit('change-element')"
                />
                <div class="gray300--text caption ml-1">
                  Ej. "Selecciona nuevamente una opción".
                </div>
              </div>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExceptionHandlingSetting',
  props: {
    autoresponderItem: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
<style scoped>
.radio-style {
  font-size: 0.85rem !important;
}
</style>
