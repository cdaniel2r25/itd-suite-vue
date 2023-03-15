<template>
  <v-card max-width="335">
    <v-card-text>
      <v-container fill-height fluid>
        <v-row align="start">
          <v-col
            v-for="module in modules"
            :key="module.id"
            cols="4"
            class="d-flex justify-center"
          >
            <module-button :module-app="module" is-modal />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import ModuleButton from '@/components/util/ModuleButton.vue'

export default {
  name: 'ModulesListModal',
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

<style lang="scss" scoped></style>
