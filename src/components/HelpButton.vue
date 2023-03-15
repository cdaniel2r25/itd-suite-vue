<template>
  <div>
    <v-speed-dial
      id="no-left"
      v-model="showButton"
      fixed
      direction="right"
      bottom
      left
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-tooltip top :disabled="showButton">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" fab v-bind="attrs" v-on="on">
              <v-icon v-if="showButton"> mdi-close </v-icon>
              <v-icon v-else> mdi-whatsapp </v-icon>
            </v-btn>
          </template>
          <span>Ayuda soporte</span>
        </v-tooltip>
      </template>
      <v-btn class="rounded" color="primary">
        <v-icon class="mr-3">mdi-whatsapp</v-icon>
        Ayuda soporte
      </v-btn>
    </v-speed-dial>
  </div>
</template>
<script>
export default {
  data: () => ({
    showButton: false,
  }),
}
</script>
<style scoped>
.v-tooltip__content {
  font-size: 100%;
  padding: 1%;
  background-color: 'tooltip';
}
</style>
