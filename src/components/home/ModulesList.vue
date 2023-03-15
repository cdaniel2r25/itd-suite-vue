<template>
  <v-container mt-16 fill-height fluid>
    <v-row justify="start">
      <div v-for="module in modules" :key="module.id" class="mx-12">
        <module-button :module-app="module" />
      </div>
    </v-row>
  </v-container>
</template>

<script>
import ModuleButton from '../util/ModuleButton.vue'

export default {
  name: 'ModulesList',

  components: {
    ModuleButton,
  },

  props: {
    modules: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
