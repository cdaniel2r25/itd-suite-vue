<template>
  <v-dialog v-model="activateDialog" width="550">
    <v-card>
      <v-card-title class="text-h5 lighten-2 d-flex justify-space-between">
        <div>{{ title }}</div>
        <v-btn color="grey" plain @click="$emit('change-model', false)">
          <v-icon color="grey">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text align="center">
        <v-icon x-large color="warning" class="pb-5"> mdi-alert-circle </v-icon>
        <br />
        {{ bodyText }}
      </v-card-text>
      <v-card-actions class="justify-center pb-10">
        <v-btn
          large
          outlined
          color="primary"
          @click="$emit('change-model', false)"
        >
          {{ buttonCancel }}
        </v-btn>
        <v-btn
          large
          color="primary"
          depressed
          class="ml-5"
          @click="$emit('btn-active-action')"
        >
          {{ buttonAction }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'SimpleDialog',
  model: {
    prop: 'activateDialog',
    event: 'change-model',
  },
  props: {
    activateDialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    bodyText: {
      type: String,
      default: '',
    },
    buttonCancel: {
      type: String,
      default: 'CANCELAR',
    },
    buttonAction: {
      type: String,
      default: 'CONTINUAR',
    },
  },
}
</script>
