<template>
  <v-dialog v-model="dialogActivator" persistent max-width="30%">
    <v-card>
      <div class="d-flex justify-end mb-n8">
        <v-btn
          class="ml-15"
          color="grey"
          plain
          @click="$emit('change-model', false)"
        >
          <v-icon color="grey">mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="pa-10">
        <v-card-title
          class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
        >
          <v-spacer />
          <div>{{ dialogTitle }}</div>
          <v-spacer />
        </v-card-title>
        <v-card-text align="center">
          <div class="mb-8">{{ dialogSubtitle }}</div>
          <div
            v-if="apiRequestLoading"
            class="d-flex justify-center flex-row warning--text"
          >
            PROBANDO...
            <v-icon class="ml-5" color="warning">mdi-spin mdi-loading</v-icon>
          </div>
          <div v-else class="d-flex flex-column">
            <v-card flat class="gainsboro mb-5 pa-3">
              <v-card-text
                class="d-flex justify-center accent--text text-subtitle-1"
              >
                Estado conector:
                <v-icon
                  class="pl-2"
                  :color="isConnectorActive ? 'success' : 'error'"
                >
                  {{ isConnectorActive ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
              </v-card-text>
            </v-card>
            <v-sheet
              outlined
              rounded
              :color="isConnectorActive ? 'success' : 'error'"
            >
              <v-card flat>
                <v-card-text
                  class="d-flex justify-space-between accent--text text-subtitle-1"
                >
                  <v-icon
                    class="pr-5"
                    :color="isConnectorActive ? 'success' : 'error'"
                  >
                    {{
                      isConnectorActive
                        ? 'mdi-check-circle'
                        : 'mdi-close-circle'
                    }}
                  </v-icon>
                  {{
                    isConnectorActive
                      ? 'Conector se encuentra habilitado.'
                      : 'Conector se encuentra deshabilitado.'
                  }}
                  <v-spacer></v-spacer>
                </v-card-text>
              </v-card>
            </v-sheet>
          </div>
        </v-card-text>
      </div>
      <v-card-actions v-if="!apiRequestLoading" class="justify-center pb-10">
        <v-btn
          large
          outlined
          color="primary"
          @click="$emit('change-model', false)"
        >
          CERRAR
        </v-btn>
        <v-btn
          v-if="!apiRequestLoading && !isConnectorActive"
          large
          color="primary"
          depressed
          class="ml-5"
          @click="$emit('btn-active-action')"
        >
          REVISAR CONECTOR
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TestConnectorDialog',
  model: {
    prop: 'dialogActivator',
    event: 'change-model',
  },
  props: {
    dialogActivator: {
      type: Boolean,
      default: false,
    },
    isConnectorActive: {
      type: Boolean,
      default: false,
    },
    apiRequestLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogTitle: 'Probar conector',
      dialogSubtitle: 'Comprueba si el conector está habilitado.',
    }
  },
}
</script>
