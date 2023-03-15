<template>
  <v-hover v-slot="{ hover }">
    <v-card
      min-height="100"
      :class="{ 'on-hover': hover }"
      class="d-flex align-center flex-column overflow-hidden justify-center"
    >
      <div class="d-flex align-start flex-column">
        <img
          :src="`data:image/png;base64,${itemTemplate.imageContent}`"
          width="280px"
        />
      </div>
      <v-expand-transition>
        <div
          v-if="hover"
          class="d-flex flex-column transition-fast-in-fast-out primary--text v-card--reveal"
        >
          <v-btn
            text
            color="primary"
            @click="$emit('open-dialog', itemTemplate)"
          >
            {{ labelBtn }}
          </v-btn>
          <v-btn
            v-if="withoutSeeing"
            text
            color="primary"
            @click="$emit('open-view', itemTemplate)"
          >
            ver
            <v-icon right> mdi-eye </v-icon>
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
    itemTemplate: {
      type: Object,
      default: () => {},
    },
    labelBtn: {
      type: String,
      default: 'seleccionar',
    },
    withoutSeeing: {
      type: Boolean,
      default: true,
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
  background-color: rgba(245, 245, 245, 0.8);
}
.white-space {
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
