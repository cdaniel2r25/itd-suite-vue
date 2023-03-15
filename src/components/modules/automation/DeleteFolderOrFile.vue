<template>
  <v-sheet outlined color="primary" rounded class="mx-2">
    <v-card>
      <v-card-text>
        <v-icon color="secondary"> mdi-alert-circle </v-icon>
        {{ title }}
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn small text color="primary" @click="$emit('cancel-action')"
          >cancelar</v-btn
        >
        <v-btn
          small
          outlined
          color="primary"
          @click="$emit('delete-definitive-file', fileItem)"
          >{{ elementToDelete }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  name: 'DeleteFolderOrFile',
  props: {
    title: {
      type: String,
      default: '',
    },
    elementToDelete: {
      type: String,
      default: 'Sí, eliminar',
    },
    fileItem: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
