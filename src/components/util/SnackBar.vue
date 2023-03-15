<template>
  <div>
    <v-snackbar
      v-model="snackbar.visible"
      bottom
      absolute
      :timeout="snackbar.timeout"
      :multi-line="snackbar.multiline === true"
      :color="snackbar.color"
      outlined
      elevation="24"
      min-width="95%"
      class="snack-bar-custom"
    >
      <v-layout align-center>
        <v-icon class="pr-4" :color="snackbar.color" large>
          {{ snackbar.icon }}
        </v-icon>
        <v-layout column>
          <div>{{ snackbar.text }}</div>
        </v-layout>
        <v-btn fab :color="snackbar.color" text @click="closeAlert">
          <v-icon> mdi-close</v-icon>
        </v-btn>
      </v-layout>
    </v-snackbar>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['snackbar']),
  },
  methods: {
    ...mapMutations(['closeAlert']),
  },
}
</script>

<style scoped>
.snack-bar-custom {
  z-index: 4;
}
</style>
