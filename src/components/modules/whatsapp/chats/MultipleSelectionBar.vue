<template>
  <div>
    <div class="gray px-4 pt-2">
      <div class="d-flex align-center">
        <v-checkbox
          v-model="activeAll"
          hide-details
          color="primary"
          class="mt-0 color-label"
          @change="$emit('is-activate-all-selection', activeAll)"
        />
        <div class="d-flex ml-10">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-switch
                  v-model="disconnectSwitch"
                  hide-details
                  color="primary"
                  class="mt-1"
                  @change="$emit('disconnect-chat', disconnectSwitch)"
                />
              </div>
            </template>
            <span>Desconectarme de chat</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-btn icon @click="$emit('assign-label')">
                  <v-icon color="primary">mdi-label</v-icon>
                </v-btn>
              </div>
            </template>
            <span>Asignar Etiqueta</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-btn icon @click="$emit('set-chat')">
                  <v-icon color="primary">mdi-pin</v-icon>
                </v-btn>
              </div>
            </template>
            <span>Fijar chat</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-btn icon @click="$emit('remove-chat')">
                  <v-icon color="primary">mdi-delete</v-icon>
                </v-btn>
              </div>
            </template>
            <span>Eliminar chat</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-btn icon @click="$emit('archive-chat')">
                  <v-icon color="primary">mdi-folder-download</v-icon>
                </v-btn>
              </div>
            </template>
            <span>Archivar chat</span>
          </v-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultipleSelectionBar',
  props: {
    isSearching: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      disconnectSwitch: true,
      activeAll: true,
    }
  },
}
</script>
<style scoped>
.dividir {
  border-bottom: 2px solid var(--v-gray-base) !important;
}
.avatar-border {
  cursor: pointer;
}
</style>
