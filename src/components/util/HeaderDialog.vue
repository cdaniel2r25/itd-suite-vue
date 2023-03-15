<template>
  <v-card-title class="text-h5 lighten-2 position">
    <v-btn
      v-if="activateCloseButton"
      color="grey"
      plain
      class="btn-cancel"
      @click="$emit('btn-close-action')"
    >
      <v-icon color="grey">mdi-close</v-icon>
    </v-btn>
    <div class="text-h5 lighten-2 text-center mr-4" style="width: 100%">
      {{ headerTitle }}
    </div>
  </v-card-title>
</template>

<script>
export default {
  name: 'HeaderDialog',
  props: {
    activateCloseButton: {
      type: Boolean,
      default: true,
    },
    headerTitle: {
      type: String,
      default: '',
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
.position {
  position: relative;
}
</style>
