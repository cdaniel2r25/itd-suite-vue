<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :width="size"
      :height="size"
      :color="backgroundColor"
      :class="{ 'on-hover': hover }"
      class="d-flex align-center flex-column overflow-hidden justify-center"
    >
      <div class="d-flex align-start flex-column div-width">
        <v-icon class="align-left mb-2" color="primary">{{ icon }}</v-icon>
        <p class="ma-0 text-body-1 font-weight-bold text-left">{{ title }}</p>
        <p class="ma-0 text-left text-caption white-space">
          {{ mailValidation.receiver }}
        </p>
        <p class="ma-0 text-left">
          {{ content }}
        </p>
      </div>
      <v-expand-transition>
        <div
          v-if="hover"
          class="d-flex transition-fast-in-fast-out primary--text white v-card--reveal"
        >
          <v-btn color="primary" @click="$emit('open-dialog', mailValidation)">
            {{ labelButton }}
          </v-btn>
        </div>
      </v-expand-transition>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'HoverCardValidateMailing',
  props: {
    mailValidation: {
      type: Object,
      default: () => {},
    },
    backgroundColor: {
      type: String,
      default: 'gray',
    },
    title: {
      type: String,
      default: 'Destinatario',
    },
    icon: {
      type: String,
      default: 'mdi-eye',
    },
    labelButton: {
      type: String,
      default: 'VER PLANTILLA',
    },
    content: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '200',
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
