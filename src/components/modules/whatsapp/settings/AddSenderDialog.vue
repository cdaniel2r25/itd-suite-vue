<template>
  <v-dialog v-model="show" persistent width="600px">
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
          Formulario de solicitud
        </div>
      </v-card-title>
      <v-card-text>
        <div class="px-13">
          <span>
            Por favor completa la siguiente información sobre tu empresa y el
            número que conectaras al canal WhatsApp Business API.
          </span>
          <div class="mt-10">
            <v-btn
              class="py-16 d-flex text-No-lowercase"
              color="gray300"
              width="100%"
              outlined
              @click="$emit('btn-existing-number-action')"
            >
              <v-row no-gutters>
                <v-col cols="4" class="d-flex align-center justify-center">
                  <v-icon x-large color="primary">mdi-message-text</v-icon>
                </v-col>
                <v-col cols="8" class="text-left text-no-wrap">
                  <div class="text-h5">Portar numero</div>
                  <div>Puedes usar una linea existente o</div>
                  <div style="word-wrap: break-word">solicitar una nueva</div>
                </v-col>
              </v-row>
            </v-btn>
            <v-btn
              class="my-10 py-16 d-flex text-No-lowercase"
              color="gray300"
              width="100%"
              outlined
              @click="$emit('btn-create-number-action')"
            >
              <v-row no-gutters>
                <v-col cols="4" class="d-flex align-center justify-center">
                  <v-icon x-large color="primary">mdi-whatsapp</v-icon>
                </v-col>
                <v-col cols="8" class="text-left text-no-wrap">
                  <div class="text-h5">Crear número</div>
                  <div>Puedes usar una línea</div>
                  <div>existente o solicitar una nueva</div>
                </v-col>
              </v-row>
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AddSenderDialog',
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
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
.text-No-lowercase {
  text-transform: none;
}
</style>
