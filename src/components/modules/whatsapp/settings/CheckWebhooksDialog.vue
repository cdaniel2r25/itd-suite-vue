<template>
  <v-dialog v-model="show" persistent width="500">
    <v-card>
      <v-card-title class="text-h5 lighten-2">
        <v-btn
          color="grey"
          plain
          class="btn-cancel"
          @click="$emit('change-model', false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div class="text-h5 lighten-2 text-center mr-4" style="width: 100%">
          Verificar webhooks
        </div>
      </v-card-title>
      <v-card-text>
        <div v-if="verifiedChecking" class="px-13 text-center">
          <div class="mt-7 warning--text">
            COMPROBANDO
            <v-progress-circular
              width="2"
              size="20"
              color="warning"
              indeterminate
              class="ml-2"
            />
          </div>
        </div>
        <div v-if="verifiedStatusTrue" class="mt-6">
          <v-card elevation="0" color="gray">
            <v-card-subtitle class="text-center p-6">
              <span class="font-weight-bold">Estado verificación:</span>
              <span class="greencheck--text"> ACTIVA </span>
            </v-card-subtitle>
          </v-card>
          <v-sheet outlined color="primary" rounded class="mt-4">
            <v-card outlined elevation="0" class="p-6">
              <v-card-subtitle class="p-6">
                <v-icon color="primary"> mdi-alert-circle</v-icon>
                Su url fue validada
              </v-card-subtitle>
            </v-card>
          </v-sheet>
        </div>
        <div v-if="verifiedStatusFalse" class="mt-6">
          <v-card elevation="0" color="gray">
            <v-card-subtitle class="text-center p-6">
              <span class="font-weight-bold">Estado verificación:</span>
              <span class="error--text"> NO HABILITADO </span>
            </v-card-subtitle>
          </v-card>
          <v-sheet outlined color="primary" rounded class="mt-4">
            <v-card outlined elevation="0" class="p-6">
              <v-card-subtitle class="p-6">
                <v-icon color="primary"> mdi-alert-circle</v-icon>
                Su url no fue validada
              </v-card-subtitle>
            </v-card>
          </v-sheet>
        </div>
        <v-card-actions class="justify-center pt-6">
          <v-btn
            v-if="!verifiedChecking"
            color="primary"
            @click="$emit('change-model', false)"
          >
            CERRAR
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CheckWebhooksDialog',
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    verifiedChecking: {
      type: Boolean,
      default: false,
    },
    verifiedStatusTrue: {
      type: Boolean,
      default: false,
    },
    verifiedStatusFalse: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style scoped>
.btn-cancel {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
}
</style>
