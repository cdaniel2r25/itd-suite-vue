<template>
  <v-hover v-slot="{ hover }">
    <v-card
      width="200"
      height="200"
      color="gray"
      :class="{ 'on-hover': hover }"
      class="d-flex align-center flex-column overflow-hidden justify-center"
    >
      <div class="d-flex align-start flex-column div-width">
        <v-icon class="align-left mb-2" color="primary">mdi-eye</v-icon>
        <p class="ma-0 text-body-1 font-weight-bold text-left accent--text">
          Destinatario
        </p>
        <p
          v-for="[key, value] in Object.entries(selectedRow)"
          :key="selectedRow[key]"
          class="ma-0 text-left accent--text text-caption white-space"
        >
          {{ key === selectedHeader ? `Celular: ${value}` : '' }}
        </p>
      </div>
      <v-expand-transition>
        <div
          v-if="hover"
          class="d-flex transition-fast-in-fast-out primary--text white v-card--reveal"
        >
          <v-btn
            color="primary"
            @click="$emit('open-dialog-validate', selectedRow)"
          >
            VER PLANTILLA
          </v-btn>
        </div>
      </v-expand-transition>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'HoverCardValidateWhatsapp',
  props: {
    selectedRow: {
      type: Object,
      default: () => {},
    },
    selectedHeader: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.voher:not(.on-hover) {
  opacity: 1;
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--v-primary-base) !important;
}
.white-space {
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.div-width {
  width: 160px;
}
</style>
