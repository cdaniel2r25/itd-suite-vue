<template>
  <div class="mt-4 rounded" :class="backgroundColor">
    <v-btn
      :class="{ 'py-16': isBox }"
      class="flex-column"
      color="primary"
      width="100%"
      outlined
      @click="$emit('open-file-input')"
    >
      <div class="d-flex flex-column">
        <div class="caption gray300--text">
          {{ title }}
        </div>
        <div>
          {{ text }}
          <v-icon class="ml-2"> {{ icon }} </v-icon>
        </div>
      </div>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'ImportDocumentButton',
  props: {
    title: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: 'Importar',
    },
    icon: {
      type: String,
      default: 'mdi-plus-box-multiple',
    },
    isBox: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: null,
    },
  },
}
</script>
