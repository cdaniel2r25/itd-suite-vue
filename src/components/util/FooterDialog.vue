<template>
  <v-card-actions class="justify-center">
    <v-btn
      v-if="activateCloseButton"
      large
      outlined
      color="primary"
      @click="$emit('btn-close-action')"
    >
      CANCELAR
    </v-btn>
    <v-btn
      :disabled="!valid"
      large
      color="primary"
      :class="{ 'ml-5': activateCloseButton }"
      @click="$emit('btn-active-action')"
    >
      {{ buttonLabel }}
    </v-btn>
  </v-card-actions>
</template>

<script>
export default {
  name: 'HeaderDialog',
  props: {
    activateCloseButton: {
      type: Boolean,
      default: true,
    },
    buttonLabel: {
      type: String,
      default: 'GUARDAR',
    },
    valid: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style></style>
